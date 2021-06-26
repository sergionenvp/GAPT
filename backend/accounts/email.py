from accounts.response import HttpResponseCode, create_response
from django.core.mail import send_mail
from django.conf import settings
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
        return create_response(HttpResponseCode.success, code, True)
    else:
        return create_response(HttpResponseCode.failed, 'error', False)

