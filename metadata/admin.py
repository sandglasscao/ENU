from django.contrib import admin
from metadata.models import *

# Register your models here.
# class UserTypeAdmin(admin.ModelAdmin):
#     list_display = ('code', 'value', 'language')
#     search_fields = ('code', 'language')

class AddressCodeAdmin(admin.ModelAdmin):
    list_display = ('code', 'superCode', 'description', 'language')
    search_fields = ('code', 'superCode', 'language')

# class AllowedSegmentAdmin(admin.ModelAdmin):
#     list_display = ('userType', 'scope')
#     search_fields = ('userType', 'scope')

# class ConstrainRegexAdmin(admin.ModelAdmin):
#     list_display = ('userType', 'regex')
#     search_fields = ('userType', 'regex')


class SecurityQuestionAdmin(admin.ModelAdmin):
    list_display = ('seq_num', 'description', 'language')
    search_fields = ('seq_num', 'language')


class MetaTypeAdmin(admin.ModelAdmin):
    list_display = ('type', 'code', 'value', 'language', 'mark')
    search_fields = ('type', 'code', 'language', 'value')

#admin.site.register(UserType, UserTypeAdmin)
admin.site.register(AddressCode, AddressCodeAdmin)
#admin.site.register(AllowedSegment, AllowedSegmentAdmin)
#admin.site.register(ConstrainRegex, ConstrainRegexAdmin)
admin.site.register(SecurityQuestion, SecurityQuestionAdmin)
admin.site.register(MetaType, MetaTypeAdmin)