from rest_framework import serializers

from .models import BlogPost


class BlogPostSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = (
            'id',
            'title',
            'slug',
            'excerpt',
            'content',
            'author',
            'image_url',
            'featured',
            'published_at',
        )

    def get_image_url(self, obj):
        image = getattr(obj, 'image_url', None)
        if not image:
            return None

        if hasattr(image, 'url'):
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(image.url)
            return image.url

        return image
