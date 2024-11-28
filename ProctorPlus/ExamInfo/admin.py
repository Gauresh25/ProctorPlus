from django.contrib import admin
from .models import Exam, MCQQuestion


class MCQQuestionInline(admin.TabularInline):
    """
    Inline for MCQQuestion in the Exam admin.
    """
    model = MCQQuestion
    extra = 1  # Number of extra empty forms to display


@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Exam model.
    """
    list_display = ('title', 'created_by', 'Type', 'created_at', 'updated_at')
    search_fields = ('title', 'created_by__username', 'Type')
    list_filter = ('created_at', 'updated_at')
    filter_horizontal = ('user',)  # For ManyToManyField
    inlines = [MCQQuestionInline]


@admin.register(MCQQuestion)
class MCQQuestionAdmin(admin.ModelAdmin):
    """
    Admin configuration for the MCQQuestion model.
    """
    list_display = ('title', 'exam', 'type', 'question_id', 'correct')
    search_fields = ('title', 'question_id', 'exam__title')
    list_filter = ('exam', 'type')
    ordering = ('exam', 'question_id')

    def exam_title(self, obj):
        return obj.exam.title
    exam_title.short_description = 'Exam Title'
