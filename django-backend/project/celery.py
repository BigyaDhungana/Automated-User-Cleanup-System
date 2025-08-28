import os
import environ
from celery import Celery

env=environ.Env()
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))


# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')

app = Celery('project')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()


# periodic task
app.conf.beat_schedule = {
    'cleanup-inactive-users': {
        'task': 'cleanup.tasks.cleanup_inactive_users',
        'schedule': float(env('CLEAN_UP_INTERVAL_SECONDS',default=300)),#default time is 5 mins
        'args': (False,), #Only manual trigger is true
    },
}

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')