from accounts.email import send_email
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.decorators import api_view, authentication_classes
from django.http import HttpResponse


from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework import permissions
from accounts.serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]


@api_view(["GET"])
def index(request):
    return HttpResponse("Hello, world. You're at the polls index.") 

@api_view(["POST"])
@authentication_classes([SessionAuthentication, BasicAuthentication, TokenAuthentication])
def email_view(request):
    if request.method == "POST":
        return send_email(request.data)





