from .celery import app as celery_app
# Makes sure that app is always imported when Django starts
__all__ = ('celery_app',)