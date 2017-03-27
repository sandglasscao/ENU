from django.core.mail import send_mail
from django.shortcuts import render
from django.conf import settings

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger



def home(request):
  
    context = {
            
        }
    return render(request, 'home.html', context)
    
  
