import logging
from .models import ExamSubmission, MCQAnswer, DescriptiveAnswer, DomainSpecificAnswer
from .exam_data import EXAM_DATA, MCQ_POINTS
import subprocess
import tempfile
import os
import json
import logging
from contextlib import contextmanager
import signal
import ast
import sys

logger = logging.getLogger(__name__)

class CodeExecutor:
    MEMORY_LIMIT = 128 * 1024 * 1024  # 128 MB

    def __init__(self):
        # Get the Python executable path
        self.python_executable = sys.executable
        self.TIMEOUT = 2

    def run_test_case(self, code: str, input_str: str) -> tuple:
        """Execute a single test case in a controlled environment"""
        try:
            # Create a temporary file with the code
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False, encoding='utf-8') as f:
                # Add the solution function and test case
                f.write(code)
                temp_path = f.name

            # Run the code using the current Python interpreter
            process = subprocess.Popen(
                [self.python_executable, temp_path],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )

            try:
                stdout, stderr = process.communicate(timeout=self.TIMEOUT)
                if process.returncode != 0:
                    return False, f"Runtime Error: {stderr}"
                return True, stdout.strip()
            except subprocess.TimeoutExpired:
                process.kill()
                return False, "Time Limit Exceeded"

        except Exception as e:
            return False, str(e)
        finally:
            # Clean up the temporary file
            try:
                os.unlink(temp_path)
            except:
                pass

class ExamEvaluator:
    def __init__(self, submission_id):
        self.submission = ExamSubmission.objects.get(id=submission_id)
        
    def evaluate_mcqs(self):
        """
        Evaluates MCQ answers based on predefined correct answers.
        Returns total MCQ score.
        """
        try:
            domain = self.submission.domain
            domain_mcqs = EXAM_DATA[domain]['mcqs']
            correct_answers = {mcq['id']: mcq['correctAnswer'] for mcq in domain_mcqs}
            
            total_mcq_score = 0
            
            for mcq_answer in self.submission.mcq_answers.all():
                is_correct = mcq_answer.answer == correct_answers.get(mcq_answer.question_id)
                mcq_answer.is_correct = is_correct
                if is_correct:
                    total_mcq_score += MCQ_POINTS
                mcq_answer.save()
            
            return total_mcq_score
        
        except Exception as e:
            logger.error(f"Error evaluating MCQs: {str(e)}")
            return 0

    def evaluate_descriptive(self):
        """
        Placeholder for descriptive answer evaluation.
        In production, implement proper evaluation logic or manual review system.
        """
        logger.info("Descriptive evaluation not implemented")
        return 0

    def evaluate_domain_specific(self):
        try:
            if self.submission.domain != 'coding':
                return 0

            domain_answer = self.submission.domain_specific_answer.first()
            if not domain_answer or not domain_answer.code:
                return 0

            submitted_code = domain_answer.code.strip()  # Remove any extra whitespace

            test_cases = [
                ("1", "A"),
                ("2", "AA"),  # Empty input, expects output "a"
            ]

            executor = CodeExecutor()
            passed_cases = 0

            for input_str, expected_output in test_cases:
                # Don't add any extra indentation or newlines
                test_code = submitted_code
                success, result = executor.run_test_case(test_code, input_str)
                
                if success:
                    result = result.strip().strip("'\"")
                    if result == expected_output:
                        passed_cases += 1
                        logger.info(f"Test case passed: Expected '{expected_output}', Got '{result}'")
                    else:
                        logger.error(f"Test case failed: Expected '{expected_output}', Got '{result}'")
                else:
                    logger.error(f"Test case error: {input_str}, Error: {result}")

            score = int((passed_cases / len(test_cases)) * 20)
            domain_answer.score = score
            domain_answer.save()

            return score

        except Exception as e:
            logger.error(f"Error in evaluate_domain_specific: {str(e)}")
            return 0

    def evaluate_submission(self):
        """
        Evaluates entire submission and updates total score.
        """
        try:
            mcq_score = self.evaluate_mcqs()
            desc_score = self.evaluate_descriptive()
            domain_score = self.evaluate_domain_specific()
            
            total_score = mcq_score + desc_score + domain_score
            
            self.submission.total_score = total_score
            self.submission.save()
            
            logger.info(f"Submission {self.submission.id} evaluated. Total score: {total_score}")
            return total_score
            
        except Exception as e:
            logger.error(f"Error evaluating submission: {str(e)}")
            return None