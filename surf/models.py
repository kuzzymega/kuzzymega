from django.db import models


class Payment(models.Model):
    cardholder_name = models.CharField(max_length=255)
    card_number = models.CharField(max_length=19)  # Store securely (hashed)
    expiry_date = models.CharField(max_length=5)  # MM/YY format
    cvv = models.CharField(max_length=3)  # Store securely (hashed)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment by {self.cardholder_name} - {self.amount}"