from django.conf.urls import url

from .views import (
    UploadAddressCode,
    RefreshAddrCode,
    SegmentLCView,
    SegmentRUDView,
    NicWdcdRegexLCView,
    NicWdcdRegexRUDView,
)

urlpatterns = [
    url(r'^addrcode/refresh$', RefreshAddrCode.as_view(), name='addrcode'),
    url(r'^addrcode$', UploadAddressCode.as_view(), name='addrcode'),
    url(r'^segment/(?P<id>[0-9]+)$', SegmentRUDView.as_view(), name='segment'),
    url(r'^segment$', SegmentLCView.as_view(), name='segment-lc'),
    url(r'^nicwdcd/(?P<id>[0-9]+)$', NicWdcdRegexRUDView.as_view(), name='nicwdcd'),
    url(r'^nicwdcd$', NicWdcdRegexLCView.as_view(), name='nicwdcd-lc'),

]
