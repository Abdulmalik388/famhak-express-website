import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'famhak.settings.dev')
import django
django.setup()
from django.test import RequestFactory
from django.contrib.auth import get_user_model
from apps.orders import views

User = get_user_model()

rider = User.objects.filter(role='rider').first()
if not rider:
    print('No rider users found')
else:
    print('Testing rider id:', rider.id)
    rf = RequestFactory()
    request = rf.get(f'/api/orders/reviews/rider/{rider.id}/')
    request.user = rider  # authenticated as rider
    response = views.rider_reviews(request, rider_id=rider.id)
    print('status:', response.status_code)
    print('data:', response.data)
