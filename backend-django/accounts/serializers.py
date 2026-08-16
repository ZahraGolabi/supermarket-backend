import re

from rest_framework import serializers

from accounts.models import Gender, User


class SuccessResponseSerializer(serializers.Serializer):
    success = serializers.BooleanField()


class OtpResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
    otp = serializers.CharField(required=False)


class RegisterByPhoneSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=11)

    def validate_phone(self, value):
        if not re.match(r'^09\d{9}$', value):
            raise serializers.ValidationError('Invalid Iranian phone number')
        return value


class VerifyByPhoneSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=11)
    otp = serializers.CharField(min_length=5, max_length=5)

    def validate_phone(self, value):
        if not re.match(r'^09\d{9}$', value):
            raise serializers.ValidationError('Invalid Iranian phone number')
        return value


class UpdateProfileSerializer(serializers.Serializer):
    firstName = serializers.CharField(min_length=3, max_length=100, required=False)
    lastName = serializers.CharField(min_length=3, max_length=100, required=False)
    birthDate = serializers.DateField(required=False)
    gender = serializers.ChoiceField(choices=Gender.choices, required=False)


class UserSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source='first_name', required=False, allow_null=True)
    lastName = serializers.CharField(source='last_name', required=False, allow_null=True)
    birthDate = serializers.DateField(source='birth_date', required=False, allow_null=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'firstName',
            'lastName',
            'phone',
            'role',
            'email',
            'gender',
            'birthDate',
            'createdAt',
            'updatedAt',
        ]
        read_only_fields = fields
