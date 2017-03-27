from django.conf.urls import url

from .views import (
    UserListApiView,
    UserRegisterApiView,
    CheckCellApiView,
    ChangePwdApiView,
    ProfileApiView,
    # PquestionApiView,
    # PquestionListApiView,
    PquestionLC,
    PquestionRUD,
    NiceWeidcodeList,
    # AddressListApiView,
    # AddressCreateApiView,
    # AddressDeleteApiView,
    AddressViewSet,
    FreightListCreateView,
    ShipperList,
    NotificationViewSet,
    TaxpayerList,
    TaxpayerViewSet,
)

address_list = AddressViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
address_detail = AddressViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

notification_list = NotificationViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
notification_detail = NotificationViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

taxpayer_list = TaxpayerViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
taxpayer_detail = TaxpayerViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

urlpatterns = [
    url(r'^$', UserListApiView.as_view(), name='list'),
    url(r'^(?P<username>[0-9]+)$', ProfileApiView.as_view(), name='retrieve'),
    url(r'^register$', UserRegisterApiView.as_view(), name='register'),

    url(r'^register/checkcell', CheckCellApiView.as_view(), name='checkcell'),
    url(r'^changepwd', ChangePwdApiView.as_view(), name='changepwd'),
    url(r'^register/(?P<weidcode>[0-9]{0,12})$', NiceWeidcodeList.as_view(), name='ncwdcd'),
    # url(r'^pqs$', PquestionListApiView.as_view(), name='pqlist'),
    # url(r'^pqs/create$', PquestionApiView.as_view(), name='pqcreate'),
    # url(r'^addresses/create/$', AddressCreateApiView.as_view(), name='address_create'),
    # url(r'^addresses/(?P<addressid>[0-9])/$', AddressCreateApiView.as_view(), name='address_detail'),
    # url(r'^addresses/(?P<addressid>[0-9])/edit$', AddressCreateApiView.as_view(), name='address_edit'),
    # url(r'^addresses/(?P<addressid>[0-9])/delete$', AddressDeleteApiView.as_view(), name='address_delete'),
    url(r'^pqs/(?P<id>[0-9]+)$', PquestionRUD.as_view(), name='pq'),
    url(r'^pqs$', PquestionLC.as_view(), name='pq_lc'),
    url(r'^addresses/$', address_list, name='address-list'),
    url(r'^addresses/(?P<pk>[0-9]+)$', address_detail, name='address-detail'),
    url(r'^taxpayer/$', taxpayer_list, name='taxpayer-list'),
    url(r'^taxpayer/(?P<pk>[0-9]+)$', taxpayer_detail, name='taxpayer-detail'),
    url(r'^srch-txpr/(?P<title>[\w]*)$', TaxpayerList.as_view(), name='srch-txpr'),
    url(r'^delivery/shipper$', ShipperList.as_view(), name='shipper'),
    url(r'^delivery/$', FreightListCreateView.as_view(), name='freight_lc'),
    url(r'^notify/$', notification_list, name='notification-list'),
    url(r'^notify/(?P<pk>[0-9]+)$', notification_detail, name='notification-detail'),

]
