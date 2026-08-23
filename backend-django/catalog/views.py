from django.utils import timezone
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from accounts.permissions import IsOwnerOrAdmin
from catalog.models import Brand, Category, Good
from catalog.serializers import BrandSerializer, CategorySerializer, GoodSerializer


def _public_read_methods():
    return ('GET', 'HEAD', 'OPTIONS', None)


@extend_schema_view(
    list=extend_schema(tags=['Category'], summary='لیست دسته‌بندی‌ها'),
    retrieve=extend_schema(tags=['Category'], summary='جزئیات دسته‌بندی'),
    create=extend_schema(tags=['Category'], summary='ایجاد دسته‌بندی'),
    update=extend_schema(tags=['Category'], summary='ویرایش دسته‌بندی'),
    partial_update=extend_schema(tags=['Category'], summary='ویرایش جزئی دسته‌بندی'),
    destroy=extend_schema(tags=['Category'], summary='حذف دسته‌بندی'),
)
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(deleted_at__isnull=True)
    serializer_class = CategorySerializer
    lookup_field = 'id'

    def get_permissions(self):
        method = getattr(self.request, 'method', None)
        if method in _public_read_methods():
            return [AllowAny()]
        return [IsAuthenticated(), IsOwnerOrAdmin()]

    def get_authenticators(self):
        method = getattr(self.request, 'method', None)
        if method in _public_read_methods():
            return []
        return super().get_authenticators()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.deleted_at = timezone.now()
        instance.save(update_fields=['deleted_at'])
        return Response(status=status.HTTP_204_NO_CONTENT)


@extend_schema_view(
    list=extend_schema(tags=['Brand'], summary='لیست برندها'),
    retrieve=extend_schema(tags=['Brand'], summary='جزئیات برند'),
    create=extend_schema(tags=['Brand'], summary='ایجاد برند'),
    update=extend_schema(tags=['Brand'], summary='ویرایش برند'),
    partial_update=extend_schema(tags=['Brand'], summary='ویرایش جزئی برند'),
    destroy=extend_schema(tags=['Brand'], summary='حذف برند'),
)
class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.filter(deleted_at__isnull=True).select_related('category')
    serializer_class = BrandSerializer
    lookup_field = 'id'

    def get_permissions(self):
        method = getattr(self.request, 'method', None)
        if method in _public_read_methods():
            return [AllowAny()]
        return [IsAuthenticated(), IsOwnerOrAdmin()]

    def get_authenticators(self):
        method = getattr(self.request, 'method', None)
        if method in _public_read_methods():
            return []
        return super().get_authenticators()

    def get_queryset(self):
        qs = super().get_queryset()
        category_id = self.request.query_params.get('categoryId')
        if category_id:
            qs = qs.filter(category_id=category_id)
        return qs.order_by('name')

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.deleted_at = timezone.now()
        instance.save(update_fields=['deleted_at'])
        return Response(status=status.HTTP_204_NO_CONTENT)


@extend_schema_view(
    list=extend_schema(tags=['Good'], summary='لیست محصولات'),
    retrieve=extend_schema(tags=['Good'], summary='جزئیات محصول'),
    create=extend_schema(tags=['Good'], summary='ایجاد محصول'),
    update=extend_schema(tags=['Good'], summary='ویرایش محصول'),
    partial_update=extend_schema(tags=['Good'], summary='ویرایش جزئی محصول'),
    destroy=extend_schema(tags=['Good'], summary='حذف محصول'),
)
class GoodViewSet(viewsets.ModelViewSet):
    queryset = Good.objects.filter(deleted_at__isnull=True).select_related('brand', 'category')
    serializer_class = GoodSerializer
    lookup_field = 'id'
    http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']

    def get_permissions(self):
        method = getattr(self.request, 'method', None)
        if method in _public_read_methods():
            return [AllowAny()]
        if method == 'POST':
            return [IsAuthenticated(), IsOwnerOrAdmin()]
        return [IsAuthenticated()]

    def get_authenticators(self):
        method = getattr(self.request, 'method', None)
        if method in _public_read_methods():
            return []
        return super().get_authenticators()

    def get_queryset(self):
        qs = super().get_queryset()
        title = self.request.query_params.get('filter.title') or self.request.query_params.get('search')
        if title:
            clean = title.replace('$ilike:', '').strip()
            qs = qs.filter(title__icontains=clean)
        category_id = self.request.query_params.get('categoryId')
        if category_id:
            qs = qs.filter(category_id=category_id)
        brand_id = self.request.query_params.get('brandId')
        if brand_id:
            qs = qs.filter(brand_id=brand_id)
        is_available = self.request.query_params.get('isAvailable')
        if is_available is not None:
            qs = qs.filter(is_available=is_available.lower() == 'true')
        return qs.order_by('-created_at')

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.deleted_at = timezone.now()
        instance.save(update_fields=['deleted_at'])
        return Response(status=status.HTTP_204_NO_CONTENT)
