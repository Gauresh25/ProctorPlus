# submission/views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
from .models import ExamSubmission, MCQAnswer, DescriptiveAnswer, DomainSpecificAnswer, BehaviorAnalysis,PlagarismAnalysis
from .evaluator import ExamEvaluator
import logging
import json
from  django.conf import settings
from django.db.models import Avg, Count




logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_exam(request):
    try:
        # Get examData from form data and parse it as JSON
        
        exam_data = json.loads(request.data.get('examData', '{}'))        
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
       
        for desc in descriptive_answers:
            print(f"detecting {desc.get("answer")}")
            detection_results= settings.AI_DETECOR.detect(
                text=desc.get('answer'),
                )
            PlagarismAnalysis.objects.create(
            submission = submission,
            label = detection_results['label'],
            confidence= detection_results['confidence'],
            question_id = desc.get("questionId")
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
            # Debug log
            print(f"Processing domain specific answer: {domain_specific}")
            
            # Create domain-specific answer
            domain_answer = DomainSpecificAnswer.objects.create(
                submission=submission,
                question_id=domain_specific.get('questionId'),
                
                # Coding specific fields
                code=domain_specific.get('code'),
                language=domain_specific.get('language'),
                
                # Design specific fields
                design_description=domain_specific.get('design_description'),
                
                # Marketing specific fields
                video_description=domain_specific.get('video_description'),
            )
            '''
            # Handle file uploads if present
            if request.FILES:
                if 'designFile' in request.FILES and submission.domain == 'design':
                    # Handle design file upload and update URL
                    file = request.FILES['designFile']
                    # Add your file handling logic here
                    domain_answer.design_file_url = "url_to_file"  # Update with actual URL
                    
                elif 'videoFile' in request.FILES and submission.domain == 'marketing':
                    # Handle video file upload and update URL
                    file = request.FILES['videoFile']
                    # Add your file handling logic here
                    domain_answer.video_file_url = "url_to_file"  # Update with actual URL
                    
                domain_answer.save()
            '''
            
            print(f"Created domain specific answer: {domain_answer.id}")

        
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
    

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_submissions_analytics(request):
    # Get overall statistics
    total_submissions = ExamSubmission.objects.count()
    submissions_by_domain = ExamSubmission.objects.values('domain').annotate(
        count=Count('id'),
        avg_score=Avg('total_score')
    )
    
    # Get all submissions with related data
    submissions = ExamSubmission.objects.select_related(
        'user', 
        'behavior_analysis'
    ).prefetch_related(
        'mcq_answers',
        'descriptive_answers',
        'domain_specific_answer',
        'Plagarism_Analysis'
    ).order_by('-created_at')
    
    # Format submission data
    submissions_data = []
    for sub in submissions:
        submission_dict = {
            'id': sub.id,
            'user_email': sub.user.email,
            'domain': sub.domain,
            'total_score': sub.total_score,
            'created_at': sub.created_at,
            
            # MCQ answers
            'mcq_answers': [{
                'question_id': mcq.question_id,
                'answer': mcq.answer,
                'is_correct': mcq.is_correct
            } for mcq in sub.mcq_answers.all()],
            
            # Descriptive answers
            'descriptive_answers': [{
                'question_id': desc.question_id,
                'answer': desc.answer,
                'score': desc.score
            } for desc in sub.descriptive_answers.all()],
        }
        
        # Add behavior analysis if exists
        if hasattr(sub, 'behavior_analysis'):
            submission_dict['behavior_analysis'] = {
                'is_likely_bot': sub.behavior_analysis.is_likely_bot,
                'confidence': sub.behavior_analysis.confidence,
                'typing_speed': sub.behavior_analysis.typing_speed,
                'backspace_count': sub.behavior_analysis.backspace_count
            }
            
        # Add plagiarism data if exists
        submission_dict['plagiarism'] = [{
            'label': plag.label,
            'confidence': plag.confidence,
            'question_id': plag.question_id
        } for plag in sub.Plagarism_Analysis.all()]
        
        submissions_data.append(submission_dict)
    
    return Response({
        'status': 'success',
        'data': {
            'total_submissions': total_submissions,
            'domain_statistics': submissions_by_domain,
            'submissions': submissions_data
        }
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_submission_detail(request, submission_id):
    try:
        sub = ExamSubmission.objects.select_related(
            'user', 
            'behavior_analysis'
        ).prefetch_related(
            'mcq_answers',
            'descriptive_answers',
            'domain_specific_answer',
            'Plagarism_Analysis'
        ).get(id=submission_id)

        
        # Build detailed response
        response_data = {
            'id': sub.id,
            'user_email': sub.user.email,
            'domain': sub.domain,
            'total_score': sub.total_score,
            'created_at': sub.created_at,
            
            # MCQ answers
            'mcq_answers': [{
                'question_id': mcq.question_id,
                'answer': mcq.answer,
                'is_correct': mcq.is_correct
            } for mcq in sub.mcq_answers.all()],
            
            # Descriptive answers
            'descriptive_answers': [{
                'question_id': desc.question_id,
                'answer': desc.answer,
                'score': desc.score
            } for desc in sub.descriptive_answers.all()],
            
            # Domain specific answers
            'domain_specific': None,
            
            # Behavior analysis
            'behavior_analysis': None,
            
            # Plagiarism analysis
            'plagiarism': [{
                'label': plag.label,
                'confidence': plag.confidence,
                'question_id': plag.question_id
            } for plag in sub.Plagarism_Analysis.all()]
        }
        
        # Add domain specific data if exists
        domain_answer = sub.domain_specific_answer.first()
        if domain_answer:
            response_data['domain_specific'] = {
                'question_id': domain_answer.question_id,
                'score': domain_answer.score,
            }
            
            # Add domain-specific fields based on submission domain
            if sub.domain == 'coding':
                response_data['domain_specific'].update({
                    'code': domain_answer.code,
                    'language': domain_answer.language
                })
            elif sub.domain == 'design':
                response_data['domain_specific'].update({
                    'design_file_url': domain_answer.design_file_url,
                    'design_description': domain_answer.design_description
                })
            elif sub.domain == 'marketing':
                response_data['domain_specific'].update({
                    'video_file_url': domain_answer.video_file_url,
                    'video_description': domain_answer.video_description
                })
            
        # Add behavior analysis if exists
        if hasattr(sub, 'behavior_analysis'):
            response_data['behavior_analysis'] = {
                'is_likely_bot': sub.behavior_analysis.is_likely_bot,
                'confidence': sub.behavior_analysis.confidence,
                'reasons': sub.behavior_analysis.reasons,
                'typing_speed': sub.behavior_analysis.typing_speed,
                'backspace_count': sub.behavior_analysis.backspace_count,
                'total_key_presses': sub.behavior_analysis.total_key_presses
            }
        
        return Response({
            'status': 'success',
            'data': response_data
        })
        
    except ExamSubmission.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Submission not found'
        }, status=status.HTTP_404_NOT_FOUND)