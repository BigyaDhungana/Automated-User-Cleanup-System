from django.contrib import admin

# Register your models here.

from .models import User,CleanupReport

class AdminUser(admin.ModelAdmin):
    list_display  = [f.name for f in User._meta.fields]

class AdminReport(admin.ModelAdmin):
    list_display  = [f.name for f in CleanupReport._meta.fields]
    
    def has_add_permission(self, request):
        return False


admin.site.register(User,AdminUser)
admin.site.register(CleanupReport,AdminReport)