from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
from .models import ExamSubmission, MCQAnswer, DescriptiveAnswer, DomainSpecificAnswer, BehaviorAnalysis
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_exam(request):
    try:
        logger.info("Receiving exam submission")
        
        # Create main submission
        submission = ExamSubmission.objects.create(
            user=request.user,
            domain=request.data.get('domain', 'coding')  # default to coding if not specified
        )
        
        # Save MCQ answers
        mcq_answers = request.data.get('mcqs', {})
        for question_id, answer in mcq_answers.items():
            MCQAnswer.objects.create(
                submission=submission,
                question_id=question_id,
                answer=answer
            )
        
        # Save descriptive answers
        descriptive_answers = request.data.get('descriptive', {})
        for question_id, answer in descriptive_answers.items():
            DescriptiveAnswer.objects.create(
                submission=submission,
                question_id=question_id,
                answer=answer
            )
        
        # Handle domain-specific answers
        domain = submission.domain
        if domain == 'coding':
            DomainSpecificAnswer.objects.create(
                submission=submission,
                code=request.data.get('code', ''),
                language=request.data.get('language', 'javascript'),
                question_id=f'{domain}-dsa-1'
            )
        elif domain == 'design':
            DomainSpecificAnswer.objects.create(
                submission=submission,
                design_file_url="placeholder_url",
                design_description=request.data.get('designDescription', ''),
                question_id=f'{domain}-design-1'
            )
        elif domain == 'marketing':
            DomainSpecificAnswer.objects.create(
                submission=submission,
                video_file_url="placeholder_url",
                video_description=request.data.get('videoDescription', ''),
                question_id=f'{domain}-marketing-1'
            )
        
        # Save behavior analysis
        behavior_data = request.data.get('behaviorAnalysis', {})
        if behavior_data:
            BehaviorAnalysis.objects.create(
                submission=submission,
                is_likely_bot=behavior_data.get('isLikelyBot', False),
                confidence=behavior_data.get('confidence', 0.0),
                reasons=behavior_data.get('reasons', []),
                key_timing=behavior_data.get('keyTiming', []),
                special_key_count=behavior_data.get('specialKeyCount', 0),
                typing_speed=behavior_data.get('typingSpeed', []),
                backspace_count=behavior_data.get('backspaceCount', 0),
                total_key_presses=behavior_data.get('totalKeyPresses', 0)
            )
        
        return Response({
            'status': 'success',
            'message': 'Exam submitted successfully',
            'submissionId': submission.id
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"Error in submit_exam: {str(e)}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)
