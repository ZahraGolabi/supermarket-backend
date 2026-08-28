from rest_framework import serializers

from catalog.models import Brand, Category, Good


def build_media_url(request, file_field):
    if file_field and hasattr(file_field, 'url'):
        if request:
            return request.build_absolute_uri(file_field.url)
        return file_field.url
    return None


class OptionalImageMixin:
    """Optional image: null in response when empty; writable via multipart on create/update."""

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if 'image' in self.fields:
            data['image'] = build_media_url(self.context.get('request'), instance.image)
        return data


class CategorySerializer(OptionalImageMixin, serializers.ModelSerializer):
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'title', 'description', 'image', 'createdAt', 'updatedAt']
        read_only_fields = ['id', 'createdAt', 'updatedAt']
        extra_kwargs = {
            'image': {'required': False, 'allow_null': True},
        }


class BrandSerializer(OptionalImageMixin, serializers.ModelSerializer):
    categoryId = serializers.PrimaryKeyRelatedField(
        source='category', queryset=Category.objects.all()
    )
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)

    class Meta:
        model = Brand
        fields = ['id', 'name', 'description', 'image', 'categoryId', 'createdAt', 'updatedAt']
        read_only_fields = ['id', 'createdAt', 'updatedAt']
        extra_kwargs = {
            'image': {'required': False, 'allow_null': True},
        }


class GoodSerializer(OptionalImageMixin, serializers.ModelSerializer):
    brandId = serializers.PrimaryKeyRelatedField(
        source='brand', queryset=Brand.objects.all(), required=False, allow_null=True
    )
    categoryId = serializers.PrimaryKeyRelatedField(
        source='category', queryset=Category.objects.all(), required=False, allow_null=True
    )
    weightVolume = serializers.CharField(source='weight_volume', required=False, allow_null=True)
    discountPercent = serializers.IntegerField(source='discount_percent', required=False, default=0)
    stockQuantity = serializers.IntegerField(source='stock_quantity', required=False, default=0)
    isAvailable = serializers.BooleanField(source='is_available', required=False, default=True)
    isFeatured = serializers.BooleanField(source='is_featured', required=False, default=False)
    isHealthy = serializers.BooleanField(source='is_healthy', required=False, default=False)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)

    class Meta:
        model = Good
        fields = [
            'id', 'title', 'slug', 'description', 'weightVolume', 'ingredients',
            'barcode', 'price', 'discountPercent', 'stockQuantity', 'isAvailable',
            'isFeatured', 'isHealthy', 'unit', 'brandId', 'categoryId', 'image',
            'createdAt', 'updatedAt',
        ]
        read_only_fields = ['id', 'createdAt', 'updatedAt']
        extra_kwargs = {
            'image': {'required': False, 'allow_null': True},
        }

    def validate_discountPercent(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError('Discount must be between 0 and 100')
        return value

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError('Price cannot be negative')
        return value
