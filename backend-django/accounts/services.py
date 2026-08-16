import random
from datetime import datetime, timedelta, timezone

import jwt
from django.conf import settings
from django.core.cache import cache


class JWTService:
    @staticmethod
    def generate_access_token(user_id: str, role: str) -> str:
        payload = {
            'sub': str(user_id),
            'role': role,
            'exp': datetime.now(timezone.utc) + settings.JWT_ACCESS_LIFETIME,
            'iat': datetime.now(timezone.utc),
        }
        return jwt.encode(payload, settings.JWT_ACCESS_SECRET, algorithm='HS256')

    @staticmethod
    def generate_refresh_token(user_id: str, role: str) -> str:
        payload = {
            'sub': str(user_id),
            'role': role,
            'exp': datetime.now(timezone.utc) + settings.JWT_REFRESH_LIFETIME,
            'iat': datetime.now(timezone.utc),
        }
        return jwt.encode(payload, settings.JWT_REFRESH_SECRET, algorithm='HS256')

    @staticmethod
    def generate_tokens(user_id: str, role: str) -> dict:
        return {
            'accessToken': JWTService.generate_access_token(user_id, role),
            'refreshToken': JWTService.generate_refresh_token(user_id, role),
        }

    @staticmethod
    def verify_access_token(token: str) -> dict:
        return jwt.decode(token, settings.JWT_ACCESS_SECRET, algorithms=['HS256'])

    @staticmethod
    def verify_refresh_token(token: str) -> dict:
        return jwt.decode(token, settings.JWT_REFRESH_SECRET, algorithms=['HS256'])


class OTPService:
    OTP_PREFIX = 'phone:'

    @classmethod
    def _key(cls, phone: str) -> str:
        return f'{cls.OTP_PREFIX}{phone}'

    @classmethod
    def generate_otp(cls) -> str:
        return ''.join(str(random.randint(0, 9)) for _ in range(5))

    @classmethod
    def has_otp(cls, phone: str) -> bool:
        return cache.get(cls._key(phone)) is not None

    @classmethod
    def is_otp_sent(cls, phone: str) -> bool:
        return cls.has_otp(phone)

    @classmethod
    def send_otp(cls, phone: str) -> dict:
        otp = cls.generate_otp()
        cache.set(cls._key(phone), otp, timeout=settings.OTP_TTL_SECONDS)
        response = {'message': 'otp sent to your phone'}
        if settings.DEBUG:
            response['otp'] = otp
        return response

    @classmethod
    def verify_otp(cls, phone: str, otp: str) -> bool:
        stored = cache.get(cls._key(phone))
        if not stored:
            return False
        if stored != otp:
            return False
        cache.delete(cls._key(phone))
        return True


def set_auth_cookies(response, access_token: str, refresh_token: str | None = None):
    secure = not settings.DEBUG
    response.set_cookie(
        settings.JWT_ACCESS_COOKIE,
        access_token,
        max_age=settings.JWT_ACCESS_COOKIE_MAX_AGE,
        httponly=True,
        secure=secure,
        samesite='Lax',
    )
    if refresh_token:
        response.set_cookie(
            settings.JWT_REFRESH_COOKIE,
            refresh_token,
            max_age=settings.JWT_REFRESH_COOKIE_MAX_AGE,
            httponly=True,
            secure=secure,
            samesite='Lax',
        )
    return response
