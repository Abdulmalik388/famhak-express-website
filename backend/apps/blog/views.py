from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import BlogPost
from .serializers import BlogPostSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def blog_list(request):
    posts = BlogPost.objects.all()
    serializer = BlogPostSerializer(posts, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def featured_blog(request):
    post = BlogPost.objects.filter(featured=True).first()
    if not post:
        return Response({'detail': 'No featured blog found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = BlogPostSerializer(post)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def blog_detail(request, slug):
    try:
        post = BlogPost.objects.get(slug=slug)
    except BlogPost.DoesNotExist:
        return Response({'detail': 'Blog post not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = BlogPostSerializer(post)
    return Response(serializer.data)
