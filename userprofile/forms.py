from django import forms
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext, ugettext_lazy as _
from django.contrib.auth.models import User


class RegistrationForm(forms.ModelForm):

    TYPES_CHOICES = (
        (1,'Individual'),
        (2,'Enterprise'),
        (3,'Other')
        )
    COUNTRY_CHOICES = (
        (86,'86-China'),
        )

    PROVINCE_CHOICES = (
        (0,'Beijing'),
        (1,'Shang Hai')
        )
        
    CITY_CHOICES = ( 
        (0,'Beijing'),
        )    
        
    country = forms.ChoiceField(label=_("Country"),
        # widget=forms.TextInput,
        choices = COUNTRY_CHOICES
        # help_text=_("Enter address")
        )
    province = forms.ChoiceField(label=_("Province"),
        # widget=forms.TextInput,
        choices = PROVINCE_CHOICES
        # help_text=_("Enter address")
        ) 
    city = forms.ChoiceField(label=_("City"),
        # widget=forms.TextInput,
        choices = CITY_CHOICES
        # help_text=_("Enter address")
        )   
    district = forms.CharField(label=_("District"),
        widget=forms.TextInput,
        # help_text=_("Enter address")
        )
    
    address = forms.CharField(label=_("Address"),
        widget=forms.TextInput,
        # help_text=_("Enter address")
        )

        
    postcode = forms.CharField(label=_("Postcode"),
        widget=forms.TextInput,
        # help_text=_("Enter address")
        )  
        
    usertype = forms.ChoiceField(
        label = _("User Type"),
        choices=TYPES_CHOICES
        )
        
    class Meta:
        model = User
        fields = ("first_name",)
        # exclude = ('username',)
        labels = {
            'first_name': _('Cell'),
        }
        # help_texts = {
        #     'username': _(''),
        # }
        # error_messages = {
        #     'username': {
        #         'max_length': _("This writer's name is too long."),
        #     },
        # }
        # widgets = {'username': forms.HiddenInput()}


    # def save(self, commit=True):
    #     user = super(RegistrationForm, self).save(commit=False)
    #     user.set_username('100000000001')
    #     user.set_password('')
    #     if commit:
    #         user.save()
    #     return user
