from django.conf import settings
from django.core.mail import send_mail
from django.shortcuts import render
from .forms import SignUpForm, ContactForm
from .models import SignUp
# relative import

def signup(request):
	pass_title1 = "Hi User Please Signup Here to Continue..."

	# if request.user.is_authenticated:
	# 	pass_title1 = "Hi %s Please Signup Here to Continue..." %(request.user)		
	# dynamically sending data using the requested things

	form = SignUpForm(request.POST or None) # instance of the form
	context = {
	"title1" : pass_title1,
	"form" : form
	}
	if form.is_valid():
		# print request.POST["email"] #not recommented since it does not undergoes through the validations
		form_instance = form.save(commit=False) # commit=False for checking without submitting the form
		# full_name = form.cleaned_data.get("full_name") 
		# both are same but inorder to use this we need to write clean_full_name like clean_emal
		if not form_instance.full_name:
		# if not full_name:
			form_instance.full_name = "Unnamed"			
		form_instance.save()
		pass_title2 = "Thank You %s" %(form_instance.full_name)		
		context = {
			"title1" : "",
			"title2" : pass_title2,
			}
	# if request.method =="POST":
	# 	print request.POST
	if request.user.is_authenticated() and request.user.is_staff:
		query = SignUp.objects.all().order_by("-timestamp")
		# query = SignUp.objects.all().order_by("-timestamp").filter(full_name__icontains='nisha')
		# for instance in SignUp.objects.all():
		# 	print instance.full_name
		# context = {
		# "query": query
		# }

	return render(request, 'signup.html', context) 
	# render actually combines the request, html page and the context and makes some dynamic html page

def contact(request):
	title = 'Allways Keep in Touch with us...'
	form = ContactForm(request.POST or None)
	context = {
	"form" : form,
	"title": title
	}
	if form.is_valid():
		full_name = form.cleaned_data.get("full_name")
		form_email = form.cleaned_data.get("email")
		form_message = form.cleaned_data.get("message")
		#  sending mail using smtp
		subject = 'From Front Site'
		from_email = settings.EMAIL_HOST_USER
		to_email = [from_email]
		some_html = """
						<h1>Hello user</h1>
					   """
		contact_message = "%s: %s via %s" %(full_name, form_email, form_message)
		send_mail(subject, contact_message, from_email, to_email, html_message=some_html, fail_silently=False)

		# print full_name, email, message
		# or

		# for key in form.cleaned_data:
		# 	print key, form.cleaned_data.get(key)

		# or
		# for key, value in form.cleaned_data.iteritems():
		# 	print key, value

	return render(request, "forms.html", context)




















