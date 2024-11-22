from django.urls import path
from . import views

urlpatterns = [
    path('webhook/', views.clerk_webhook, name='clerk-webhook'),
    path('user/me/', views.get_user_profile, name='user-profile'),
]