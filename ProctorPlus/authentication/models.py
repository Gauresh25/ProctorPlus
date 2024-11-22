from django.contrib.auth.models import AbstractUser
from django.db import models

class ClerkUser(AbstractUser):
    clerk_user_id = models.CharField(max_length=255, unique=True)
    email_verified = models.BooleanField(default=False)
    profile_image_url = models.URLField(max_length=500, blank=True, null=True)
    last_sign_in = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.username} ({self.clerk_user_id})"
