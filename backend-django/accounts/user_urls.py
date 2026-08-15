from django.urls import path

from accounts.user_views import MeView, UpdateProfileView

urlpatterns = [
    path('me', MeView.as_view(), name='users-me'),
    path('update-profile', UpdateProfileView.as_view(), name='users-update-profile'),
]
