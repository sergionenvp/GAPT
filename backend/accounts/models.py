from datetime import datetime 
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import BaseUserManager
from django.db import models

class UserManager(BaseUserManager):
    def _create_user(self, email, password, is_staff, is_superuser, image, **extra_fields):
        if not email:
            raise ValueError('User must have email address')
        if not password:
            raise ValueError('User must have password') 
        now = timezone.now()
        email = self.normalize_email(email)
        user = self.model(
                email=email,
                is_active=True,
                is_staff = is_staff,
                is_superuser = is_superuser,
                image = image,
                auth_mode='1',
                last_login=now,
                date_joined=now,
                **extra_fields
                )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password, **extra_fields):

        return self._create_user(email, password, False, False, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        user=self._create_user(email, password, True, True, **extra_fields)
        user.save(using=self._db)
        return user


class User(AbstractUser):
    email = models.EmailField(max_length=255, unique=True)
    phone = models.CharField(max_length=30, blank=True)
    image = models.ImageField(upload_to='images/', null=True, blank=True)
    image_hash = models.CharField(max_length=255, blank=True)
    auth_mode = models.CharField(max_length=5, blank=True)
    username = None

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['phone', 'auth_mode', 'image']

    objects = UserManager()
