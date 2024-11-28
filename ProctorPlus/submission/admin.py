from django.contrib import admin
from .models import ExamSubmission, MCQAnswer, DescriptiveAnswer, DomainSpecificAnswer, BehaviorAnalysis,PlagarismAnalysis

class MCQAnswerInline(admin.TabularInline):
    model = MCQAnswer
    extra = 0
    readonly_fields = ('question_id', 'answer')

class DescriptiveAnswerInline(admin.TabularInline):
    model = DescriptiveAnswer
    extra = 0
    readonly_fields = ('question_id', 'answer')

class DomainSpecificAnswerInline(admin.TabularInline):
    model = DomainSpecificAnswer
    extra = 0
    readonly_fields = ('code', 'language', 'design_file_url', 'video_file_url', 'question_id')

class BehaviorAnalysisInline(admin.StackedInline):
    model = BehaviorAnalysis
    extra = 0
    readonly_fields = ('is_likely_bot', 'confidence', 'reasons', 'key_timing', 
                      'special_key_count', 'typing_speed', 'backspace_count', 
                      'total_key_presses')

class PlagiarismAnalysisInline(admin.StackedInline):
    model = PlagarismAnalysis
    extra = 0
    readonly_fields = ('label', 'confidence', 'submission')
    
@admin.register(ExamSubmission)
class ExamSubmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_email', 'domain', 'created_at', 'is_suspicious')
    list_filter = ('domain', 'created_at', 'user')
    search_fields = ('user__email', 'domain')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [MCQAnswerInline, DescriptiveAnswerInline, DomainSpecificAnswerInline, BehaviorAnalysisInline]
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User Email'
    
    def is_suspicious(self, obj):
        if hasattr(obj, 'behavior_analysis'):
            return obj.behavior_analysis.is_likely_bot
        return False
    is_suspicious.boolean = True
    is_suspicious.short_description = 'Suspicious?'

@admin.register(MCQAnswer)
class MCQAnswerAdmin(admin.ModelAdmin):
    list_display = ('submission', 'question_id', 'answer')
    list_filter = ('submission__domain',)
    search_fields = ('question_id', 'answer', 'submission__user__email')

@admin.register(DescriptiveAnswer)
class DescriptiveAnswerAdmin(admin.ModelAdmin):
    list_display = ('submission', 'question_id')
    list_filter = ('submission__domain',)
    search_fields = ('question_id', 'answer', 'submission__user__email')

@admin.register(DomainSpecificAnswer)
class DomainSpecificAnswerAdmin(admin.ModelAdmin):
    list_display = ('submission', 'question_id', 'get_answer_type')
    list_filter = ('submission__domain',)
    search_fields = ('question_id', 'submission__user__email')
    
    def get_answer_type(self, obj):
        if obj.code:
            return 'Code'
        elif obj.design_file_url:
            return 'Design'
        elif obj.video_file_url:
            return 'Marketing'
        return 'Unknown'
    get_answer_type.short_description = 'Answer Type'

@admin.register(BehaviorAnalysis)
class BehaviorAnalysisAdmin(admin.ModelAdmin):
    list_display = ('submission', 'is_likely_bot', 'confidence', 'special_key_count', 'total_key_presses')
    list_filter = ('is_likely_bot', 'submission__domain')
    search_fields = ('submission__user__email',)
    
    def has_add_permission(self, request):
        return False  # Prevent manual creation
    
@admin.register(PlagarismAnalysis)
class PlagarismAnalysisAdmin(admin.ModelAdmin):
    list_display = ('label', 'confidence', 'submission')
    
    