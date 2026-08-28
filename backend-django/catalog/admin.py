from django.contrib import admin
from django.utils.html import format_html

from catalog.models import Brand, Category, Good


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'image_preview', 'created_at')
    search_fields = ('title',)
    readonly_fields = ('id', 'created_at', 'updated_at', 'deleted_at', 'image_preview')
    fields = ('title', 'description', 'image', 'image_preview', 'id', 'created_at', 'updated_at', 'deleted_at')

    @admin.display(description='پیش‌نمایش')
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height:80px;border-radius:8px;" />', obj.image.url)
        return '—'


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'image_preview', 'created_at')
    list_filter = ('category',)
    search_fields = ('name',)
    readonly_fields = ('id', 'created_at', 'updated_at', 'deleted_at', 'image_preview')
    fields = (
        'name', 'description', 'image', 'image_preview',
        'category', 'id', 'created_at', 'updated_at', 'deleted_at',
    )

    @admin.display(description='پیش‌نمایش')
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height:80px;border-radius:8px;" />', obj.image.url)
        return '—'


@admin.register(Good)
class GoodAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'discount_percent', 'stock_quantity', 'is_available', 'category', 'brand', 'image_preview')
    list_filter = ('is_available', 'is_featured', 'category', 'brand')
    search_fields = ('title', 'barcode', 'slug')
    readonly_fields = ('id', 'created_at', 'updated_at', 'deleted_at', 'image_preview')
    list_editable = ('price', 'discount_percent', 'stock_quantity', 'is_available')
    fields = (
        'title', 'slug', 'description', 'image', 'image_preview',
        'price', 'discount_percent', 'stock_quantity', 'is_available',
        'weight_volume', 'unit', 'ingredients', 'barcode',
        'is_featured', 'is_healthy', 'category', 'brand',
        'id', 'created_at', 'updated_at', 'deleted_at',
    )

    @admin.display(description='پیش‌نمایش')
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height:80px;border-radius:8px;" />', obj.image.url)
        return '—'
