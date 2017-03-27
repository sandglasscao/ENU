from metadata.models import *
from userprofile.models import Freight
from django.contrib.auth.models import User
from django.conf import settings
import re


# generate new user code
class NewUserCode(object):
    user_code_meta = {}

    # initialize the global variable to set meta data for generating a new user code
    @classmethod
    def initialize_user_code_meta(cls):
        cls.__init_user_type__()
        cls.init_allowed_segment()
        cls.init_constrain_regrex()
        cls.__init_latest_user_code__()

    @classmethod
    def __init_latest_user_code__(cls):
        for user_type in cls.user_code_meta:
            prefix_user_code = user_type + cls.user_code_meta[user_type]['scope']
            latest_userCode = cls.__max_user_code__(user_type, prefix_user_code)
            cls.user_code_meta[user_type]['latest_user_code'] = latest_userCode

    @classmethod
    def __max_user_code__(cls, user_type, pre):
        min_user_code = int(pre) * 1000000
        pattern_lst = cls.user_code_meta[user_type]['pattern']
        weidcode_lst = [user.username for user in User.objects.filter(username__startswith=pre)]
        weidcode_lst.sort()
        max_user_code = weidcode_lst and weidcode_lst.pop() or str(min_user_code)
        while (weidcode_lst and cls.__isMached_userCode__(max_user_code, pattern_lst)):
            max_user_code = weidcode_lst.pop()

        return int(max_user_code)


    # get enumeration value for user type and set into the global dictionary variable user_code_meta
    @classmethod
    def __init_user_type__(cls):
        language = settings.LANGUAGE_CODE
        for user_type in MetaType.objects.filter(type='1001', language=language):
            cls.user_code_meta[user_type.code] = {}

        # set default user type to avoid exception
        if not cls.user_code_meta:
            cls.user_code_meta['1'] = {}

    # get enumeration value for allowed segment for all user type and set into the global dictionary variable user_code_meta
    @classmethod
    def init_allowed_segment(cls):
        for user_type in cls.user_code_meta:
            try:
                allowed_scope = AllowedSegment.objects.filter(userType=user_type).latest('id').scope
            except AllowedSegment.DoesNotExist:
                allowed_scope = '00000'

            cls.user_code_meta[user_type]['scope'] = allowed_scope

    # get all constrain regular expressions for all user type and set into the global dictionary variable user_code_meta
    @classmethod
    def init_constrain_regrex(cls):
        for user_type in cls.user_code_meta:
            pattern_lst = []
            for constrain_regex_obj in NiceWeidcodeRegex.objects.filter(userType=user_type):
                pattern = user_type + NewUserCode.user_code_meta[user_type]['scope'] + constrain_regex_obj.regex
                pattern_lst.append(pattern)

            cls.user_code_meta[user_type]['pattern'] = pattern_lst

    # generate a new user code just by adding 1 on the latest used code
    @classmethod
    def __next_user_code__(cls, user_type):
        if not cls.user_code_meta:
            cls.initialize_user_code_meta()
        cls.user_code_meta[user_type]['latest_user_code'] = cls.user_code_meta[user_type]['latest_user_code'] + 1
        return cls.user_code_meta[user_type]['latest_user_code']

    @classmethod
    def __isMached_userCode__(cls, user_code, pattern_lst):
        flag = False
        for pattern in pattern_lst:
            regex = re.compile(pattern)
            if regex.match(user_code):
                flag = True
                break
        return flag

    # generate common user code with user type
    @classmethod
    def generate_common_user_code(cls, user_type):
        next_user_code = str(cls.__next_user_code__(user_type))
        pattern_lst = cls.user_code_meta[user_type]['pattern']
        while cls.__isMached_userCode__(next_user_code, pattern_lst):
            next_user_code = str(cls.__next_user_code__(user_type))

        return next_user_code

# generate freight no
class NewFreightNo(object):
    freight_no = None

    @classmethod
    def next_freight_no(cls):
        if not cls.freight_no:
            cls.__init_freight_no__()
        cls.freight_no = cls.freight_no + 1
        return cls.freight_no

    @classmethod
    def __init_freight_no__(cls):
        try:
            latest_freight = Freight.objects.latest('freight_no')
            cls.freight_no = latest_freight.freight_no
        except Freight.DoesNotExist:
            cls.freight_no = 0
