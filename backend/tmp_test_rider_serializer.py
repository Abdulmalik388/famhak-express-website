import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'famhak.settings.dev')
import django
django.setup()
from apps.accounts.serializers import CreateRiderSerializer
from apps.accounts.models import User

users = list(User.objects.all().values('email', 'full_name', 'role'))
print('existing users:', users[:5])
data = {'email': 'admin-test-rider@example.com', 'full_name': 'Admin Test Rider', 'phone': '08012345678', 'password': 'password123'}
serializer = CreateRiderSerializer(data=data)
print('valid', serializer.is_valid())
print('errors', serializer.errors)
print('fields', serializer.fields)
