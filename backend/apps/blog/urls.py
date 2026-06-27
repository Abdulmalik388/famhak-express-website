from django.urls import path
from .views import blog_list, featured_blog, blog_detail

urlpatterns = [
    path('', blog_list, name='blog-list'),
    path('featured/', featured_blog, name='blog-featured'),
    path('<slug:slug>/', blog_detail, name='blog-detail'),
]
