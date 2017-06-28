from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie
from django.views.decorators.cache import never_cache

def login(request):
    details = {}
    if request.POST:
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username = username, password = password)
        
        if user is not None:
            if user.is_active:
                auth_login(request, user)
                if user.groups.filter(name='Su_admin').exists():
                    return HttpResponseRedirect('/shipadmin/')
                if user.groups.filter(name='Market_user').exists():
                    return HttpResponseRedirect('/muser/')
                if user.groups.filter(name='customer').exists():
                    return HttpResponseRedirect('/customer/')
                if user.groups.filter(name='transporter').exists():
                    return HttpResponseRedirect('/trans/')
                if user.groups.filter(name='superadmin').exists():
                    return HttpResponseRedirect('/su_admin/')
        else:
            details.update({'msg': 'Username and Password does not match !!!!!'})
    return render(request,'home.html', details)

#@cache_page(1*1)
#@vary_on_cookie
@never_cache
def home(request):
    return render(request,'home.html')


def faq(request):
    return render(request,'faq.html')


def greentransport(request):
    return render(request,'green_transport.html')

def jobs(request):
    return render(request,'jobs.html')
