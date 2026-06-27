from django.conf import settings
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .serializers import ContactSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def contact_form(request):
	serializer = ContactSerializer(data=request.data)
	if not serializer.is_valid():
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	contact = serializer.save()
	# No emails sent: save the contact only

	return Response({'detail': 'Contact submitted successfully'}, status=status.HTTP_201_CREATED)
