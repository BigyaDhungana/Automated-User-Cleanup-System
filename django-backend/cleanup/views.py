from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import CleanupReport
from .serializers import CleanupReportSerializer
from .tasks import cleanup_inactive_users
# Create your views here.


@api_view(['GET'])
def get_recent_cleanup_report(request):
    try:
        latest_report=CleanupReport.objects.latest('timestamp')            
        report_serializer=CleanupReportSerializer(latest_report)
        return Response({'status':'success',**report_serializer.data},status=status.HTTP_200_OK)

    except CleanupReport.DoesNotExist:
        return Response({'status':'error','message':'No report found'},status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        print(e)
        return Response({'status':'error','message':'Something went wrong'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def manual_clean_up(request):
    try:
        result=cleanup_inactive_users.delay(True) #takes one argument
        
        return Response({**result.get()})
    except Exception as e:
        print(e)
        return Response({"status":"error","message":"Failed to clean up task"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)