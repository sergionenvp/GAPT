from django.core.mail import send_mail
from rest_framework.response import Response
from django.conf import settings
from rest_framework import status
from enum import Enum
import random


def send_email(obj):
    # generate 5-digit code
    code = random.randint(10000,99999)
    # create email
    subject = obj['subject']
    message = obj['message'] + str(code)
    to_email = obj['toEmail']
    # define email used to send emails from
    from_email = settings.EMAIL_HOST_USER
    if subject and message and from_email:
        # send email 
        send_mail(subject, message, from_email, [to_email], fail_silently = False)
        return create_response(HttpResponseCode.success, code, False)
    else:
        return create_response(HttpResponseCode.failed, 'error', False)

class HttpResponseCode(Enum):
    success = 200
    failed = 400

def response_code(code):
    if code == HttpResponseCode.success:
        return status.HTTP_200_OK
    elif code == HttpResponseCode.failed:
        return status.HTTP_400_BAD_REQUEST

def create_response(code=None, message=None, success=None, redirect=None):
    response = {'success': success, 'message': message}
    if redirect != None:
        response['redirect'] = redirect
    return Response(data=response, status=response_code(code))
