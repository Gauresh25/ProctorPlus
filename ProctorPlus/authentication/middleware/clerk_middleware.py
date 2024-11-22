import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import JsonResponse

class ClerkAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Skip authentication for certain paths
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
                settings.CLERK_SECRET_KEY,
                algorithms=['HS256'],
                options={'verify_aud': False}
            )
            
            # Get or create user
            User = get_user_model()
            user, created = User.objects.get_or_create(
                clerk_user_id=decoded_token['sub'],
                defaults={
                    'username': decoded_token.get('username', ''),
                    'email': decoded_token.get('email', ''),
                    'email_verified': decoded_token.get('email_verified', False)
                }
            )
            
            request.user = user
            
        except jwt.InvalidTokenError:
            return JsonResponse({'error': 'Invalid token'}, status=401)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

        return self.get_response(request)
