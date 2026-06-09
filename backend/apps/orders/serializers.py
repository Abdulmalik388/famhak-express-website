from rest_framework import serializers
from .models import Order
from apps.accounts.serializers import UserSerializer
import math


def calculate_distance(lat1, lng1, lat2, lng2):
    # Haversine formula — calculates distance between two coordinates in KM
    R = 6371  # Earth radius in kilometers

    lat1, lng1, lat2, lng2 = map(math.radians, [float(lat1), float(lng1), float(lat2), float(lng2)])

    dlat = lat2 - lat1
    dlng = lng2 - lng1

    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlng/2)**2
    c = 2 * math.asin(math.sqrt(a))

    return round(R * c, 2)


def calculate_price(distance_km, package_size):
    # Base fare
    base_fare = 1500

    # Price per KM based on package size
    if package_size == 'small':
        price_per_km = 300
    elif package_size == 'medium':
        price_per_km = 400
    else:  # large
        price_per_km = 600

    # Calculate total
    price = base_fare + (price_per_km * distance_km)

    # Minimum price is 3000
    return max(round(price), 3000)

class OrderSerializer(serializers.ModelSerializer):
    customer_detail = UserSerializer(source='customer', read_only=True)
    rider_detail = UserSerializer(source='rider', read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['id', 'customer', 'created_at', 'updated_at']


class CreateOrderSerializer(serializers.ModelSerializer):
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

        # Calculate distance
        distance_km = calculate_distance(
            validated_data['pickup_lat'],
            validated_data['pickup_lng'],
            validated_data['dropoff_lat'],
            validated_data['dropoff_lng'],
        )

        # Calculate price
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


