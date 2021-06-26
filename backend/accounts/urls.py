from django.conf.urls import include
from django.urls import path
from accounts import views


urlpatterns = [
    path('', views.index, name='index'),
    path('email_view', views.email_view, name='email_view'),
    path('sms_view', views.sms_view, name='sms_view'),
    path('upload_view', views.upload_view, name='upload_view'),
    path('first_eyes_auth', views.first_eyes_auth, name = 'first_eyes_auth'),
    path('eyes_auth', views.eyes_auth, name = 'eyes_auth')
]


