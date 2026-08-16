from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from accounts.models import User
from accounts.services import JWTService


class CookieJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get(settings.JWT_ACCESS_COOKIE)
        if not token:
            return None
        try:
            payload = JWTService.verify_access_token(token)
        except Exception as exc:
            raise AuthenticationFailed(str(exc)) from exc

        try:
            user = User.objects.get(id=payload['sub'], is_active=True)
        except User.DoesNotExist as exc:
            raise AuthenticationFailed('User not found') from exc

        request.jwt_payload = payload
        return (user, token)
