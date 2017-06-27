from django.conf.urls import  url, patterns

urlpatterns = [

    url(r'^$', 'newsletter.views.signup', name='signup'),    

]
