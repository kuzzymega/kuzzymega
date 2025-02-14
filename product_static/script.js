document.addEventListener("DOMContentLoaded", function () {
    // Handle form submission
    document.getElementById("surveyForm").addEventListener("submit", function (event) {
        event.preventDefault();

        let formData = new FormData(event.target);
        let surveyData = {};

        formData.forEach((value, key) => {
            surveyData[key] = value;
        });

        console.log("Survey Response:", surveyData);

        // Store message in localStorage
        localStorage.setItem("surveyMessage", "Thank you for your feedback!");

        // Redirect to the thank-you page
        window.location.href = "/payment/"; // Adjust to your actual page
    });

    // Display the message on the thank-you page
    let message = localStorage.getItem("surveyMessage");
    if (message) {
        let notificationDiv = document.createElement("div");
        notificationDiv.textContent = message;
        notificationDiv.style.background = "green";
        notificationDiv.style.color = "white";
        notificationDiv.style.padding = "10px";
        notificationDiv.style.textAlign = "center";
        document.body.prepend(notificationDiv);

        // Clear the message after displaying
        localStorage.removeItem("surveyMessage");
    }
});