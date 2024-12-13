from functools import wraps
from django.http import JsonResponse

def requires_auth(f):
    @wraps(f)
    def decorated_function(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required'}, status=401)
        return f(request, *args, **kwargs)
    return decorated_function

# authentication/views.py
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .decorators import requires_auth

@csrf_exempt
@require_http_methods(["POST"])
def clerk_webhook(request):
    try:
        data = json.loads(request.body)
        # Handle different webhook events
        event_type = data.get('type')
        
        if event_type == 'user.created':
            # Handle user creation
            pass
        elif event_type == 'user.updated':
            # Handle user update
            pass
        
        return JsonResponse({'status': 'success'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@requires_auth
def get_user_profile(request):
    user = request.user
    return JsonResponse({
        'id': user.id,
        'clerk_user_id': user.clerk_user_id,
        'username': user.username,
        'email': user.email,
        'email_verified': user.email_verified,
        'profile_image_url': user.profile_image_url
    })
