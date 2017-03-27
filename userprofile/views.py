import base64
from django.http import HttpResponse
import json
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from rest_framework.generics import (
    ListAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
)
from django.contrib.auth.models import User
from .models import (
    Profile,
    Pquestion,
    Address,
    Freight,
    Notification,
    Taxpayer,
)
from metadata.models import (NiceWeidcode,
                             AddressCode,
                             )
from metadata.serializers import (NiceWeidcodeSerializer, )

from .serializers import (
    UserSerializer,
    PasswordSerializer,
    RegisterSerializer,
    ProfileSerializer,
    PquestionSerializer,
    AddressSerializer,
    FreightSerializer,
    NotificationSerializer,
    TaxpayerSerializer,
)

from utility.views import NewFreightNo


class JSONResponse(HttpResponse):
    """
    An HttpResponse that renders its content into JSON.
    """

    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)


class UserListApiView(ListAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        serializer = UserSerializer(self.queryset)
        return Response(serializer.data, status=HTTP_200_OK)


class ProfileApiView(APIView):
    # permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = ProfileSerializer

    def get(self, request, username):
        user = User.objects.get(username=username)
        profile = Profile.objects.get(user=user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        profile = request.user.profile
        # print(request.data)
        serializer = ProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)


class UserRegisterApiView(APIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        data = request.data
        serializer = RegisterSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class CheckCellApiView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ProfileSerializer

    # query
    def post(self, request, *args, **kwargs):
        cellphone = request.data['cell']
        profiles = Profile.objects.filter(cell=cellphone)
        serializer = ProfileSerializer()
        if profiles.count() >= 1:
            serializer = ProfileSerializer(profiles, many=True)

        return Response(serializer.data, status=200)


class ChangePwdApiView(APIView):
    permission_classes = [IsAuthenticated]
    # permission_classes = [AllowAny]
    serializer_class = PasswordSerializer

    def put(self, request, *args, **kwargs):
        # need to replace it with authenticated user
        # print(request.user)
        # username = request.data['username']
        # user = User.objects.get(username=username)

        serializer = PasswordSerializer(request.user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


#
# class PquestionListApiView(ListAPIView):
#     # permission_classes = [IsAuthenticated]
#     serializer_class = PquestionSerializer
#
#     def get_queryset(self):
#         user = self.request.user
#         return Pquestion.objects.filter(owner=user)
#
#
# class PquestionApiView(APIView):
#     serializer_class = PquestionSerializer
#
#     def post(self, request, *args, **kwargs):
#         serializer = PquestionSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save(owner=request.user)
#             return Response(serializer.data, status=201)
#         return Response(serializer.errors, status=400)

class PquestionLC(ListCreateAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = PquestionSerializer

    def post(self, request, *args, **kwargs):
        serializer = PquestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def get_queryset(self):
        return Pquestion.objects.filter(owner=self.request.user)


class PquestionRUD(RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = PquestionSerializer
    queryset = Pquestion.objects.all()
    lookup_field = 'id'


# class AddressCreateApiView(CreateAPIView):
#     serializer_class = AddressSerializer
#
#     def post(self, request, *args, **kwargs):
#         serializer = AddressSerializer(data=request.data)
#         data_country = AddressCode.objects.get(pk=request.data['country'])
#         data_province = AddressCode.objects.get(pk=request.data['province'])
#         data_city = AddressCode.objects.get(pk=request.data['city'])
#         data_district = AddressCode.objects.get(pk=request.data['district'])
#         if serializer.is_valid():
#             serializer.save(owner=request.user,
#                             country=data_country,
#                             province=data_province,
#                             city=data_city,
#                             district=data_district)
#             return Response(serializer.data, status=201)
#         return Response(serializer.errors, status=400)
#
#
# class AddressDeleteApiView(DestroyAPIView):
#     # permission_classes = [AllowAny]
#     def delete(self, request, addressid):
#         addressid = self.kwargs.get('addressid')
#         address = Address.objects.filter(id=addressid).delete()
#         if address:
#             return Response({"count": "1", "address": address}, status=200)
#         return Response({"error": "system error"}, status=500)

#
# class AddressListApiView(ListAPIView):
#     # permission_classes = [AllowAny]
#     serializer_class = AddressSerializer
#
#     def get_queryset(self):
#         user = self.request.user
#         return Address.objects.filter(owner=user)
#
# class AddressRUDView(RetrieveUpdateDestroyAPIView):
#     permission_classes = (IsAuthenticatedOrReadOnly,)
#     serializer_class = AddressSerializer
#     queryset = Address.objects.all()
#     lookup_field = 'id'
#
#
# class AddressListCreateView(ListCreateAPIView):
#     permission_classes = (IsAuthenticatedOrReadOnly,)
#     serializer_class = AddressSerializer
#
#     def post(self, request, *args, **kwargs):
#         serializer = AddressSerializer(data=request.data)
#         data_country = AddressCode.objects.get(pk=request.data['country'])
#         data_province = AddressCode.objects.get(pk=request.data['province'])
#         data_city = AddressCode.objects.get(pk=request.data['city'])
#         data_district = AddressCode.objects.get(pk=request.data['district'])
#         if serializer.is_valid():
#             serializer.save(owner=request.user,
#                             country=data_country,
#                             province=data_province,
#                             city=data_city,
#                             district=data_district)
#             return Response(serializer.data, status=201)
#         return Response(serializer.errors, status=400)
#
#     def get_queryset(self):
#         user = self.request.user
#         return Address.objects.filter(owner=user)

class AddressViewSet(ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = AddressSerializer

    def get_queryset(self):
        return Address.objects.filter(owner=self.request.user)

    def create(self, request, *args, **kwargs):
        return super(AddressViewSet, self).create(request, *args, **kwargs)

    def perform_create(self, serializer):
        data_country = AddressCode.objects.get(pk=self.request.data['country'])
        data_province = AddressCode.objects.get(pk=self.request.data['province'])
        data_city = AddressCode.objects.get(pk=self.request.data['city'])
        data_district = AddressCode.objects.get(pk=self.request.data['district'])

        serializer.save(owner=self.request.user,
                            country=data_country,
                            province=data_province,
                            city=data_city,
                            district=data_district)


class StandardPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 1000


class NiceWeidcodeList(ListAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = NiceWeidcodeSerializer
    pagination_class = StandardPagination

    def get_queryset(self):
        weidcode = self.kwargs['weidcode']
        return NiceWeidcode.objects.filter(weidcode__contains=weidcode)


#
# class ConsignorDetail(RetrieveAPIView):
#     permission_classes = (IsAuthenticatedOrReadOnly,)
#
#     def get(self, request, *args, **kwargs):
#         weidcode = self.kwargs.get('weidcode')
#         profile = Profile.objects.get(user__username=weidcode)
#         data = {}
#         if profile:
#             data['weidcode'] = weidcode
#             data['cell'] = profile.cell
#             if profile.address:
#                 data['address'] = profile.address.no
#             else:
#                 data['address'] = ''
#         else:
#             data['weidcode'] = ''
#             data['cell'] = ''
#             data['address'] = ''
#
#         return Response(data, status=HTTP_200_OK)


# class DeliveryOptList(ListAPIView):
#     permission_classes = (IsAuthenticatedOrReadOnly,)
#     serializer_class = MetaTypeSerializer
#
#     def get_queryset(self):
#         language = settings.LANGUAGE_CODE
#         enumTypes = ['1008', '1010']
#         return MetaType.objects.filter(type__in=enumTypes, language=language)


class FreightRUDView(RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = FreightSerializer
    queryset = Freight.objects.all()

    # def post(self, request, *args, **kwargs):
    #     data = request.data
    #     freightS = data.pop('freight')[0]
    #     freight = json.loads(freightS)
    #
    #     if freight.get('hasCheck'):
    #         self.__resetlst__(which='gross_check', source=data, target=freight)
    #
    #     freight['freight_no'] = NewFreightNo.next_freight_no()
    #     freight['status'] = 0
    #     serializer = FreightSerializer(data=freight)
    #     if serializer.is_valid():
    #         serializer.save(owner=request.user)
    #         return Response(serializer.data, status=201)
    #     return Response(serializer.errors, status=400)
    #
    # def __resetlst__(self, which, source, target):
    #     check = target.get(which)
    #     if check:
    #         reciept_lst = check.get('receipt_lst')
    #
    #         for item in reciept_lst:
    #             pic = which + '_' + str(item.get('seq_no'))
    #             item['pic'] = source.get(pic)
    #
    #     target[which] = check


class FreightListCreateView(ListCreateAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = FreightSerializer

    def get_queryset(self):
        return Freight.objects.filter(owner=self.request.user)

    def post(self, request, *args, **kwargs):
        data = request.data
        freightS = data.pop('freight')[0]
        freight = json.loads(freightS)

        if freight.get('hasCheck'):
            self.__resetlst__(which='gross_check', source=data, target=freight)

        freight['freight_no'] = NewFreightNo.next_freight_no()
        freight['status'] = 0
        serializer = FreightSerializer(data=freight)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def __resetlst__(self, which, source, target):
        check = target.get(which)
        if check:
            reciept_lst = check.get('receipt_lst')

            for item in reciept_lst:
                pic = which + '_' + str(item.get('seq_no'))
                item['pic'] = source.get(pic)

        target[which] = check


class ShipperList(ListAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = UserSerializer

    def get_queryset(self):
        return User.objects.filter(username__startswith='5')


class NotificationViewSet(ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(owner=self.request.user)


class TaxpayerViewSet(ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = TaxpayerSerializer
    pagination_class = StandardPagination

    def get_queryset(self):
        return Taxpayer.objects.filter(owner=self.request.user)

    def create(self, request, *args, **kwargs):
        data = request.data
        taxpayer = json.loads(data.get('taxpayer'))
        invoicepic = data.get('invoicepic', None)
        if invoicepic:
            self.__base64toimg__(invoicepic)
            taxpayer['invoicepic'] = invoicepic

        for key in taxpayer:
            request.data[key] = taxpayer[key]
        return super(TaxpayerViewSet, self).create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def update(self, request, *args, **kwargs):
        data = request.data
        taxpayer = json.loads(data.get('taxpayer', None))
        invoicepic = ('invoicepic' in data.keys()) and data.pop('invoicepic')[0]

        if invoicepic:
            self.__base64toimg__(invoicepic)
            taxpayer['invoicepic'] = invoicepic
        elif 'invoicepic' in taxpayer.keys():
            taxpayer.pop('invoicepic')

        for key in taxpayer:
            request.data[key] = taxpayer[key]
        return super(TaxpayerViewSet, self).update(request, *args, **kwargs)

    def __base64toimg__(self, base64File):
        oldlines = base64File.readlines()
        newline = base64.decodebytes(oldlines[0])
        base64File.seek(0)
        base64File.truncate()
        base64File.writelines([newline])


class TaxpayerList(ListAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = TaxpayerSerializer
    pagination_class = StandardPagination

    def get_queryset(self):
        title = self.kwargs['title']
        return Taxpayer.objects.filter(title__icontains=title)
