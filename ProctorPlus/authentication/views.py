from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.db import IntegrityError
import base64
from django.core.files.base import ContentFile
import uuid


User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    try:
        email = request.data.get('email')
        phone = request.data.get('phone')
        password = request.data.get('password')
        image_data = request.data.get('image')  # Base64 image data
        
        if not all([email, phone, password, image_data]):
            return Response({
                'status': 'error',
                'message': 'All fields including image are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=email).exists():
            return Response({
                'status': 'error',
                'message': 'User with this email already exists'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Process the base64 image
        if image_data:
            format, imgstr = image_data.split(';base64,')
            ext = format.split('/')[-1]
            filename = f"{uuid.uuid4()}.{ext}"
            data = ContentFile(base64.b64decode(imgstr))
        
        user = User.objects.create_user(
            username=email,
            email=email,
            phone=phone,
            password=password
        )
        
        if image_data:
            user.profile_image.save(filename, data, save=True)
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'status': 'success',
            'message': 'User created successfully',
            'data': {
                'token': str(refresh.access_token),
                'user': {
                    'email': user.email,
                    'phone': user.phone,
                    'profile_image': user.profile_image.url if user.profile_image else None
                }
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not all([email, password]):
        return Response({
            'status': 'error',
            'message': 'Both email and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
        if user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                'status': 'success',
                'message': 'Login successful',
                'data': {
                    'token': str(refresh.access_token),
                    'user': {
                        'email': user.email,
                        'phone': user.phone
                    }
                }
            })
        return Response({
            'status': 'error',
            'message': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    return Response({
        'status': 'success',
        'data': {
            'user': {
                'email': request.user.email,
                'phone': request.user.phone,
                'profile_image': request.user.profile_image.url if request.user.profile_image else None
            }
        }
    })