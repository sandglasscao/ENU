# Create your views here.
from rest_framework.response import Response
from rest_framework.generics import (ListCreateAPIView, RetrieveUpdateDestroyAPIView)
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    IsAuthenticatedOrReadOnly
)

from metadata.models import (AddressCode, AllowedSegment, NiceWeidcode, NiceWeidcodeRegex)
from metadata.serializers import (
    AddressCodeSerializer,
    SegmentSerializer,
    NiceWeidcodeSerializer,
    NiceWeidcodeRegexSerializer,
)

from django.conf import settings
from urllib import request as urq
from bs4 import BeautifulSoup
import numpy as np

class RefreshAddrCode(ListCreateAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = AddressCode.objects.all()
    serializer_class = AddressCodeSerializer

    def post(self, request, *args, **kwargs):
        url = request.data['url']
        levels = {1: 'provincetr', 2: 'citytr', 3: 'countytr', 4: 'towntr', 5: 'villagetr'}
        addrs = []
        self.__parse_html__(url, 1, levels, addrs)
        addrfile = open('/workspace/addrs.txt', 'w')
        print(addrs, file=addrfile)

    def __read_html__(self, url):
        urlpre = url.replace(url.split('/')[-1], '')
        webPage = urq.urlopen(url, timeout=60)
        content = webPage.read().decode('gbk')
        soup = BeautifulSoup(content, 'lxml')
        return urlpre, soup

    def __parse_province__(self, url, level, levels, addrs):
        urlpre, soup = self.__read_html__(url)
        links = []
        for element in soup.find_all('tr', class_=levels[level]):
            if element.td.a:
                code = element.td.a.string
                link = urlpre + element.td.a['href']
                links.append(link)
            else:
                code = element.td.string

            if level == 5:
                codeNode = element.td.next_sibling
                category = codeNode.string
                name = codeNode.next_sibling.string
            else:
                name = element.td.next_sibling.string
                category = None

            addr = {'code': code, 'name': name, 'category': category}
            addrs.append(addr)

        for link in links:
            self.__parse_province__(link, level + 1, levels, addrs)

    def __parse_html__(self, url, level, levels, addrs):
        urlpre, soup = self.__read_html__(url)
        links = []
        for element in soup.find_all('tr', class_=levels[level]):
            for child in element.children:
                link = child.a['href']
                name = child.a.next_element
                code = link.split('.')[0]
                addrs.append({'code': code, 'name': name, 'category': None})
                link = urlpre + link
                links.append(link)
        for link in links:
            self.__parse_province__(link, level + 1, levels, addrs)

    def __refresh_addrCode__(self, url):
        AddressCodeList = []
        serializer = AddressCodeSerializer(data=AddressCodeList, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class UploadAddressCode(ListCreateAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = AddressCode.objects.all()
    serializer_class = AddressCodeSerializer

    def post(self, request, *args, **kwargs):
        languageCode = request.data.get('lang', settings.LANGUAGE_CODE)
        encodeType = {
            'en-us': 'utf8',
            'zh-hans': 'gbk'
        }
        titles = 'code,superCode,description'

        addrFile = request.data.get('addrfile')
        if not addrFile:
            return {'error': 'No address code'}

        firstLine = addrFile.readline()  # get titles

        AddressCode.objects.all().delete()
        AddressCodeList = []

        if 'language' in firstLine.decode(encodeType[languageCode]):
            hasLang = True
        else:
            hasLang = False

        for line in addrFile.readlines():
            if len(line) <= 0:
                break

            line = line.decode(encodeType[languageCode])

            listTmp = line.split(',')

            addrCode = {}
            addrCode['code'] = listTmp[0]
            addrCode['superCode'] = listTmp[1]
            addrCode['description'] = listTmp[2]
            addrCode['language'] = (listTmp[3] and hasLang) or languageCode

            AddressCodeList.append(addrCode)

        serializer = AddressCodeSerializer(data=AddressCodeList, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class SegmentLCView(ListCreateAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = AllowedSegment.objects.all()
    serializer_class = SegmentSerializer


class SegmentRUDView(RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = SegmentSerializer
    queryset = AllowedSegment.objects.all()
    lookup_field = 'id'


class NicWdcdRegexLCView(ListCreateAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = NiceWeidcodeRegex.objects.all()
    serializer_class = NiceWeidcodeRegexSerializer


class NicWdcdRegexRUDView(RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = NiceWeidcodeRegexSerializer
    queryset = NiceWeidcodeRegex.objects.all()
    lookup_field = 'id'


class NiceWeidcodeLCView(ListCreateAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = NiceWeidcode.objects.all()
    serializer_class = NiceWeidcodeSerializer

class NiceWeidcodeRUDView(RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = NiceWeidcodeSerializer
    queryset = NiceWeidcode.objects.all()
    lookup_field = 'id'
