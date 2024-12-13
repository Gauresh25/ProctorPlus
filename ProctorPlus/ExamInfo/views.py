from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model  # Import the custom user model dynamically
from .models import Exam
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json

User = get_user_model()  # Use the custom user model

@api_view(['GET'])
def hello_world(request):
    return Response({
        "message": "Hello, World!"
    })

@api_view(['POST'])
def add_exam_info(request):
    if request.method == 'POST':
        try:
            # Parse the incoming JSON data
            data = json.loads(request.body)

            # Extract the relevant fields from the data
            title = data.get('title')
            created_by_id = data.get('created_by')
            user_ids = data.get('user')  # List of user IDs

            # Validate the inputs
            if not title or not created_by_id or not user_ids:
                return JsonResponse({'error': 'Missing required fields'}, status=400)

            # Get the created_by user
            created_by = User.objects.get(id=created_by_id)

            # Create the Exam object
            exam = Exam.objects.create(
                title=title,
                created_by=created_by,
            )

            # Add users to the exam (assuming user IDs are valid)
            users = User.objects.filter(id__in=user_ids)
            exam.user.set(users)  # Set the users for this exam

            # Save the exam instance
            exam.save()

            return JsonResponse({'success': 'Exam created successfully'}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

@api_view(['POST'])
def get_user_exam(request):
    try:
      data = json.loads(request.body)
      id = data.get("id")
      exams = Exam.objects.filter(user__id=id)
      exams_data = [
            {
                "id": exam.id,
                "title": exam.title,
                "created_by": exam.created_by.username,
                "users": list(exam.user.values("id", "username")),  # Include associated users
                "created_at": exam.created_at,
                "updated_at": exam.updated_at,
            }
            for exam in exams
        ]
      return JsonResponse({"success": True, "exams": exams_data})   
    except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    
