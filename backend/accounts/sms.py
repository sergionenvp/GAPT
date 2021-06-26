from accounts.response import HttpResponseCode, create_response
from sendsms import api
from django.conf import settings
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
        return create_response(HttpResponseCode.success, code, True)
    else:
        return create_response(HttpResponseCode.failed, 'error', False)
