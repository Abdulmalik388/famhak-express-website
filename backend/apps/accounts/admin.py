from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'full_name', 'role', 'phone', 'is_verified', 'created_at']
    list_filter = ['role', 'is_verified']
    search_fields = ['email', 'full_name']