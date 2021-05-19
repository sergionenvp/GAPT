from django.conf.urls import include
from django.urls import path
from accounts import views


urlpatterns = [
    path('', views.index, name='index'),
    path('email_view', views.email_view, name='email_view'),
]


