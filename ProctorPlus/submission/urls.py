from django.urls import path
from . import views

urlpatterns = [
    path('exam/submit/', views.submit_exam, name='submit_exam'),  # 
    #path('exam/<int:submission_id>/', views.get_submission_details, name='get_submission_details'),
]