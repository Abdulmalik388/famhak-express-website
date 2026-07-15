from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Sum, Avg
from django.utils import timezone
from datetime import timedelta
from apps.orders.models import Order, Review
from apps.payments.models import Payment
from django.contrib.auth import get_user_model

User = get_user_model()


def is_admin(user):
    return user.role == 'admin'


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_overview(request):
    if not is_admin(request.user):
        return Response({'error': 'Admin only'}, status=403)

    total_orders = Order.objects.count()
    total_revenue = Payment.objects.filter(status='success').aggregate(
        total=Sum('amount'))['total'] or 0
    total_customers = User.objects.filter(role='customer').count()
    total_riders = User.objects.filter(role='rider').count()
    pending_orders = Order.objects.filter(status='pending').count()
    delivered_orders = Order.objects.filter(status='delivered').count()
    active_orders = Order.objects.filter(
        status__in=['assigned', 'picked_up', 'in_transit']).count()

    # Last 7 days revenue
    last_7_days = []
    for i in range(6, -1, -1):
        day = timezone.now().date() - timedelta(days=i)
        revenue = Payment.objects.filter(
            status='success',
            paid_at__date=day
        ).aggregate(total=Sum('amount'))['total'] or 0
        orders = Order.objects.filter(created_at__date=day).count()
        last_7_days.append({
            'date': day.strftime('%b %d'),
            'revenue': float(revenue),
            'orders': orders
        })

    return Response({
        'total_orders': total_orders,
        'total_revenue': float(total_revenue),
        'total_customers': total_customers,
        'total_riders': total_riders,
        'pending_orders': pending_orders,
        'delivered_orders': delivered_orders,
        'active_orders': active_orders,
        'last_7_days': last_7_days,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_all_orders(request):
    if not is_admin(request.user):
        return Response({'error': 'Admin only'}, status=403)
    from apps.orders.serializers import OrderSerializer
    orders = Order.objects.all().order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_all_users(request):
    if not is_admin(request.user):
        return Response({'error': 'Admin only'}, status=403)
    from apps.accounts.serializers import UserSerializer
    role = request.query_params.get('role', None)
    users = User.objects.all().order_by('-created_at')
    if role:
        users = users.filter(role=role)
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_all_payments(request):
    if not is_admin(request.user):
        return Response({'error': 'Admin only'}, status=403)
    from apps.payments.serializers import PaymentSerializer
    payments = Payment.objects.all().order_by('-created_at')
    serializer = PaymentSerializer(payments, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_all_reviews(request):
    if not is_admin(request.user):
        return Response({'error': 'Admin only'}, status=403)
    from apps.orders.serializers import ReviewSerializer
    reviews = Review.objects.all().order_by('-created_at')
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def admin_update_order(request, order_id):
    if not is_admin(request.user):
        return Response({'error': 'Admin only'}, status=403)
    from apps.orders.serializers import OrderSerializer
    try:
        order = Order.objects.get(id=order_id)
        new_status = request.data.get('status')
        if new_status:
            order.status = new_status
            order.save()
        return Response(OrderSerializer(order).data)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def admin_delete_user(request, user_id):
    if not is_admin(request.user):
        return Response({'error': 'Admin only'}, status=403)
    try:
        user = User.objects.get(id=user_id)
        if user.role == 'admin':
            return Response({'error': 'Cannot delete admin accounts'}, status=400)
        user.delete()
        return Response({'message': 'User deleted successfully'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)