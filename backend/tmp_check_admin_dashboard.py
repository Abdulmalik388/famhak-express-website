import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'famhak.settings.dev')
import django
django.setup()
from apps.orders.models import Order
from apps.payments.models import Payment
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
User = get_user_model()
print('orders', Order.objects.count())
print('payments', Payment.objects.count())
print('success payments', Payment.objects.filter(status='success').count())
print('customers', User.objects.filter(role='customer').count())
print('riders', User.objects.filter(role='rider').count())
print('pending orders', Order.objects.filter(status='pending').count())
print('active orders', Order.objects.filter(status__in=['assigned','picked_up','in_transit']).count())
print('delivered orders', Order.objects.filter(status='delivered').count())
for i in range(7):
    day = timezone.now().date() - timedelta(days=i)
    print(day.isoformat(), Payment.objects.filter(status='success', paid_at__date=day).count(), Order.objects.filter(created_at__date=day).count())
