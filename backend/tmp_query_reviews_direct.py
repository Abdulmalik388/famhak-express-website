import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'famhak.settings.dev')
import django
django.setup()
from apps.accounts.models import User
from apps.orders.models import Review
from django.db.models import Avg

rider = User.objects.filter(role='rider').first()
if not rider:
    print('No rider found')
else:
    reviews = Review.objects.filter(rider=rider)
    print('rider', rider.email, 'reviews count', reviews.count())
    avg = reviews.aggregate(avg=Avg('rating'))['avg']
    print('avg:', avg)
    for r in reviews:
        print(r.id, r.rating, r.comment, r.created_at)
