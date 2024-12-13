from django.db import models
from django.contrib.postgres.fields import ArrayField  # For storing options as a list
from django.conf import settings  # For custom user model
from django.contrib.auth.models import User

class Exam(models.Model):
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="created_exams")
    title = models.CharField(max_length=255)
    user = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="user_exams")
    Type=models.CharField(max_length=100,default="coding")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"Exam: {self.title} by {self.created_by.username}"

class MCQQuestion(models.Model):
    TYPE_CHOICES = [
        ('mcq', 'Multiple Choice Question'),
    ]

    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name="mcq_questions")
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='mcq')
    question_id = models.CharField(max_length=100, unique=True)  # To ensure each question has a unique identifier
    title = models.TextField()  # Question text/title
    options = ArrayField(
        models.CharField(max_length=255),
        size=10,  # Maximum number of options
        blank=False
    )  # Store options as a list
    correct = models.PositiveIntegerField()  # Store the index of the correct option (0-based)

    def __str__(self):
        return f"Question: {self.title[:50]} (ID: {self.question_id}, Exam: {self.exam.title})"
