from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
from django.utils import timezone
import requests
import uuid
from .models import Payment, RiderEarning
from .serializers import PaymentSerializer, RiderEarningSerializer
from apps.orders.models import Order
from apps.notifications.utils import notify_payment_success


def generate_reference():
    return f'FAMHAK-{uuid.uuid4().hex[:12].upper()}'


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def initialize_payment(request):
    order_id = request.data.get('order_id')

    try:
        order = Order.objects.get(id=order_id, customer=request.user)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

    existing_payment = Payment.objects.filter(order=order).first()

    if existing_payment and existing_payment.status == 'success':
        return Response({'error': 'Order already paid'}, status=status.HTTP_400_BAD_REQUEST)

    if existing_payment:
        existing_payment.reference = generate_reference()
        existing_payment.amount = order.price
        existing_payment.status = 'pending'
        existing_payment.save()
        payment = existing_payment
    else:
        payment = Payment.objects.create(
            user=request.user,
            order=order,
            amount=order.price,
            reference=generate_reference(),
            status='pending'
        )

    return Response({
        'reference': payment.reference,
        'amount': int(order.price * 100),
        'email': request.user.email,
        'public_key': settings.PAYSTACK_PUBLIC_KEY,
        'order_id': str(order.id),
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    reference = request.data.get('reference')

    print("===================================")
    print("VERIFY PAYMENT CALLED")
    print("REFERENCE:", reference)
    print("===================================")

    if not reference:
        return Response(
            {'error': 'No reference was sent to verify'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        payment = Payment.objects.get(reference=reference)
        order = payment.order
        print("PAYMENT FOUND:", payment.reference)
        print("CURRENT STATUS:", payment.status)
        print("PAYMENT ORDER:", order.id if order else 'None')

    except Payment.DoesNotExist:
        return Response(
            {'error': f'No payment record found for {reference}'},
            status=status.HTTP_404_NOT_FOUND
        )

    if payment.status == 'success':
        return Response({
            'message': 'Payment already verified',
            'payment': PaymentSerializer(payment).data
        })

    if order is None:
        return Response(
            {'error': 'Payment is not linked to an order'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        secret_key = getattr(settings, 'PAYSTACK_SECRET_KEY', None)
        if not secret_key:
            return Response(
                {'error': 'Payment gateway is not configured'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        masked_secret = f'{secret_key[:4]}***{secret_key[-4:]}' if secret_key else 'None'
        headers = {
            'Authorization': f'Bearer {secret_key}',
            'Content-Type': 'application/json',
        }

        print('PAYSTACK SECRET KEY LOADED:', masked_secret)
        print('PAYSTACK AUTH HEADER:', headers['Authorization'])

        paystack_response = requests.get(
            f'https://api.paystack.co/transaction/verify/{reference}',
            headers=headers,
            timeout=15
        )

        data = paystack_response.json()

        print('PAYSTACK RESPONSE:')
        print(data)

    except Exception as e:
        print("PAYSTACK ERROR:", str(e))

        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    if not data.get('status'):
        return Response(
            {
                'error': data.get(
                    'message',
                    'Paystack verification failed'
                )
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if data['data']['status'] != 'success':
        return Response(
            {
                'error': f'Payment status is {data["data"]["status"]}'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # UPDATE PAYMENT
    payment.status = 'success'
    payment.paid_at = timezone.now()
    payment.save()

    # UPDATE ORDER
    order.payment_status = 'paid'
    order.save()

    notify_payment_success(order)

    print("PAYMENT UPDATED TO SUCCESS")
    print("ORDER UPDATED TO PAID")

    # CREATE RIDER EARNING
    if order and order.rider:
        rider_amount = order.price * 80 / 100

        RiderEarning.objects.get_or_create(
            order=order,
            defaults={
                'rider': order.rider,
                'amount': rider_amount
            }
        )

    return Response({
        'message': 'Payment verified successfully',
        'payment': PaymentSerializer(payment).data
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_history(request):
    payments = Payment.objects.filter(user=request.user)
    serializer = PaymentSerializer(payments, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def rider_earnings(request):
    if request.user.role != 'rider':
        return Response({'error': 'Only riders can view earnings'}, status=status.HTTP_403_FORBIDDEN)
    earnings = RiderEarning.objects.filter(rider=request.user)
    total = sum(e.amount for e in earnings)
    serializer = RiderEarningSerializer(earnings, many=True)
    return Response({'total_earnings': total, 'earnings': serializer.data})