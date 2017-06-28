from django.contrib import admin
from .models import SignUp
from .forms import SignUpForm


class SignUpAdmin(admin.ModelAdmin):
	list_display = ["__unicode__", "timestamp", "updated"]
	# class Meta:
	# 	model = SignUp
	form = SignUpForm
			
admin.site.register(SignUp, SignUpAdmin)
