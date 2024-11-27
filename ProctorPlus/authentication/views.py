from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.db import IntegrityError

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    try:
        email = request.data.get('email')
        phone = request.data.get('phone')
        password = request.data.get('password')
        if not all([email, phone, password]):
            return Response({
                'status': 'error',
                'message': 'All fields are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user already exists
        if User.objects.filter(email=email).exists():
            return Response({
                'status': 'error',
                'message': 'User with this email already exists'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(
            username=email,  # Using email as username
            email=email,
            phone=phone,
            password=password
        )
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'status': 'success',
            'message': 'User created successfully',
            'data': {
                'token': str(refresh.access_token),
                'user': {
                    'email': user.email,
                    'phone': user.phone
                }
            }
        }, status=status.HTTP_201_CREATED)
        
    except IntegrityError:
        return Response({
            'status': 'error',
            'message': 'User with this email already exists'
        }, status=status.HTTP_400_BAD_REQUEST)
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
                'phone': request.user.phone
            }
        }
    })