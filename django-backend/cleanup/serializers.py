from rest_framework import serializers
from .models import CleanupReport

class CleanupReportSerializer(serializers.ModelSerializer):
    class Meta:
        model=CleanupReport
        fields="__all__"