from rest_framework.response import Response
from rest_framework import status
from enum import Enum

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