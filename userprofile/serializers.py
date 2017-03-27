import os
from rest_framework.serializers import (
    Serializer,
    ModelSerializer,
    CharField,
    IntegerField,
    DateTimeField,
    HyperlinkedModelSerializer,
)

from rest_framework_jwt.settings import api_settings
from rest_framework.exceptions import ValidationError
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.db.models import Q

from .models import (
    Profile,
    Individual,
    Enterprise,
    Orgnization,
    Pquestion,
    Address,
    Freight,
    GrossCheck,
    DetailCheck,
    GrossCheckItem,
    GrossRecieptItem,
    Notification,
    Taxpayer,
)

from utility.views import (
    NewUserCode,
)


class IndividualSerializer(ModelSerializer):
    class Meta:
        model = Individual
        fields = ('wechat', 'qq')


class EnterpriseSerializer(ModelSerializer):
    class Meta:
        model = Enterprise
        fields = ('taxno', 'orgno')


class OrgnizationSerializer(ModelSerializer):
    class Meta:
        model = Orgnization
        fields = ('licname', 'licno')


class PasswordSerializer(ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('password',)

    def update(self, instance, validated_data):
        instance.set_password(validated_data.get('password', instance.password))
        instance.save()
        return instance


class UserSerializer(ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('username', 'first_name', 'last_name', 'email')


class AddressSerializer(ModelSerializer):
    class Meta:
        depth = 1
        model = Address
        fields = ('id', 'no', 'country', 'province', 'city', 'district', 'address')
        read_only_fields = ('id',)

    def create(self, validated_data):
        return Address.objects.create(**validated_data)


class ProfileSerializer(ModelSerializer):
    user = UserSerializer(required=False, read_only=True)
    address = AddressSerializer(required=False, allow_null=True)
    individual = IndividualSerializer(required=False, allow_null=True)
    enterprise = EnterpriseSerializer(required=False, allow_null=True)
    orgnization = OrgnizationSerializer(required=False, allow_null=True)

    class Meta:
        model = Profile
        fields = (
            'user',
            'usertype',
            'cell',
            'email',
            'name',
            'name2',
            'idtype',
            'idname',
            'idno',
            'address',
            'individual',
            'enterprise',
            'orgnization')
        read_only_fields = (
            'usertype',
            'cell',

        )

    def update(self, instance, validated_data):

        instance.name = validated_data.get('name', instance.name)
        instance.name2 = validated_data.get('name2', instance.name2)
        instance.idtype = validated_data.get('idtype', instance.idtype)
        instance.idname = validated_data.get('idname', instance.idname)
        instance.idno = validated_data.get('idno', instance.idno)
        instance.email = validated_data.get('email', instance.email)

        address_data = validated_data.get('address', None)
        if address_data:
            address = Address.objects.get(**address_data)
            instance.address = address

        if instance.usertype == 1:
            individual = Individual.objects.get(pk=instance.individual.id)
            individual_data = validated_data.get('individual', None)

            if individual_data:
                individual.wechat = individual_data.get('wechat', individual.wechat)
                individual.qq = individual_data.get('qq', individual.qq)
                individual.save()

        # update nick name to user account
        usr = instance.user
        usr.first_name = instance.name2
        usr.email = instance.email
        usr.save()

        instance.save()
        return instance


class RegisterSerializer(Serializer):
    # username=serializers.CharField(max_length=15,allow_blank=True,allow_null=True)
    weidcode = CharField(max_length=15, allow_blank=True, required=False)
    token = CharField(allow_blank=True, read_only=True)
    password = CharField(max_length=15)
    cell = CharField(max_length=15)
    usertype = IntegerField(default=1)

    name = CharField(max_length=50, allow_blank=True, required=False)
    licname = CharField(max_length=50, allow_blank=True, required=False)
    licno = CharField(max_length=50, allow_blank=True, required=False)

    otype = IntegerField(default=1, allow_null=True)

    def create(self, validated_data):
        print('register user...')
        usertype = validated_data["usertype"]
        weidcode = validated_data.get('weidcode')
        if not weidcode:
            weidcode = NewUserCode.generate_common_user_code(str(usertype))
        user = User.objects.create(
            # username=NewUserCode.generate_common_user_code(str(usertype))
            username=weidcode
        )

        user.set_password(validated_data['password'])
        user.save()

        profile = user.profile

        profile.cell = validated_data["cell"]
        # profile.utype = usertype
        profile.usertype = usertype

        profile.name = validated_data.get("name", None)
        profile.idtype = validated_data.get("idtype", None)
        profile.idname = validated_data.get("idname", None)
        profile.idno = validated_data.get("idno", None)

        if (usertype == 1):
            individual = Individual.objects.create()
            profile.individual_id = individual.id
        elif (usertype == 9):
            enterprise = Enterprise.objects.create()
            profile.enterprise_id = enterprise.id
        # elif (usertype == 8):
        elif (usertype == 5):
            orgnization = Orgnization.objects.create(otype=validated_data["otype"],
                                                     licname=validated_data.get("licname", None),
                                                     licno=validated_data.get("licno", None))
            profile.orgnization_id = orgnization.id
        # try:
        profile.save()

        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(user)
        validated_data["token"] = jwt_encode_handler(payload)
        validated_data['weidcode'] = user.username
        return validated_data


class PquestionSerializer(ModelSerializer):
    owner = UserSerializer(required=False, read_only=True)

    class Meta:
        model = Pquestion
        #     fields = ('question', 'answer')
        #
        # def create(self, validated_data):
        #     return Pquestion.objects.create(**validated_data)


#
#
# class NiceWeidcodeSerializer(ModelSerializer):
#     class Meta:
#         model = NiceWeidcode
#         fields = ('weidcode', 'price')


class GrossCheckItemSerializer(ModelSerializer):
    class Meta:
        model = GrossCheckItem


class GrossRecieptItemSerializer(ModelSerializer):
    class Meta:
        model = GrossRecieptItem


class GrossCheckSerializer(ModelSerializer):
    check_lst = GrossCheckItemSerializer(required=False, allow_null=True, many=True)
    receipt_lst = GrossRecieptItemSerializer(required=False, allow_null=True, many=True)
    examiner = CharField(required=False)
    delivery_date = DateTimeField(required=False)
    receipt_date = DateTimeField(required=False)
    inspect_date = DateTimeField(required=False)

    class Meta:
        model = GrossCheck
        fields = (
            'id',
            'sender_unit',
            'recipient_unit',
            'contract_no',
            'freight_no',
            'shippment_no',
            'check_lst',
            'receipt_lst',
            'sender',
            'recipient',
            'examiner',
            'delivery_date',
            'receipt_date',
            'inspect_date',
        )

    def create(self, validated_data):
        print('save gorss check ...')
        check_lst_data = ('check_lst' in validated_data.keys()) and validated_data.pop('check_lst') or None
        receipt_lst_data = ('receipt_lst' in validated_data.keys()) and validated_data.pop('receipt_lst') or None
        gross_check = GrossCheck.objects.create(**validated_data)

        if check_lst_data:
            serializer = GrossCheckItemSerializer(data=check_lst_data, many=True)
            if serializer.is_valid():
                serializer.save(gross_check=gross_check)

        if receipt_lst_data:
            serializer2 = GrossRecieptItemSerializer(data=receipt_lst_data, many=True)
            if serializer2.is_valid():
                serializer2.save(gross_check=gross_check)

        return gross_check


class DetailCheckSerializer(ModelSerializer):
    class Meta:
        model = DetailCheck
        fields = (
            'id',
            'sender_unit',
            'recipient_unit',
            'contract_no',
            'freight_no',
            'shippment_no',
            'sender',
            'recipient',
            'examiner',
            'delivery_date',
            'receipt_date',
            'inspect_date',
        )
        read_only_fields = ('id', 'freight')


class FreightSerializer(ModelSerializer):
    owner = UserSerializer(required=False)
    sender = UserSerializer(required=False)
    recipient = UserSerializer(required=False)
    created = DateTimeField(required=False)
    updated = DateTimeField(required=False)
    gross_check = GrossCheckSerializer(required=False, allow_null=True)
    detail_check = DetailCheckSerializer(required=False, allow_null=True)

    class Meta:
        model = Freight
        fields = (
            'id',
            'freight_no',
            'owner',
            'sender',
            'sender_weidcode',
            'sender_cell',
            'sender_address',
            'recipient',
            'recipient_weidcode',
            'recipient_cell',
            'recipient_address',
            'paymode',
            'paycard',
            'hasCheck',
            'gross_check',
            'detail_check',
            'manifest',
            'count',
            'volume',
            'weight',
            'delivery_method',
            'shipper',
            'shipper_weidcode',
            'mark',
            'status',
            'created',
            'updated',
        )
        read_only_fields = (
            'id', 'freight_no', 'owner', 'sender', 'recipient', 'shipper', 'status', 'created', 'updated')

    def create(self, validated_data):
        print('save freight...')
        owner = validated_data.get('owner')
        validated_data = self.initial_data
        validated_data['owner'] = owner
        sender_weidcode = validated_data.get('sender_weidcode')
        if sender_weidcode:
            sender = User.objects.get(username=sender_weidcode)
            validated_data['sender'] = sender

        recipient_weidcode = validated_data.get('recipient_weidcode')
        if recipient_weidcode:
            recipient = User.objects.get(username=recipient_weidcode)
            validated_data['recipient'] = recipient

        delivery_method = validated_data.get('delivery_method', '0')
        shipper_weidcode = validated_data.get('shipper_weidcode')
        if (delivery_method == 2 and shipper_weidcode):
            shipper = User.objects.get(username=shipper_weidcode)
            validated_data['shipper'] = shipper

        hasCheck = validated_data.get('hasCheck')
        gross_check_data = ('gross_check' in validated_data.keys()) and validated_data.pop('gross_check') or None
        detail_check_data = ('detail_check' in validated_data.keys()) and validated_data.pop('detail_check') or None

        freight = Freight.objects.create(**validated_data)
        self.__gen_notification__(freight)

        if hasCheck:
            if gross_check_data:
                gross_check_data['freight_no'] = validated_data['freight_no']
                serializer = GrossCheckSerializer(data=gross_check_data)
                if serializer.is_valid():
                    serializer.save()

            if detail_check_data:
                detail_check_data['freight_no'] = validated_data['freight_no']
                serializer = DetailCheckSerializer(data=detail_check_data)
                if serializer.is_valid():
                    serializer.save()

        return freight

    def update(self, instance, validated_data):
        instance.status += instance.status

        instance.save()
        return instance

    def __gen_notification__(self, freight):
        notify_data = {}
        title = 'goods'
        content = 'Notice, you have a piece of goods to be received. The delivery was applied by %s' % (freight.sender)
        notify_data['title'] = title
        notify_data['content'] = content
        serializer = NotificationSerializer(data=notify_data)
        if serializer.is_valid():
            serializer.save(owner=freight.recipient)


class NotificationSerializer(ModelSerializer):
    owner = UserSerializer(required=False)
    created = DateTimeField(required=False)

    class Meta:
        model = Notification
        read_only_fields = ('owner', 'created',)


#
# class BankAccountSerializer(ModelSerializer):
#     owner = UserSerializer(required=False, read_only=True)
#
#     class Meta:
#         model = BankAccount
#         fields = ('id', 'owner', 'name', 'bank', 'account', 'mark')
#         # read_only_fields = ('owner',)


class TaxpayerSerializer(ModelSerializer):
    owner = UserSerializer(required=False)
    created = DateTimeField(required=False)

    class Meta:
        model = Taxpayer
        read_only_fields = ('owner', 'created',)

    def update(self, instance, validated_data):
        newFile = validated_data.get('invoicepic')
        category = validated_data.get('category')
        oldFile = instance.invoicepic
        if ((category == '1' and newFile and oldFile) or (category == '0' and oldFile)):
            os.remove(oldFile.path)
            instance.invoicepic = None

        instance.category = validated_data.get('category', instance.category)
        instance.title = validated_data.get('title', instance.title)
        instance.taxpayerno = validated_data.get('taxpayerno', instance.taxpayerno)
        instance.phaddr = validated_data.get('phaddr', instance.phaddr)
        instance.bankacct = validated_data.get('bankacct', instance.bankacct)
        instance.invoicepic = validated_data.get('invoicepic', instance.invoicepic)
        instance.certified = validated_data.get('certified', instance.certified)

        instance.save()
        return instance

#
# class TaxpayerSerializer2(HyperlinkedModelSerializer):
#
#     class Meta:
#         model = Taxpayer
#         fields = ('url', 'pk', 'title', 'taxpayerno', 'certified', 'created')
