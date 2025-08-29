from django.contrib import admin

# Register your models here.

from .models import User,CleanupReport

class AdminUser(admin.ModelAdmin):
    list_display  = [f.name for f in User._meta.fields] #All the fields are seen in admin panel

class AdminReport(admin.ModelAdmin):
    list_display  = [f.name for f in CleanupReport._meta.fields]
    
    def has_add_permission(self, request): #should not be able to add
        return False 


admin.site.register(User,AdminUser)
admin.site.register(CleanupReport,AdminReport)