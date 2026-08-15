from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.serializers import UpdateProfileSerializer, UserSerializer


class MeView(APIView):
    @extend_schema(responses={200: UserSerializer}, tags=['Users'], summary='اطلاعات کاربر جاری')
    def get(self, request):
        return Response(UserSerializer(request.user).data)


class UpdateProfileView(APIView):
    @extend_schema(
        request=UpdateProfileSerializer,
        responses={200: UserSerializer},
        tags=['Users'],
        summary='به‌روزرسانی پروفایل',
    )
    def put(self, request):
        serializer = UpdateProfileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user = request.user
        if 'firstName' in data:
            user.first_name = data['firstName']
        if 'lastName' in data:
            user.last_name = data['lastName']
        if 'birthDate' in data:
            user.birth_date = data['birthDate']
        if 'gender' in data:
            user.gender = data['gender']
        user.save()

        return Response(UserSerializer(user).data)
