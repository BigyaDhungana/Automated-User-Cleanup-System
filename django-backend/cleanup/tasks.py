from celery import shared_task
import os
import environ
from datetime import timedelta
from django.utils import timezone
from .models import User, CleanupReport
from django.db import transaction



env=environ.Env()
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

@shared_task(bind=True)
def cleanup_inactive_users(self,manual:bool):
    """Delete inactive users and create a CleanupReport; can be triggered manually or periodically."""
    max_retries=2
    try:
        inactivity_threshold_minutes=env.float('INACTIVITY_THRESHOLD_MINUTES',default=30*24*60) #default is 30 days
        cutoff_date=timezone.now()-timedelta(minutes=inactivity_threshold_minutes)

        with transaction.atomic():
            inactive_users=User.objects.filter(last_login__lt=cutoff_date,is_active=True)
      

            no_of_user_to_delete=inactive_users.count()

            if no_of_user_to_delete>0:
                inactive_users.delete()
                print(f'Deleted {no_of_user_to_delete} users')
            
            no_of_active_users=User.objects.filter(is_active=True).count()

            report=CleanupReport.objects.create(users_deleted=no_of_user_to_delete,active_users_remaining=no_of_active_users,was_manual=manual)
         
        return {
            'status':'success',
            'report_id':report.id,
            'users_deleted':no_of_user_to_delete,
            'users_remaining':no_of_active_users,
        }

    except Exception as e:
        if self.request.retries >= max_retries:
            print("Max retries reached")
            return{
                'status':'failure'
            }
        print(f'An error occured {e}')
        print('retrying')
        raise self.retry(exc=e,countdown=5,max_retries=max_retries)
    
  

        