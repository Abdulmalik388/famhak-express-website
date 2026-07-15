from django.urls import path
from . import views

urlpatterns = [
    path('overview/', views.admin_overview, name='admin-overview'),
    path('orders/', views.admin_all_orders, name='admin-orders'),
    path('orders/<uuid:order_id>/update/', views.admin_update_order, name='admin-update-order'),
    path('users/', views.admin_all_users, name='admin-users'),
    path('users/<uuid:user_id>/delete/', views.admin_delete_user, name='admin-delete-user'),
    path('payments/', views.admin_all_payments, name='admin-payments'),
    path('reviews/', views.admin_all_reviews, name='admin-reviews'),
]