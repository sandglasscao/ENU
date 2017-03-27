from django.db import models

# generate enumerations for user type.
# class UserType(models.Model):
#     class Meta:
#         unique_together = (('code', 'language'),)
#         ordering = ['language', 'code']
#     code = models.CharField(max_length=1)
#     value = models.CharField(max_length=20)
#     language = models.CharField(max_length=10)
#
#     def __str__(self):
#         return '%s - %s' % (self.code, self.value)
    
# upload address hierarchy for address enumerations 
class AddressCode(models.Model):
    class Meta:
        unique_together = (('code', 'language'),)
        ordering = ['superCode', 'code']
    code = models.CharField(max_length=15)
    description = models.CharField(max_length=100)
    superCode = models.CharField(max_length=15)
    language = models.CharField(max_length=10)
    
    def __str__(self):
        return '%s - %s' % (self.code, self.description)

# control user code scope to be created
class AllowedSegment(models.Model):    
    class Meta:
        unique_together = (('userType', 'scope'),)
        ordering = ['userType', 'scope']
    userType = models.CharField(max_length=1)
    scope = models.CharField(max_length=5)
    
    def __str__(self):
        return '%s' % (self.scope)

# constrain regular expression for checking nice user code 
class NiceWeidcodeRegex(models.Model):
    class Meta:
        unique_together = (('userType', 'regex'),)
        ordering = ['userType', 'regex']
    userType = models.CharField(max_length=1)
    regex = models.CharField(max_length=100)
    
    def __str__(self):
        return '%s' % (self.regex)

# nice user for user choosing during registering user account
class NiceWeidcode(models.Model):  
    weidcode = models.CharField(max_length=12)  
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    used = models.NullBooleanField(default=False)
    
# questions for reset password 
class SecurityQuestion(models.Model):    
    class Meta:
        unique_together = (('seq_num', 'language'),)
        ordering = ['seq_num', 'language']
    seq_num = models.IntegerField()
    description = models.CharField(max_length=100)
    language = models.CharField(max_length=10)
    
    def __str__(self):
        return '%s' % (self.description)


# meta enumerations only created/modified by the system administrator
class MetaType(models.Model):
    class Meta:
        unique_together = (('type', 'code', 'language'),)
        ordering = ['type', 'code', 'language']

    type = models.CharField(max_length=4)
    code = models.CharField(max_length=3)
    value = models.CharField(max_length=50)
    language = models.CharField(max_length=10)
    mark = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return '%s-%s-%s' % (self.type, self.code, self.value)