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
                    <td><img src="../../Backend/${pdf.magazineFrontImage}" alt="Cover Image" style="width:100px;"/></td>
                    <td><a href="../../Backend/${pdf.pdfFilePath}" target="_blank">View PDF</a></td>
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

    // Upload new Magazine PDF and Cover Image
    uploadPdfForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("pdfTitle", document.getElementById("pdfTitle").value);
        formData.append("magazinePdf", document.getElementById("magazinePdf").files[0]);
        formData.append("magazineFrontImage", document.getElementById("magazineImage").files[0]);

        try {
            const response = await fetch(`${config.backendBaseUrl}/api/addMagazinePdf`, {
                method: "POST",
                headers: {
                    'token': `Bearer ${token}` // No need for 'Content-Type'
                },
                body: formData,
            });

            const responseText = await response.text();
            console.log("Response Text: ", responseText);

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
            console.error("Error:", error);
        }
    });

    // Edit Magazine PDF and Image
   // Function to open the edit modal
window.editMagazinePdf = (id, currentTitle) => {
    // Populate the form fields with current values
    document.getElementById("newTitle").value = currentTitle;

    // Show the modal
    const modal = document.getElementById("editMagazineModal");
    modal.style.display = "block";

    // Close the modal when the user clicks on <span> (x)
    document.querySelector(".close-button").onclick = () => {
        modal.style.display = "none";
    };

    // Close the modal when the user clicks anywhere outside of the modal
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    // Handle form submission
    document.getElementById("editMagazineForm").onsubmit = async (event) => {
        event.preventDefault(); // Prevent form from submitting normally

        const newTitle = document.getElementById("newTitle").value;
        const selectedFile = document.getElementById("newmagazinePdf").files[0];
        const selectedImage = document.getElementById("newmagazineImage").files[0];

        // Create FormData object
        const formData = new FormData();
        formData.append("pdfTitle", newTitle); // Add the new title
        if (selectedFile) {
            formData.append("magazinePdf", selectedFile); // Add new PDF file
        }
        if (selectedImage) {
            formData.append("magazineFrontImage", selectedImage); // Add new Image file
        }

        try {
            // Send the updated data to the server
            const response = await fetch(`${config.backendBaseUrl}/api/updateMagazinePdf/${id}`, {
                method: "PUT",
                headers: {
                    'token': `Bearer ${token}`, // Token for authorization
                },
                body: formData, // Send the form data
            });

            const result = await response.json();

            if (response.ok) {
                alert("Magazine updated successfully!");
                fetchMagazinePdfs(); // Refresh the list after update
                modal.style.display = "none"; // Close the modal
            } else {
                alert(result.message || "Failed to update Magazine");
            }
        } catch (error) {
            alert("An error occurred while updating the magazine");
            console.error("Error:", error);
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
