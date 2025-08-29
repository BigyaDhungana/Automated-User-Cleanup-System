from django.test import TestCase
from .tasks import cleanup_inactive_users
from .models import CleanupReport, User
from datetime import timedelta
from django.utils import timezone

class CleanupTaskTest(TestCase):
    def setUp(self):
        # Create a active and a inacitve account
        self.active_user = User.objects.create(email="active@test.com", last_login=timezone.now())
        self.inactive_user = User.objects.create(
            email="inactive@test.com",
            last_login=timezone.now() - timedelta(minutes=20)
        )

    def test_cleanup_inactive_users(self):
        cleanup_inactive_users(True)

        # Inactive user should be deactivated
        self.assertFalse(User.objects.filter(id=self.inactive_user.id).exists())

        # Active user should remain active
        self.active_user.refresh_from_db()
        self.assertTrue(User.objects.filter(id=self.active_user.id).exists())

        # Check if a CleanupReport was created
        report = CleanupReport.objects.last()
        self.assertIsNotNone(report)
        self.assertEqual(report.active_users_remaining, 1)
        self.assertEqual(report.users_deleted,1)
