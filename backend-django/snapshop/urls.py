from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/auth/', include('accounts.auth_urls')),
    path('api/users/', include('accounts.user_urls')),
    path('api/category/', include('catalog.category_urls')),
    path('api/brand/', include('catalog.brand_urls')),
    path('api/good/', include('catalog.good_urls')),
]

admin.site.site_header = 'SnapShop Admin'
admin.site.site_title = 'SnapShop'
admin.site.index_title = 'مدیریت فروشگاه'

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
