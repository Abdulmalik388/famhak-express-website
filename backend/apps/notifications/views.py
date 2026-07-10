from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer
from django.core.mail import send_mail


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    notifications = Notification.objects.filter(user=request.user)
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def unread_count(request):
    count = Notification.objects.filter(user=request.user, is_read=False).count()
    return Response({'unread_count': count})


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def mark_as_read(request, notification_id):
    try:
        notification = Notification.objects.get(id=notification_id, user=request.user)
        notification.is_read = True
        notification.save()
        return Response({'message': 'Marked as read'})
    except Notification.DoesNotExist:
        return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def mark_all_read(request):
    Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
    return Response({'message': 'All notifications marked as read'})


@api_view(['POST'])
@permission_classes([AllowAny])
def contact_form(request):
    name = request.data.get('name')
    email = request.data.get('email')
    subject = request.data.get('subject')
    message = request.data.get('message')

    if not all([name, email, subject, message]):
        return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

    full_message = f'''
New contact form submission from Famhak Express website:

Name: {name}
Email: {email}
Subject: {subject}
Message:
{message}
    '''.strip()

    try:
        send_mail(
            subject=f'Famhak Express Contact — {subject}',
            message=full_message,
            from_email='famhaklawal2020@gmail.com',
            recipient_list=['famhaklawal2020@gmail.com'],
            fail_silently=False,
        )
        send_mail(
            subject='We received your message — Famhak Express',
            message=f'Hi {name},\n\nThank you for contacting Famhak Express! We have received your message and will get back to you within 24 hours.\n\nTeam Famhak Express',
            from_email='famhaklawal2020@gmail.com',
            recipient_list=[email],
            fail_silently=True,
        )
    except Exception as e:
        print(f'Email error: {e}')

    return Response({'message': 'Message sent successfully'})