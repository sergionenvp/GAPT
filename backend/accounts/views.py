from accounts.email import send_email
from rest_framework.decorators import api_view
from django.http import HttpResponse




@api_view(["GET"])
def index(request):
    return HttpResponse("Hello, world. You're at the polls index.") 

@api_view(["POST"])
def email_view(request):
    if request.method == "POST":
        return send_email(request.data)





