from django.urls import path
from . import views

urlpatterns=[
    path('reports/latest/',views.get_recent_cleanup_report,name="latest_report"),
    path('cleanup/trigger/',views.manual_clean_up,name="manual_cleanup")
]