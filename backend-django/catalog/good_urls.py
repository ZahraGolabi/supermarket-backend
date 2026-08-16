from django.urls import include, path
from rest_framework.routers import DefaultRouter

from catalog.views import GoodViewSet

router = DefaultRouter()
router.register('', GoodViewSet, basename='good')

urlpatterns = [
    path('', include(router.urls)),
]
