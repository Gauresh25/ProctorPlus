import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import JsonResponse

class ClerkAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith('/admin/') or request.path.startswith('/api/public/'):
            return self.get_response(request)

        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'No token provided'}, status=401)

        token = auth_header.split(' ')[1]
        try:
            # Verify and decode the JWT token
            decoded_token = jwt.decode(
                token,
                settings.CLERK_JWT_PUBLIC_KEY,  # Changed from CLERK_SECRET_KEY
                algorithms=['RS256'],           # Changed from HS256
                options={'verify_aud': False}
            )
            
            # Extract user data from Clerk's token structure
            user_data = {
                'clerk_user_id': decoded_token['sub'],
                'email': decoded_token.get('email', ''),
                'username': decoded_token.get('email', '').split('@')[0],  # Fallback username
                'email_verified': decoded_token.get('email_verified', False)
            }
            
            # Get or create user with all fields
            User = get_user_model()
            user, created = User.objects.update_or_create(
                clerk_user_id=user_data['clerk_user_id'],
                defaults={
                    'username': user_data['username'],
                    'email': user_data['email'],
                    'email_verified': user_data['email_verified'],
                }
            )
            
            # Important: Set authentication status
            user.is_authenticated = True
            request.user = user
            
        except jwt.InvalidTokenError as e:
            print(f"Token validation error: {str(e)}")  # Add logging
            return JsonResponse({'error': 'Invalid token'}, status=401)
        except Exception as e:
            print(f"Unexpected error: {str(e)}")  # Add logging
            return JsonResponse({'error': str(e)}, status=500)

        return self.get_response(request)