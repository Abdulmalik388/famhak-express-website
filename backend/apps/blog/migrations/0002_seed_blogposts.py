from django.db import migrations
from django.utils import timezone
from django.utils.text import slugify


def unique_slug(model, title):
    base_slug = slugify(title)
    slug = base_slug
    counter = 1
    while model.objects.filter(slug=slug).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1
    return slug


def create_initial_blog_posts(apps, schema_editor):
    BlogPost = apps.get_model('blog', 'BlogPost')
    if BlogPost.objects.exists():
        return

    now = timezone.now()
    BlogPost.objects.create(
        title='How Famhak Keeps Deliveries Moving Fast in Lagos',
        slug=unique_slug(BlogPost, 'How Famhak Keeps Deliveries Moving Fast in Lagos'),
        excerpt='Discover the smart route planning and rider coordination that powers our fast local deliveries.',
        content='Famhak Express uses optimized route planning, real-time rider tracking, and local logistics expertise to keep shipments moving through Nigeria’s busiest cities. Our teams monitor traffic patterns and delivery windows to ensure packages arrive on time and in perfect condition.',
        author='Famhak Express Team',
        image_url='https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80',
        featured=True,
        published_at=now,
    )
    BlogPost.objects.create(
        title='Top 5 Tips for Safe Package Delivery',
        slug=unique_slug(BlogPost, 'Top 5 Tips for Safe Package Delivery'),
        excerpt='Learn how to prepare your package and coordinate with your rider for a smoother delivery experience.',
        content='Packaging correctly and sharing precise pickup details can save time and keep your delivery safe. We encourage customers to label fragile items clearly, choose secure wrapping, and remain available for rider communication throughout the process.',
        author='Famhak Express Team',
        image_url='https://images.unsplash.com/photo-1495121605193-b116b5b09a48?auto=format&fit=crop&w=1200&q=80',
        featured=False,
        published_at=now,
    )


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_initial_blog_posts),
    ]
