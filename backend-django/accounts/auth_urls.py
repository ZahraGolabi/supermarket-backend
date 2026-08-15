from django.urls import path

from accounts.auth_views import RefreshTokenView, RegisterByPhoneView, VerifyByPhoneView

urlpatterns = [
    path('register-by-phone', RegisterByPhoneView.as_view(), name='register-by-phone'),
    path('verify-by-phone', VerifyByPhoneView.as_view(), name='verify-by-phone'),
    path('refresh-token', RefreshTokenView.as_view(), name='refresh-token'),
]
