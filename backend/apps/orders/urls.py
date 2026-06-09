from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_order, name='create-order'),
    path('my-orders/', views.my_orders, name='my-orders'),
    path('available/', views.available_orders, name='available-orders'),
    path('estimate-price/', views.estimate_price, name='estimate-price'),
    path('<uuid:order_id>/', views.order_detail, name='order-detail'),
    path('<uuid:order_id>/update-status/', views.update_order_status, name='update-order-status'),
]