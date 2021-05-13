from django.conf.urls import include
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework import routers
from accounts import views
from .views import UserViewSet

router = routers.DefaultRouter()
router.register('users', UserViewSet)


urlpatterns = [
    path('', views.index, name='index'),
    path('email_view', views.email_view, name='email_view'),
    path('', include(router.urls)),
]


