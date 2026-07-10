from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_notifications, name='get-notifications'),
    path('unread-count/', views.unread_count, name='unread-count'),
    path('mark-read/<uuid:notification_id>/', views.mark_as_read, name='mark-as-read'),
    path('mark-all-read/', views.mark_all_read, name='mark-all-read'),
    path('contact/', views.contact_form, name='contact-form'),
]