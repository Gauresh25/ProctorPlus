from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import ArrayField

class ExamSubmission(models.Model):
    DOMAIN_CHOICES = [
        ('design', 'Design'),
        ('coding', 'Coding'),
        ('marketing', 'Marketing'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    domain = models.CharField(max_length=20, choices=DOMAIN_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    total_score = models.IntegerField(default=0, blank=True) #score

    def __str__(self):
        return f"{self.user.email}'s {self.domain} exam submission"

class MCQAnswer(models.Model):
    submission = models.ForeignKey(ExamSubmission, related_name='mcq_answers', on_delete=models.CASCADE)
    question_id = models.CharField(max_length=50)
    answer = models.CharField(max_length=255)

    is_correct = models.BooleanField(default=False, blank=True) 

    def __str__(self):
        return f"MCQ Answer for {self.question_id}"

class DescriptiveAnswer(models.Model):
    submission = models.ForeignKey(ExamSubmission, related_name='descriptive_answers', on_delete=models.CASCADE)
    question_id = models.CharField(max_length=50)
    answer = models.TextField()

    score = models.IntegerField(default=0, blank=True)  # New field - out of 10


    def __str__(self):
        return f"Descriptive Answer for {self.question_id}"

class DomainSpecificAnswer(models.Model):
    submission = models.ForeignKey(ExamSubmission, related_name='domain_specific_answer', on_delete=models.CASCADE)
    
    # Coding Domain
    code = models.TextField(null=True, blank=True)
    language = models.CharField(max_length=20, null=True, blank=True)
    
    # Design Domain
    design_file_url = models.URLField(null=True, blank=True)
    design_description = models.TextField(null=True, blank=True)
    
    # Marketing Domain
    video_file_url = models.URLField(null=True, blank=True)
    video_description = models.TextField(null=True, blank=True)
    
    question_id = models.CharField(max_length=50)
    score = models.IntegerField(null=True, blank=True)  # Made nullable

    def __str__(self):
        return f"Domain Specific Answer for {self.submission.domain}"

class BehaviorAnalysis(models.Model):
    submission = models.OneToOneField(ExamSubmission, related_name='behavior_analysis', on_delete=models.CASCADE)
    is_likely_bot = models.BooleanField(default=False)
    confidence = models.FloatField()
    reasons = ArrayField(models.CharField(max_length=255), default=list)
    key_timing = ArrayField(models.IntegerField(), default=list)
    special_key_count = models.IntegerField()
    typing_speed = ArrayField(models.FloatField(), default=list)
    backspace_count = models.IntegerField()
    total_key_presses = models.IntegerField()

    def __str__(self):
        return f"Behavior Analysis for {self.submission}"
    
class PlagarismAnalysis(models.Model):
    submission= models.ForeignKey(
        ExamSubmission,
        related_name="Plagarism_Analysis",
        on_delete=models.CASCADE
        )
    label = models.CharField(max_length=100)
    confidence = models.FloatField()
    question_id = models.CharField(max_length=100,default="")
    