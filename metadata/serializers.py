from rest_framework.serializers import (
    ModelSerializer,

)

from .models import *


class AddressCodeSerializer(ModelSerializer):
    class Meta:
        model = AddressCode
        #fields = ('id', 'code', 'description', 'superCode', 'language')
        #read_only_fields = ('id',)


class MetaTypeSerializer(ModelSerializer):
    class Meta:
        model = MetaType
        #fields = ('type', 'code', 'value', 'language')


class SegmentSerializer(ModelSerializer):
    class Meta:
        model = AllowedSegment
        #fields = ('id', 'userType', 'scope')


class NiceWeidcodeRegexSerializer(ModelSerializer):
    class Meta:
        model = NiceWeidcodeRegex
        #fields = ('id', 'userType', 'regex')


class NiceWeidcodeSerializer(ModelSerializer):
    class Meta:
        model = NiceWeidcode
        #fields = ('id', 'weidcode', 'price', 'used')


class SecurityQuestionSerializer(ModelSerializer):
    class Meta:
        model = SecurityQuestion