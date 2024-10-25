// const {disconnect}=require("process");

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
               
                    <div class="download-btn magzine-download-button" data-url="${config.backendBaseUrl}/${pdf.pdfFilePath}">Download Magazine</div>
              
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
const verifyOtpButton = document.getElementById("verify-otp");
const retryOtpButtonSms = document.querySelector(".resend-via-sms");
const retryOtpButtonWp = document.querySelector(".resend-via-wp");
const otpErrorMsg=document.querySelector('.otp-error-message')
const retrySec = document.querySelector('.retry-sec');
const afterRetryClicked= document.querySelector('.after-retry-clicked')

let downloadUrl = ""; // To store the magazine download URL temporarily

// Open OTP modal and store the download URL
const openOtpModal = (url) => {
    modal.style.display = "flex";
    downloadUrl = url; // Store the URL for later use
    document.querySelector('.sent-otp-div').style.display='flex'
       document.querySelector('.sent-otp-only-div').style.display='flex'
};

// Close the modal
closeModal.onclick = () => {
    modal.style.display = "none";
    otpSection.style.display='none'
  const allInput=  document.querySelectorAll('input');
  allInput.forEach(input=>{
    input.value=''
  })

};

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for email validation
    return emailRegex.test(email);
}

// Initialize MSG91 OTP widget
const widgetId = "346a776c5749333834363239";
const tokenAuth = "432663TzWGndK2N7sR6710de92P1";

const configuration = {
    widgetId: widgetId,
    tokenAuth: tokenAuth,
    exposeMethods: true,
    success: (data) => {
        console.log('Success response:', data);
    },
    failure: (error) => {
        console.log('Failure reason:', error);
    }
};

// Send OTP using MSG91
sendOtpButton.onclick = () => {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phoneNumber = document.getElementById("phone-number").value;
    let formattedPhoneNumber = phoneNumber;
    // Validate inputs
    if (!name || !email || !phoneNumber) {
        // alert("Please fill in all fields.");
        otpErrorMsg.innerHTML=`Please fill in all fields.`
        return;
    }
    if (!isValidEmail(email)) {
        // alert("Please enter a valid email address.");
          otpErrorMsg.innerHTML=`Please enter a valid email address.`
        return;
    }
    if (!phoneNumber || phoneNumber.length !== 10) {
        // alert("Please enter a valid 10-digit phone number.");
          otpErrorMsg.innerHTML=`Please enter a valid 10-digit phone number.`
        return;
    }
    formattedPhoneNumber = '91' + phoneNumber;
     otpErrorMsg.innerHTML=``
    window.sendOtp(formattedPhoneNumber, 
        (data) => {
           
            const sentotpDiv=document.querySelector('.sent-otp-div')
            const headingPhoneSent=document.querySelector(".heading-phone-number-sent")
            const sentOtpOnlyDiv = document.querySelector(".sent-otp-only-div")
            if(sentotpDiv && headingPhoneSent)
            {
            sentotpDiv.style.display = "none";
            headingPhoneSent.innerHTML=`OTP has Sent to <span class="phoneNumberDynamic" >${phoneNumber}</span>`
            sentOtpOnlyDiv.style.display="none"
            }
            console.log('OTP sent successfully:', data);
            otpSection.style.display = "flex"; 
            retrySeconds()
        },
        (error) => {
            console.error('Error sending OTP:', error);
            otpErrorMsg.innerHTML=`Failed to send OTP. Please try again.`
        }
    );
};

// Verify OTP
document.getElementById("otp-form").onsubmit = (e) => {
    e.preventDefault();
    const enteredOtp = document.getElementById("otp").value;
        otpErrorMsg.innerHTML=``
    window.verifyOtp(enteredOtp, 
        (data) => {
            console.log('OTP verified:', data.message);
        
            // Send access token to backend for verification
            const accessToken = data.message;  // Assuming data.message contains JWT token
            fetch(`${config.backendBaseUrl}/api/verifyOtpWithAccessToken`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ accessToken: accessToken }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Access token verified:', data);
                alert('OTP verified and access token confirmed!');
                console.log("url=",downloadUrl)
                modal.style.display = "none";
                window.open(downloadUrl, "_blank"); // Download magazine
                modal.style.display = "none"; // Close modal
                const allInput=  document.querySelectorAll('input');
                allInput.forEach(input=>{
                  input.value=''
                })
            })
            .catch(error => {
                console.error('Error verifying access token:', error);
             otpErrorMsg.innerHTML=`Error verifying access token.`
            });
        },
        (error) => {
            console.log('OTP verification failed:', error);
            otpErrorMsg.innerHTML=`Invalid OTP. Please try again.`
            // alert('Invalid OTP. Please try again.');
        }
    );
};

// Retry OTP
retryOtpButtonSms.onclick = () => {
   document.getElementById("otp").value=''
    const phoneNumber = document.getElementById("phone-number").value;
    otpErrorMsg.innerHTML=``
    window.retryOtp(11, 
        (data) => {
            afterRetryClicked.style.display='none'
            retrySeconds()
             otpErrorMsg.innerHTML=``
            console.log('OTP resent successfully:', data);
            // alert('OTP resent. Please check your phone.');
            const headingPhoneSent=document.querySelector(".heading-phone-number-sent")
           headingPhoneSent.innerHTML=`OTP has been resent to <span class="Whatsapp-color"> SMS:</span> <span class="phoneNumberDynamic" > ${phoneNumber} </span>`
        },
        (error) => {
            console.error('Error resending OTP:', error);
              otpErrorMsg.innerHTML=`${error.message}`
            // alert('Error resending OTP.');
        }
    );
};

retryOtpButtonWp.onclick = () => {
    document.getElementById("otp").value=''
    const phoneNumber = document.getElementById("phone-number").value;
    otpErrorMsg.innerHTML=``
    window.retryOtp(12, 
        (data) => {
               afterRetryClicked.style.display='none'
            retrySeconds()
             otpErrorMsg.innerHTML=``
            console.log('OTP resent successfully:', data);
            // alert('OTP resent. Please check your phone.');
            const headingPhoneSent=document.querySelector(".heading-phone-number-sent")
           headingPhoneSent.innerHTML=`OTP has been resent to <span class="Whatsapp-color"> WhatsApp:</span> <span class="phoneNumberDynamic" > ${phoneNumber} </span>`
        },
        (error) => {
            console.error('Error resending OTP:', error);
              otpErrorMsg.innerHTML=`${error.message}`
            // alert('Error resending OTP.');
        }
    );
};

// Close modal when clicking outside
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

function retrySeconds() {
    let seconds = 10; // Declare and initialize seconds variable
  retrySec.style.display='block'

    if (retrySec) {
        const interval = setInterval(() => {
            retrySec.innerHTML = `Retry in <span class="retry-seconds-val">${seconds}</span> Seconds`;

            seconds--; // Decrement seconds by 1

            if (seconds < 0) {
                clearInterval(interval); // Clear the interval
                retrySec.style.display = 'none'; // Hide the element
               afterRetryClicked.style.display='flex'
            }
        }, 1000); 
    }
}