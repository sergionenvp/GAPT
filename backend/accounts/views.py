from accounts.response import HttpResponseCode, create_response
from accounts.email import send_email
from accounts.sms import send_msg
from accounts.Eyes_recognition import logIn
from rest_framework.decorators import api_view
from django.http import HttpResponse


@api_view(["GET"])
def index(request):
    return HttpResponse("Hello, world. You're at the accounts index.") 

@api_view(["POST"])
def email_view(request):
    if request.method == "POST":
        return send_email(request.data)

@api_view(["POST"])
def sms_view(request):
    if request.method == "POST":
        return send_msg(request.data)

@api_view(["POST"])
def upload_view(request):
    if request.method == "POST":
        try:
            upload = request.FILES['image']
            name = request.data['id'] + '.jpeg'
            dir = open('accounts/image/' + name, 'wb+')
            for chunk in upload.chunks():
                dir.write(chunk)
            dir.close()
            person = logIn(upload)
            return create_response(HttpResponseCode.success, message=person)
        except:
            return create_response(HttpResponseCode.failed, False, False)          
        
        





