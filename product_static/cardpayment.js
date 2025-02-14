document.getElementById("paymentForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let cardholderName = document.getElementById("cardholderName").value.trim();
    let cardNumber = document.getElementById("cardNumber").value.replace(/\s/g, ""); // Remove spaces
    let expiryDate = document.getElementById("expiryDate").value.trim();
    let cvv = document.getElementById("cvv").value.trim();
    let amount = document.getElementById("amount").value.trim();

    if (validateCardDetails(cardNumber, expiryDate, cvv, amount)) {
        document.getElementById("paymentMessage").textContent = "Processing payment...";

        fetch("/api/process-payment/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                cardholder_name: cardholderName,
                card_number: cardNumber,
                expiry_date: expiryDate,
                cvv: cvv,
                amount: amount
            })
        })
        .then(response => response.json().then(data => ({ status: response.status, body: data })))  // Capture response
        .then(({ status, body }) => {
            console.log("Server Response:", body);  // Log for debugging

            if (status === 200) {
                document.getElementById("paymentMessage").textContent = body.success
                    ? "Payment Successful! Redirecting to shop..."
                    : "Payment Failed! Redirecting to shop...";
                document.getElementById("paymentMessage").style.color = body.success ? "green" : "red";
            } else {
                document.getElementById("paymentMessage").textContent = "Error: " + (body.error || "Unknown error");
                document.getElementById("paymentMessage").style.color = "red";
            }

            // Redirect to shop after 3 seconds, regardless of payment status
            setTimeout(() => {
                window.location.href = "https://carddelivery.com"; // Change to your shop URL
            }, 3000);
        })
        .catch(error => {
            console.error("Network Error:", error);
            document.getElementById("paymentMessage").textContent = "Server Error! Redirecting to shop...";
            document.getElementById("paymentMessage").style.color = "red";

            // Redirect to shop after 3 seconds, even if there's a network error
            setTimeout(() => {
                window.location.href = "https://yourshop.com";
            }, 3000);
        });

    } else {
        document.getElementById("paymentMessage").textContent = "Invalid card details!";
        document.getElementById("paymentMessage").style.color = "red";
    }
});

// Validate card details function
function validateCardDetails(cardNumber, expiryDate, cvv, amount) {
    let cleanedCardNumber = cardNumber.replace(/\s/g, "");

    let cardRegex = /^[0-9]{16,19}$/;  // Card number must be 16-19 digits
    let expiryRegex = /^(0[1-9]|1[0-2])\/([2-9][0-9])$/;  // MM/YY format, year 20-99
    let cvvRegex = /^[0-9]{3,4}$/;  // CVV can be 3 or 4 digits
    let amountRegex = /^[1-9][0-9]*(\.[0-9]{1,2})?$/;  // Allows decimals (e.g., 10.50)

    return (
        cardRegex.test(cleanedCardNumber) &&
        expiryRegex.test(expiryDate) &&
        cvvRegex.test(cvv) &&
        amountRegex.test(amount)
    );
}

// Format expiration date as user types
function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length >= 2) {
        input.value = value.substring(0, 2) + "/" + value.substring(2, 4);
    } else {
        input.value = value;
    }
}