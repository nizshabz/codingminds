from django.db import models

class SignUp(models.Model):
	"""Newsletter"""

	email = models.EmailField()
	full_name = models.CharField(max_length=120, blank=True, null=True)
	# null in db, blank in form
	timestamp = models.DateTimeField(auto_now_add=True, auto_now=False)
	updated = models.DateTimeField(auto_now_add=False, auto_now=True)

	def __unicode__(self):
		# __str__for python 3
		return self.email
		