from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from .models import Order
from .serializers import OrderSerializer, CreateOrderSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    if request.user.role != 'customer':
        return Response(
            {'error': 'Only customers can place orders'},
            status=status.HTTP_403_FORBIDDEN
        )
    serializer = CreateOrderSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        order = serializer.save()
        return Response({
            'message': 'Order placed successfully',
            'order': OrderSerializer(order).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_orders(request):
    if request.user.role == 'customer':
        orders = Order.objects.filter(customer=request.user)
    elif request.user.role == 'rider':
        orders = Order.objects.filter(rider=request.user)
    else:
        orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_detail(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = OrderSerializer(order)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def available_orders(request):
    if request.user.role != 'rider':
        return Response(
            {'error': 'Only riders can view available orders'},
            status=status.HTTP_403_FORBIDDEN
        )
    orders = Order.objects.filter(status='pending', rider=None)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_order_status(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get('status')

    if new_status == 'assigned':
        if request.user.role != 'rider':
            return Response(
                {'error': 'Only riders can accept orders'},
                status=status.HTTP_403_FORBIDDEN
            )
        order.rider = request.user
        order.status = 'assigned'
        order.save()
        return Response({
            'message': 'Order accepted',
            'order': OrderSerializer(order).data
        })

    if request.user.role == 'rider' and order.rider == request.user:
        order.status = new_status
        if new_status == 'delivered':
            order.delivered_at = timezone.now()
        order.save()
        return Response({
            'message': 'Status updated',
            'order': OrderSerializer(order).data
        })

    if request.user.role == 'customer' and order.customer == request.user:
        if order.status != 'pending':
            return Response(
                {'error': 'You can only cancel pending orders'},
                status=status.HTTP_400_BAD_REQUEST
            )
        order.status = 'cancelled'
        order.save()
        return Response({
            'message': 'Order cancelled',
            'order': OrderSerializer(order).data
        })

    return Response(
        {'error': 'You do not have permission to update this order'},
        status=status.HTTP_403_FORBIDDEN
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def estimate_price(request):
    pickup_lat = request.data.get('pickup_lat')
    pickup_lng = request.data.get('pickup_lng')
    dropoff_lat = request.data.get('dropoff_lat')
    dropoff_lng = request.data.get('dropoff_lng')
    package_size = request.data.get('package_size', 'small')

    if not all([pickup_lat, pickup_lng, dropoff_lat, dropoff_lng]):
        return Response(
            {'error': 'Please provide all coordinates'},
            status=status.HTTP_400_BAD_REQUEST
        )

    from .serializers import calculate_distance, calculate_price
    distance_km = calculate_distance(pickup_lat, pickup_lng, dropoff_lat, dropoff_lng)
    price = calculate_price(distance_km, package_size)

    return Response({
        'distance_km': distance_km,
        'price': price,
        'breakdown': {
            'base_fare': 1500,
            'distance': f'{distance_km} km',
            'package_size': package_size,
            'total': price
        }
    })