# submission/views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
from .models import ExamSubmission, MCQAnswer, DescriptiveAnswer, DomainSpecificAnswer, BehaviorAnalysis
from .evaluator import ExamEvaluator
import logging
import json

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_exam(request):
    try:
        # Get examData from form data and parse it as JSON
        exam_data = json.loads(request.data.get('examData', '{}'))
        logger.info(f"Parsed exam data: {json.dumps(exam_data, indent=2)}")
        
        # Create main submission
        submission = ExamSubmission.objects.create(
            user=request.user,
            domain=exam_data.get('domain', 'coding')
        )
        
        # Get answers section
        answers = exam_data.get('answers', {})
        
        # Save descriptive answers
        descriptive_answers = answers.get('descriptive', [])
        for desc in descriptive_answers:
            DescriptiveAnswer.objects.create(
                submission=submission,
                question_id=desc.get('questionId'),
                answer=desc.get('answer')
            )
        
        # Save MCQ answers
        mcq_answers = answers.get('mcqs', [])
        for mcq in mcq_answers:
            MCQAnswer.objects.create(
                submission=submission,
                question_id=mcq.get('questionId'),
                answer=mcq.get('answer')
            )
        
        # Handle domain-specific answers
        domain_specific = answers.get('domainSpecific', {})
        if domain_specific:
            if submission.domain == 'coding':
                DomainSpecificAnswer.objects.create(
                    submission=submission,
                    code=domain_specific.get('code', ''),
                    language=domain_specific.get('language', 'javascript'),
                    question_id=f'{submission.domain}-dsa-1'
                )
            elif submission.domain == 'design':
                DomainSpecificAnswer.objects.create(
                    submission=submission,
                    design_file_url="placeholder_url",
                    design_description=domain_specific.get('description', ''),
                    question_id=f'{submission.domain}-design-1'
                )
            elif submission.domain == 'marketing':
                DomainSpecificAnswer.objects.create(
                    submission=submission,
                    video_file_url="placeholder_url",
                    video_description=domain_specific.get('description', ''),
                    question_id=f'{submission.domain}-marketing-1'
                )
        
        # Save behavior analysis - updated to match your structure
        behavior_data = exam_data.get('behaviorAnalysis', {})
        if behavior_data:
            metrics = behavior_data.get('metrics', {})
            keyboard_metrics = metrics.get('keyboardMetrics', {})
            
            BehaviorAnalysis.objects.create(
                submission=submission,
                is_likely_bot=behavior_data.get('isLikelyBot', False),
                confidence=behavior_data.get('confidence', 0.0),
                reasons=behavior_data.get('patterns', []),
                key_timing=[],  # We'll need to extract this from metrics if needed
                special_key_count=0,  # Extract from metrics if available
                typing_speed=[],  # Extract from metrics if available
                backspace_count=0,  # Extract from metrics if available
                total_key_presses=metrics.get('totalKeyPresses', 0)
            )

        # After creating the submission, evaluate it
        evaluator = ExamEvaluator(submission.id)
        evaluator.evaluate_submission()
        
        return Response({
            'status': 'success',
            'message': 'Exam submitted and evaluated successfully',
            'submissionId': submission.id
        }, status=status.HTTP_201_CREATED)
        
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {str(e)}")
        logger.error(f"Received examData: {request.data.get('examData')}")
        return Response({
            'status': 'error',
            'message': 'Invalid JSON data in examData field'
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        logger.error(f"Error in submit_exam: {str(e)}")
        logger.error(f"Request data: {request.data}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)