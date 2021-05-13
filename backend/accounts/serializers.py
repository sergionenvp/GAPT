from django.contrib.auth.models import User
from rest_framework import serializers
from accounts import profile


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'password' ]

