from sendsms import api
from rest_framework.response import Response
from django.conf import settings
from rest_framework import status
from enum import Enum
import random


def send_msg(obj):
    # generate 5-digit code
    code = random.randint(10000,99999)
    # create email
    body = obj['body'] + str(code)
    to = obj['toNum']
    # define email used to send emails from
    from_phone = settings.SENDSMS_HOST_USER
    if body and to and from_phone:
        # send email 
        api.send_sms(body, from_phone, [to], fail_silently = False)
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