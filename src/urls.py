from django.conf import settings # for static file server setup
from django.conf.urls.static import static # for static file server setup
from django.conf.urls import include, url, patterns
from django.contrib import admin
from views import about


urlpatterns = [
	# Examples:
    # url(r'^$', 'src.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    # url(r'^$', include('newsletter.urls', namespace='hadmin')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^accounts/', include('registration.backends.default.urls')),
    url(r'^$', include('newsletter.urls', namespace='news')),
    url(r'^contact/$', 'newsletter.views.contact', name='contact'),
    url(r'^about/$', 'src.views.about', name='about'),
] 
# + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) # for static file server setup 
# SECURITY WARNING: don't run with debug turned on in production!
# for that we are seperating these setups from urlpatterns 
if settings.DEBUG:
	urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) 
	urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 

