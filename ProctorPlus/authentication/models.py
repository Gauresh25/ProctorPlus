from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    Custom user model that extends Django's AbstractUser
    """
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        db_table = 'authentication_user'  # Changed from auth_user
        verbose_name = 'user'
        verbose_name_plural = 'users'
        
    def __str__(self):
        return self.email