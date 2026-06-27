from django.urls import path
from . import views

urlpatterns = [
    path('initialize/', views.initialize_payment, name='initialize-payment'),
    path('verify/', views.verify_payment, name='verify-payment'),
    path('history/', views.payment_history, name='payment-history'),
    path('rider-earnings/', views.rider_earnings, name='rider-earnings'),
]