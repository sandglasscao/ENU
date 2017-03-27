from django.conf.urls import url

from .views import (
    AddressCodeListApiView,
    # UserTypeList,
    # PaymodeMethodList,
    MetaTypeList,
    SecurityQuestionList,
)

urlpatterns = [
    url(r'^addresscode/(?P<superCode>[0-9a-z]+)$', AddressCodeListApiView.as_view(), name='addresscode'),
    # url(r'^usertypes$', UserTypeList.as_view(), name='usertype'),
    # url(r'^mod-mthd$', PaymodeMethodList.as_view(), name='mod-mthd'),
    url(r'^metatype/([0-9a-z,]+)$', MetaTypeList.as_view(), name='metatype'),
    url(r'^scrtq$', SecurityQuestionList.as_view(), name='scrtqst'),
]
