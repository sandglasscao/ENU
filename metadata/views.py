from rest_framework.generics import ListAPIView
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticatedOrReadOnly,
)
from .models import (
    AddressCode,
    MetaType,
    SecurityQuestion,
)

from .serializers import (
    AddressCodeSerializer,
    MetaTypeSerializer,
    SecurityQuestionSerializer
)

from django.conf import settings


class AddressCodeListApiView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = AddressCodeSerializer

    def get_queryset(self):
        return AddressCode.objects.filter(superCode=self.kwargs['superCode'])


# class PaymodeMethodList(ListAPIView):
#     permission_classes = (IsAuthenticatedOrReadOnly,)
#     serializer_class = MetaTypeSerializer
#
#     def get_queryset(self):
#         language = settings.LANGUAGE_CODE
#         enumTypes = ['1008', '1010']
#         return MetaType.objects.filter(type__in=enumTypes, language=language)
#
# class UserTypeList(ListAPIView):
#     permission_classes = (IsAuthenticatedOrReadOnly,)
#     serializer_class = MetaTypeSerializer
#
#     def get_queryset(self):
#         language = settings.LANGUAGE_CODE
#         enumTypes = ['1001']
#         return MetaType.objects.filter(type__in=enumTypes, language=language)

class MetaTypeList(ListAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = MetaTypeSerializer

    def get_queryset(self):
        language = settings.LANGUAGE_CODE
        if self.args:
            codestr = self.args[0]
            codes = codestr.split(',')
            return MetaType.objects.filter(type__in=codes, language=language)


class SecurityQuestionList(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = SecurityQuestionSerializer

    def get_queryset(self):
        return SecurityQuestion.objects.filter(language=settings.LANGUAGE_CODE)
