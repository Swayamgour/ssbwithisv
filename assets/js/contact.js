document.getElementById("contactForm")?.addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent traditional form submission
    
    // Display loading indicator
    document.querySelector(".loading").style.display = "block";

    // Get form data
    const formData = {
        name: e.target.name.value,
        email: e.target.email.value,
        phone: e.target.phone.value,
        subject: e.target.subject.value,
        message: e.target.message.value
    };
     console.log(formData)
    try {
        const response = await fetch(`${config.backendBaseUrl}/api/send-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        // Hide loading indicator
        document.querySelector(".loading").style.display = "none";

        if (result.success) {
            // Display success message
            document.querySelector(".sent-message").style.display = "block";
        } else {
            // Display error message
            document.querySelector(".error-message").style.display = "block";
        }
    } catch (error) {
        console.error("Error:", error);

        // Hide loading indicator and display error message
        document.querySelector(".loading").style.display = "none";
        document.querySelector(".error-message").style.display = "block";
    }

    // Reset the form
    e.target.reset();
});