from django.contrib import admin
from .models import Order, Review


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'rider', 'status', 'price', 'is_paid_display', 'created_at']
    list_filter = ['status', 'package_size']
    search_fields = ['pickup_address', 'dropoff_address', 'receiver_name']

    def is_paid_display(self, obj):
        try:
            return obj.payment.status == 'success'
        except:
            return False
    is_paid_display.short_description = 'Paid'
    is_paid_display.boolean = True


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['reviewer', 'rider', 'rating', 'created_at']
    list_filter = ['rating']
    search_fields = ['reviewer__email', 'rider__email', 'comment']