from django.contrib import admin

from .models import BlogPost


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'featured', 'published_at')
    list_filter = ('featured', 'published_at')
    search_fields = ('title', 'author')
    fields = ('title', 'content', 'author', 'image_url', 'featured', 'published_at')
