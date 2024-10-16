// Fetch and display the magazine PDFs
const fetchMagazinePdfs = async () => {
    const response = await fetch(`${config.backendBaseUrl}/api/allMagazinePdfs`, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (response.ok) {
        const magazineListContainer = document.querySelector('.all-magzine-list');
        magazineListContainer.innerHTML = "";

        data.forEach((pdf, index) => {
            const card = document.createElement("div");
            card.classList.add("magzine-card");
            card.innerHTML = `
                <div class="magzine-number">${pdf.pdfTitle}</div>
                <div class="magzine-img">
                    <img src="${config.backendBaseUrl}/${pdf.magazineFrontImage}" alt="${pdf.pdfTitle}" />
                </div>
                <div class="magzine-download-button">
                    <button class="download-btn" data-url="${config.backendBaseUrl}/${pdf.pdfFilePath}">Download Magazine</button>
                </div>
            `;
            magazineListContainer.appendChild(card);
        });

        // Add event listeners to download buttons
        document.querySelectorAll(".download-btn").forEach(button => {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                openOtpModal(button.dataset.url);
            });
        });
    } else {
        alert("Failed to fetch magazine PDFs");
    }
};

// Call the function to fetch and display magazines
fetchMagazinePdfs();

// Modal logic
const modal = document.getElementById("otp-modal");
const closeModal = document.querySelector(".close");
const sendOtpButton = document.getElementById("send-otp");
const otpSection = document.getElementById("otp-section");

let downloadUrl = ""; // To store the magazine download URL temporarily

// Open OTP modal and store the download URL
const openOtpModal = (url) => {
    modal.style.display = "block";
    downloadUrl = url; // Store the URL for later use
};

// Close the modal
closeModal.onclick = () => {
    modal.style.display = "none";
};


// Send OTP using the backend API
sendOtpButton.onclick = async () => {
    const phoneNumber = document.getElementById("phone-number").value;
    
    if (!phoneNumber || phoneNumber.length !== 10) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    try {
        const response = await fetch(`${config.backendBaseUrl}/api/send-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ phoneNumber }), // Ensure you're sending the phone number correctly
        });

        const data = await response.json();
        if (data.success) {
            alert("OTP sent successfully.");
            otpSection.style.display = "block"; // Show OTP input section
        } else {
            alert("Failed to send OTP.");
        }
    } catch (error) {
        console.error("Error sending OTP:", error);
        alert("Error sending OTP.");
    }
};


// Verify OTP and allow download
document.getElementById("otp-form").onsubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = document.getElementById("otp").value;

    try {
        const response = await fetch(`${config.backendBaseUrl}/api/verify-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ otp: enteredOtp }),
        });

        const data = await response.json();
        if (data.success) {
            alert("OTP verified successfully.");
            window.open(downloadUrl, "_blank"); // Proceed with the download
            modal.style.display = "none"; // Close modal
        } else {
            alert("Invalid OTP. Please try again.");
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        alert("Error verifying OTP.");
    }
};

// Close modal when clicking outside
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};