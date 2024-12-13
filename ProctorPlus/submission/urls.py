from django.urls import path
from . import views

urlpatterns = [
    path('exam/submit/', views.submit_exam, name='submit_exam'),  # 
    path('submissions/analytics/', views.get_submissions_analytics, name='submissions-analytics'),
    path('submissions/<int:submission_id>/', views.get_submission_detail, name='submission-detail'),
    # path('exam/<int:submission_id>/', views.get_submission_details, name='get_submission_details'),
]