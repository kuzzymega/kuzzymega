from django.urls import path
from . import views 

urlpatterns = [
    path('', views.index, name='index'),
    path('payment/',views.payment, name='payment'),
    path('cardpayment/',views.cardpayment, name='cardpayment'),
    path('api/process-payment/', views.process_payment, name='process_payment')
]