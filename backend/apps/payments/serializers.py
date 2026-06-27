from rest_framework import serializers
from .models import Payment, RiderEarning


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class RiderEarningSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiderEarning
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class InitializePaymentSerializer(serializers.Serializer):
    order_id = serializers.UUIDField()