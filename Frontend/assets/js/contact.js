// Function to send OTP
function sendOTP(phoneNumber) {
    fetch('http://localhost:3000/send-otp', {  // Backend URL to send OTP
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: phoneNumber }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('OTP sent to your phone!');
            document.getElementById('otpForm').style.display = 'block'; // Show OTP input
        } else {
            alert('Failed to send OTP');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to verify OTP
function verifyOTP(phoneNumber, otp) {
    fetch('http://localhost:3000/verify-otp', {  // Backend URL to verify OTP
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp: otp, phoneNumber: phoneNumber }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Phone number verified successfully!');
        } else {
            alert('Incorrect OTP. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Event listener for sending OTP
const sendOtpButton = document.getElementById('sendOtpButton');
if (sendOtpButton) {
    sendOtpButton.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent form submission from refreshing the page
        console.log('Send OTP button clicked'); // Logging for debugging

        const phoneNumber = document.getElementById('phoneNumber').value;
        if (phoneNumber) {
            sendOTP(phoneNumber); 
        } else {
            alert('Please enter a valid phone number');
        }
    });
}

// Event listener for verifying OTP
const verifyOtpButton = document.getElementById('verifyOtpButton');
if (verifyOtpButton) {
    verifyOtpButton.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent form submission from refreshing the page
        console.log('Verify OTP button clicked'); // Logging for debugging

        const phoneNumber = document.getElementById('phoneNumber').value;
        const otp = document.getElementById('otp').value;
        if (otp) {
            verifyOTP(phoneNumber, otp); // Call function to verify OTP
        } else {
            alert('Please enter the OTP sent to your phone');
        }
    });
}
