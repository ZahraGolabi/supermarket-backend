from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import User, UserRole
from accounts.serializers import (
    OtpResponseSerializer,
    RegisterByPhoneSerializer,
    SuccessResponseSerializer,
    VerifyByPhoneSerializer,
)
from accounts.services import JWTService, OTPService, set_auth_cookies


class RegisterByPhoneView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    @extend_schema(
        request=RegisterByPhoneSerializer,
        responses={200: OtpResponseSerializer, 429: dict},
        tags=['Auth'],
        summary='ثبت‌نام / ارسال OTP',
    )
    def post(self, request):
        serializer = RegisterByPhoneSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone']

        if OTPService.is_otp_sent(phone):
            return Response(
                {'message': 'Too many request', 'statusCode': 429},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        user, _ = User.objects.get_or_create(
            phone=phone,
            defaults={'role': UserRole.USER},
        )

        result = OTPService.send_otp(phone)
        return Response(result)


class VerifyByPhoneView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    @extend_schema(
        request=VerifyByPhoneSerializer,
        responses={200: SuccessResponseSerializer},
        tags=['Auth'],
        summary='تأیید OTP و ورود',
    )
    def post(self, request):
        serializer = VerifyByPhoneSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone']
        otp = serializer.validated_data['otp']

        try:
            user = User.objects.get(phone=phone)
        except User.DoesNotExist:
            return Response(
                {'message': 'invalid phone-number', 'statusCode': 404},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not OTPService.has_otp(phone):
            return Response(
                {'message': 'Otp not found', 'statusCode': 404},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not OTPService.verify_otp(phone, otp):
            return Response(
                {'message': 'wrong-otp', 'statusCode': 400},
                status=status.HTTP_400_BAD_REQUEST,
            )

        tokens = JWTService.generate_tokens(str(user.id), user.role)
        user.refresh_token = tokens['refreshToken']
        user.save(update_fields=['refresh_token', 'updated_at'])

        response = Response({'success': True})
        return set_auth_cookies(response, tokens['accessToken'], tokens['refreshToken'])


class RefreshTokenView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    @extend_schema(
        request=None,
        responses={200: SuccessResponseSerializer},
        tags=['Auth'],
        summary='تمدید access token',
    )
    def post(self, request):
        from django.conf import settings

        refresh_token = request.COOKIES.get(settings.JWT_REFRESH_COOKIE)
        if not refresh_token:
            return Response(
                {'message': 'refresh-token not found', 'statusCode': 401},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            payload = JWTService.verify_refresh_token(refresh_token)
            user = User.objects.get(id=payload['sub'], refresh_token=refresh_token)
        except Exception as exc:
            return Response(
                {'message': str(exc), 'statusCode': 401},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        access_token = JWTService.generate_access_token(str(user.id), user.role)
        response = Response({'success': True})
        return set_auth_cookies(response, access_token)
