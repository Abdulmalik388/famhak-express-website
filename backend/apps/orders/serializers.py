from rest_framework import serializers
from .models import Order
from apps.accounts.serializers import UserSerializer
import math


def calculate_distance(lat1, lng1, lat2, lng2):
    R = 6371
    lat1, lng1, lat2, lng2 = map(math.radians, [float(lat1), float(lng1), float(lat2), float(lng2)])
    dlat = lat2 - lat1
    dlng = lng2 - lng1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlng/2)**2
    c = 2 * math.asin(math.sqrt(a))
    return round(R * c, 2)


def calculate_price(distance_km, package_size):
    base_fare = 1500
    if package_size == 'small':
        price_per_km = 300
    elif package_size == 'medium':
        price_per_km = 400
    else:
        price_per_km = 600
    price = base_fare + (price_per_km * distance_km)
    return max(round(price), 3000)


class OrderSerializer(serializers.ModelSerializer):
    customer_detail = UserSerializer(source='customer', read_only=True)
    rider_detail = UserSerializer(source='rider', read_only=True)
    is_paid = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['id', 'customer', 'created_at', 'updated_at']

    def get_is_paid(self, obj):
        try:
            return obj.payment.status == 'success'
        except:
            return False


class CreateOrderSerializer(serializers.ModelSerializer):
    pickup_lat = serializers.FloatField()
    pickup_lng = serializers.FloatField()
    dropoff_lat = serializers.FloatField()
    dropoff_lng = serializers.FloatField()

    class Meta:
        model = Order
        fields = [
            'pickup_address', 'pickup_lat', 'pickup_lng',
            'dropoff_address', 'dropoff_lat', 'dropoff_lng',
            'package_description', 'package_size',
            'receiver_name', 'receiver_phone',
        ]

    def validate(self, data):
        if not all([data.get('pickup_lat'), data.get('pickup_lng'),
                    data.get('dropoff_lat'), data.get('dropoff_lng')]):
            raise serializers.ValidationError(
                'Please select both pickup and dropoff locations on the map'
            )
        return data

    def create(self, validated_data):
        customer = self.context['request'].user
        distance_km = calculate_distance(
            validated_data['pickup_lat'], validated_data['pickup_lng'],
            validated_data['dropoff_lat'], validated_data['dropoff_lng'],
        )
        price = calculate_price(distance_km, validated_data.get('package_size', 'small'))
        order = Order.objects.create(
            customer=customer,
            price=price,
            distance_km=distance_km,
            **validated_data
        )
        return order


class UpdateOrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status']