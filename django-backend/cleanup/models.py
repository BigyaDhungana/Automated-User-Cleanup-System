from django.db import models
from django.core.validators import validate_email

class User(models.Model):
    email=models.CharField(max_length=255,unique=True,validators=[validate_email])
    last_login=models.DateTimeField(null=True)
    is_active=models.BooleanField(default=True)

    def __str__(self):
        return self.email

class CleanupReport(models.Model):
    timestamp=models.DateTimeField(auto_now_add=True)
    users_deleted=models.IntegerField(default=0)
    active_users_remaining=models.IntegerField()
    was_manual=models.BooleanField()

    def __str__(self):
        return f'{self.timestamp} deleted {self.users_deleted}'