from django.contrib import admin
from .models import Payment, RiderEarning

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['reference', 'user', 'order', 'amount', 'status', 'paid_at', 'created_at']
    list_filter = ['status']
    search_fields = ['reference', 'user__email']

@admin.register(RiderEarning)
class RiderEarningAdmin(admin.ModelAdmin):
    list_display = ['rider', 'order', 'amount', 'created_at']
    search_fields = ['rider__email']