from django.db import models
from django.utils import timezone
# from django.core.urlresolvers import reverse
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from metadata.models import (AddressCode, MetaType, SecurityQuestion)


# common user profile data model
class Profile(models.Model):
    # extend default user model
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    # https://docs.djangoproject.com/en/1.9/ref/models/fields/
    usertype = models.IntegerField(default=1)  # 1,5,9
    cell = models.CharField(max_length=11, unique=True)
    email = models.EmailField(null=True)
    address = models.ForeignKey('Address', null=True)  # default address
    name = models.CharField(max_length=50, null=True)
    name2 = models.CharField(max_length=50, null=True)  # nickname or shortname
    idtype = models.IntegerField(default=1, null=True)
    idname = models.CharField(max_length=50, null=True)
    idno = models.CharField(max_length=20, null=True)

    individual = models.ForeignKey(
        'Individual',
        on_delete=models.CASCADE,
        null=True,
    )
    enterprise = models.ForeignKey(
        'Enterprise',
        on_delete=models.CASCADE,
        null=True,
    )
    orgnization = models.ForeignKey(
        'Orgnization',
        on_delete=models.CASCADE,
        null=True,
    )

    def save(self, *args, **kwargs):
        try:
            this = Profile.objects.get(id=self.id)
        except:
            pass
        super(Profile, self).save(*args, **kwargs)

        # def get_absolute_url(self):

    # return reverse('profile',  kwargs={'id': self.pk})

    def __str__(self):
        return self.user.username

        # def __unicode__(self):
        #     return u'%s' % self.user


User.profile = property(lambda u: Profile.objects.get_or_create(user=u)[0])


# def create_user_profile(sender, instance, created, **kwargs):
#     if created:
#         Profile.objects.create(user=instance)

# post_save.connect(create_user_profile, sender=User)


class Individual(models.Model):
    # nickname = models.CharField(max_length=50,null=True)
    # name =  models.CharField(max_length=50,null=True)

    wechat = models.CharField(max_length=20, null=True)
    qq = models.CharField(max_length=15, null=True)


class Enterprise(models.Model):
    # shortname = models.CharField(max_length=50,null=True)
    # name = models.CharField(max_length=50,null=True)
    # bussinessno = models.CharField(max_length=20,null=True)
    taxno = models.CharField(max_length=20, null=True)
    orgno = models.CharField(max_length=20, null=True)


class Orgnization(models.Model):
    otype = models.IntegerField(default=1)
    licname = models.CharField(max_length=100)
    licno = models.CharField(max_length=100)


# password's question        
class Pquestion(models.Model):
    owner = models.ForeignKey(User)
    question = models.CharField(max_length=100)
    answer = models.CharField(max_length=100)


class Address(models.Model):
    no = models.IntegerField(default=1)
    country = models.ForeignKey(
        AddressCode,
        related_name='country', )
    province = models.ForeignKey(
        AddressCode,
        related_name='province', )
    city = models.ForeignKey(
        AddressCode,
        related_name='city', )
    district = models.ForeignKey(
        AddressCode,
        related_name='district', )
    address = models.CharField(max_length=300)
    owner = models.ForeignKey(User)


class Freight(models.Model):

    class Meta:
        unique_together = (('freight_no', 'status'),)

    freight_no = models.IntegerField(default=0)
    owner = models.ForeignKey(User)
    sender = models.ForeignKey(User, related_name='sender')
    sender_weidcode = models.CharField(max_length=12)
    sender_cell = models.CharField(max_length=15)
    sender_address = models.CharField(max_length=100)
    recipient = models.ForeignKey(User, related_name='recipient')
    recipient_weidcode = models.CharField(max_length=12)
    recipient_cell = models.CharField(max_length=15)
    recipient_address = models.CharField(max_length=100)
    paymode = models.IntegerField(default=0)
    paycard = models.CharField(max_length=20, null=True)
    hasCheck = models.NullBooleanField(default=False)
    manifest = models.CharField(max_length=100)
    count = models.IntegerField(null=True)
    volume = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    weight = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    delivery_method = models.IntegerField(default=0)
    shipper = models.ForeignKey(User, related_name='shipper', null=True)
    shipper_weidcode = models.CharField(max_length=12, null=True)
    mark = models.CharField(max_length=100, null=True)
    status = models.IntegerField(default=0)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

class GrossCheck(models.Model):
    freight_no = models.IntegerField(default=0, unique=True)
    sender_unit = models.CharField(max_length=50)
    recipient_unit = models.CharField(max_length=50)
    contract_no = models.CharField(max_length=20)
    shippment_no = models.CharField(max_length=20)
    sender = models.CharField(max_length=50)
    recipient = models.CharField(max_length=50)
    examiner = models.CharField(max_length=50, null=True)
    delivery_date = models.DateField(auto_now=True)
    receipt_date = models.DateField(auto_now=True)
    inspect_date = models.DateField(auto_now=True)

class GrossCheckItem(models.Model):
    gross_check = models.ForeignKey(GrossCheck, related_name='check_item', null=True)
    seq_no = models.IntegerField(null=True)
    case_no = models.IntegerField(null=True)
    volume = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    weight = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

class GrossRecieptItem(models.Model):
    gross_check = models.ForeignKey(GrossCheck, related_name='reciept_item', null=True)
    seq_no = models.IntegerField(null=True)
    case_no = models.IntegerField(null=True)
    desc = models.CharField(max_length=200, null=True, blank=True)
    pic = models.FileField(upload_to='delivery/gross/%Y/%m/%d', null=True)
    advice = models.CharField(max_length=200, null=True, blank=True)


class DetailCheck(models.Model):
    freight_no = models.IntegerField(default=0, unique=True)
    sender_unit = models.CharField(max_length=50)
    recipient_unit = models.CharField(max_length=50)
    contract_no = models.CharField(max_length=20)
    shippment_no = models.CharField(max_length=20)
    sender = models.CharField(max_length=50)
    recipient = models.CharField(max_length=50)
    examiner = models.CharField(max_length=50)
    delivery_date = models.DateField()
    receipt_date = models.DateField()
    inspect_date = models.DateField()


class Notification(models.Model):
    owner = models.ForeignKey(User, null=True)
    title = models.CharField(max_length=30)
    content = models.CharField(max_length=200, null=True)
    status = models.NullBooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)

#
# class BankAccount(models.Model):
#     owner = models.ForeignKey(User, null=True)
#     name = models.CharField(max_length=100)
#     bank = models.CharField(max_length=100)
#     account = models.BigIntegerField()
#     mark = models.CharField(max_length=200, null=True, blank=True)


class Taxpayer(models.Model):
    owner = models.ForeignKey(User, null=True)
    category = models.CharField(max_length=3)
    title = models.CharField(max_length=200)
    taxpayerno = models.CharField(max_length=50, null=True)
    phaddr = models.CharField(max_length=200, null=True)
    bankacct = models.CharField(max_length=100, null=True)
    #account = models.BigIntegerField(null=True)
    certified = models.NullBooleanField(default=False)
    invoicepic = models.FileField(upload_to='taxpayer/%Y/%m/%d', null=True)
    #invoicepic = models.ImageField(upload_to='taxpayer/%Y/%m/%d', null=True)
    created = models.DateTimeField(auto_now_add=True)
