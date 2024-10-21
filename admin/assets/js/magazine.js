document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const tableBody = document.getElementById("magazineTableBody");
    const uploadPdfForm = document.getElementById("uploadPdfForm");

    // Fetch all Magazine PDFs
    const fetchMagazinePdfs = async () => {
        const response = await fetch(`${config.backendBaseUrl}/api/allMagazinePdfs`, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (response.ok) {
            tableBody.innerHTML = "";
            data.forEach((pdf) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${pdf.pdfTitle}</td>
                    <td><img src="${config.backendBaseUrl}/${pdf.magazineFrontImage}" alt="Cover Image" style="width:100px;"/></td>
                    <td><a href="${config.backendBaseUrl}/${pdf.pdfFilePath}" target="_blank">View PDF</a></td>
                    <td>
                        <button onclick="editMagazinePdf('${pdf._id}', '${pdf.pdfTitle}')">Edit</button>
                        <button onclick="deleteMagazinePdf('${pdf._id}')">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            alert("Failed to fetch magazine PDFs");
        }
    };

// Show overlay spinner
function showSpinner() {
    document.getElementById("overlay").style.display = "block";
}

// Hide overlay spinner
function hideSpinner() {
    document.getElementById("overlay").style.display = "none";
}

// Upload new Magazine PDF and Cover Image
uploadPdfForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    showSpinner(); // Show spinner when the form is submitted

    const formData = new FormData();
    formData.append("pdfTitle", document.getElementById("pdfTitle").value);
    formData.append("magazinePdf", document.getElementById("magazinePdf").files[0]);
    formData.append("magazineFrontImage", document.getElementById("magazineImage").files[0]);

    try {
        const response = await fetch(`${config.backendBaseUrl}/api/addMagazinePdf`, { mode: 'no-cors'}, {
            method: "POST",
            headers: {
                'token': `Bearer ${token}`
            },
            body: formData,
        });

        const responseText = await response.text();
        // console.log("Response Text: ", responseText);

        let result;
        try {
            result = JSON.parse(responseText);
        } catch (err) {
            console.error("Failed to parse response as JSON", err);
            throw new Error("Received unexpected response format");
        }

        if (response.ok) {
            alert("PDF and Image uploaded successfully!");
            fetchMagazinePdfs(); // Refresh entries after upload
            uploadPdfForm.reset(); // Clear form
        } else {
            alert(result.message || "Failed to upload PDF and Image");
        }
    } catch (error) {
        alert("An error occurred while uploading the PDF and Image");
        console.error("Error of Upload:", error);
    } finally {
        hideSpinner(); // Hide the spinner after the process completes
    }
});

// Edit Magazine PDF and Image
window.editMagazinePdf = (id, currentTitle) => {
    document.getElementById("newTitle").value = currentTitle;

    const modal = document.getElementById("editMagazineModal");
    modal.style.display = "block";

    document.querySelector(".close-button").onclick = () => {
        modal.style.display = "none";
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    document.getElementById("editMagazineForm").onsubmit = async (event) => {
        event.preventDefault();
        showSpinner(); // Show spinner when update form is submitted

        const newTitle = document.getElementById("newTitle").value;
        const selectedFile = document.getElementById("newmagazinePdf").files[0];
        const selectedImage = document.getElementById("newmagazineImage").files[0];

        const formData = new FormData();
        formData.append("pdfTitle", newTitle);
        if (selectedFile) formData.append("magazinePdf", selectedFile);
        if (selectedImage) formData.append("magazineFrontImage", selectedImage);

        try {
            const response = await fetch(`${config.backendBaseUrl}/api/updateMagazinePdf/${id}`, {
                method: "PUT",
                headers: {
                    'token': `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                alert("Magazine updated successfully!");
                fetchMagazinePdfs(); // Refresh list
                modal.style.display = "none"; // Close modal
            } else {
                alert(result.message || "Failed to update Magazine");
            }
        } catch (error) {
            alert("An error occurred while updating the magazine");
            console.error("Error:", error);
        } finally {
            hideSpinner(); // Hide the spinner after the process completes
        }
    };
};


    

    // Delete Magazine PDF
    window.deleteMagazinePdf = async (id) => {
        const confirmDelete = confirm("Are you sure you want to delete this PDF?");

        if (!confirmDelete) return;

        const response = await fetch(`${config.backendBaseUrl}/api/deleteMagazinePdf/${id}`, {
            method: "DELETE",
            headers: {
                'token': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (response.ok) {
            alert("PDF deleted successfully!");
            fetchMagazinePdfs(); // Refresh entries after deletion
        } else {
            alert(result.message || "Failed to delete PDF");
        }
    };

    // Fetch PDFs on page load
    fetchMagazinePdfs();
});
