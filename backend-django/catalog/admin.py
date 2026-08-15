from django.contrib import admin

from catalog.models import Brand, Category, Good


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at')
    search_fields = ('title',)
    readonly_fields = ('id', 'created_at', 'updated_at', 'deleted_at')


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'created_at')
    list_filter = ('category',)
    search_fields = ('name',)
    readonly_fields = ('id', 'created_at', 'updated_at', 'deleted_at')


@admin.register(Good)
class GoodAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'stock_quantity', 'is_available', 'category', 'brand')
    list_filter = ('is_available', 'is_featured', 'category', 'brand')
    search_fields = ('title', 'barcode', 'slug')
    readonly_fields = ('id', 'created_at', 'updated_at', 'deleted_at')
    list_editable = ('price', 'stock_quantity', 'is_available')
