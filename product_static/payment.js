document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("paymentForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form submission to the server

        // Redirect to cardpayment.html
        window.location.href = "/cardpayment/";
    });
});