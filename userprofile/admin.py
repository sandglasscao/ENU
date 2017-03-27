from django.contrib import admin

# Register your models here.
from .models import (
    Profile,
    Individual,
    Enterprise,
    Orgnization,
    Pquestion,
    Address)

admin.site.register(Profile)
admin.site.register(Individual)
admin.site.register(Enterprise)
admin.site.register(Orgnization)
admin.site.register(Pquestion)
admin.site.register(Address)