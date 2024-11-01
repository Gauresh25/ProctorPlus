# hello/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Greeting  # Make sure to import the Greeting model

@api_view(['GET'])
def hello_world(request):
    return Response({
        "message": "Hello, World!"
    })

@api_view(['GET', 'POST'])
def greetings(request):
    if request.method == 'GET':
        # Return all greetings from the database
        messages = Greeting.objects.values('id', 'message')  # Use capital G for Greeting
        return Response(list(messages))
    
    elif request.method == 'POST':
        # Create a new greeting
        message = request.data.get('message', '')
        if message:
            greeting = Greeting.objects.create(message=message)  # Use capital G for Greeting
            return Response({
                'id': greeting.id,
                'message': greeting.message
            })
        return Response({'error': 'Message is required'}, status=400)