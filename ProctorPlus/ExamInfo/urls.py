from django.urls import path
from . import views

urlpatterns = [
    path('examData/', views.hello_world),
    path('examData/getData', views.add_exam_info),
    path('examData/getUserExams', views.get_user_exam),
]