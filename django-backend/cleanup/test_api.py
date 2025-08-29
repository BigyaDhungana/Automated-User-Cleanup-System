from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import User, CleanupReport
from datetime import timedelta
from django.utils import timezone
from .tasks import cleanup_inactive_users
from unittest.mock import patch

class CleanupAPITest(APITestCase):
    def setUp(self):
        # Create active and inactive users
        self.active_user = User.objects.create(email="active@test.com", last_login=timezone.now())
        self.inactive_user = User.objects.create(
            email="inactive@test.com",
            last_login=timezone.now() - timedelta(minutes=20)
        )

    def test_get_latest_report_endpoint(self):
        """
        Test GET /api/reports/latest/ endpoint
        """
        # Run the cleanup to have a report
        cleanup_inactive_users(manual=True)

        url = reverse('latest_report') 
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        #check the correctness
        data = response.json()
        self.assertIn('users_deleted', data)
        self.assertIn('active_users_remaining', data)
        self.assertEqual(data['users_deleted'], 1)
        self.assertEqual(data['active_users_remaining'], 1)


    def test_get_all_reports_endpoint(self):
        """
        Test GET /api/reports/all/ endpoint
        """
        # Run the cleanup to have a report
        cleanup_inactive_users(manual=True)

        url = reverse('all_reports')  # Make sure your urls.py has this name
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIsInstance(data['data'], list)
        self.assertGreaterEqual(len(data['data']), 1)
