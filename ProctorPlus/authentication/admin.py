from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.utils.html import format_html
from .models import User

class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('email', 'username', 'phone', 'profile_image')

class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = User
        fields = ('email', 'username', 'phone', 'profile_image')

class CustomUserAdmin(UserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    
    # Add profile_image to list display with preview
    list_display = ('email', 'username', 'phone', 'is_staff', 'is_active', 'profile_image_preview')
    list_filter = ('is_staff', 'is_active')
    
    # Add thumbnail preview method
    def profile_image_preview(self, obj):
        if obj.profile_image:
            return format_html('<img src="{}" width="50" height="50" style="border-radius: 50%;" />', obj.profile_image.url)
        return "No Image"
    profile_image_preview.short_description = 'Profile Image'
    
    # Modify fieldsets to include profile_image
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('username', 'phone', 'profile_image')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser',
                                  'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    # Include profile_image in add fieldsets
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'phone', 'profile_image', 'password1', 'password2'),
        }),
    )
    
    search_fields = ('email', 'username', 'phone')
    ordering = ('email',)

    # Add profile_image to readonly fields if you want to prevent editing
    # readonly_fields = ('profile_image_preview',)

admin.site.register(User, CustomUserAdmin)