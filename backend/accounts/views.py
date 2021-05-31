from accounts.email import send_email
from accounts.Eyes_recognition import logIn
from accounts.Eyes_recognition import signUp
from rest_framework.decorators import api_view
from django.http import HttpResponse
from rest_framework.response import Response



@api_view(["GET"])
def index(request):
    return HttpResponse("Hello, world. You're at the accounts index.") 

@api_view(["POST"])
def email_view(request):
    if request.method == "POST":
        return send_email(request.data)
        
@api_view(["GET"])
def first_eyes_auth(request):
    if request.method == "GET":
        return signUp(request.data)
        
@api_view(["GET"])
def eyes_auth(request):
    if request.method == "GET":
        return logIn()





