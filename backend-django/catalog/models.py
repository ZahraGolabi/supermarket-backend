import uuid

from django.db import models


class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        abstract = True


class Category(BaseModel):
    title = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'categories'
        verbose_name = 'دسته‌بندی'
        verbose_name_plural = 'دسته‌بندی‌ها'

    def __str__(self):
        return self.title


class Brand(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.RESTRICT,
        related_name='brands',
        db_column='categoryId',
    )

    class Meta:
        db_table = 'brands'
        verbose_name = 'برند'
        verbose_name_plural = 'برندها'
        constraints = [
            models.UniqueConstraint(fields=['name', 'category'], name='unique_brand_category'),
        ]

    def __str__(self):
        return self.name


class Good(BaseModel):
    title = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    weight_volume = models.CharField(max_length=50, blank=True, null=True)
    ingredients = models.TextField(blank=True, null=True)
    barcode = models.CharField(max_length=100, blank=True, null=True)
    price = models.PositiveBigIntegerField(default=0)
    discount_percent = models.PositiveSmallIntegerField(default=0)
    stock_quantity = models.PositiveIntegerField(default=0)
    is_available = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_healthy = models.BooleanField(default=False)
    unit = models.CharField(max_length=50, blank=True, null=True)
    brand = models.ForeignKey(
        Brand,
        on_delete=models.RESTRICT,
        related_name='goods',
        blank=True,
        null=True,
        db_column='brandId',
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.RESTRICT,
        related_name='goods',
        blank=True,
        null=True,
        db_column='categoryId',
    )

    class Meta:
        db_table = 'goods'
        verbose_name = 'محصول'
        verbose_name_plural = 'محصولات'
        indexes = [
            models.Index(fields=['title', 'brand', 'category']),
            models.Index(fields=['price', 'is_available']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug and self.title:
            from django.utils.text import slugify
            base = slugify(self.title, allow_unicode=True) or 'product'
            slug = base
            counter = 1
            while Good.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f'{base}-{counter}'
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)
