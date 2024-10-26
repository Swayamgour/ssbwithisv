// Fetch leads from the API and display them in the table
document.addEventListener("DOMContentLoaded", () => {
    fetch(`${config.backendBaseUrl}/api/allLeads`)
      .then(response => response.json())
      .then(data => {
        const tableBody = document.getElementById("leadsTableBody");
  
        data.forEach(lead => {
          const row = document.createElement("tr");
  
          const timeCell = document.createElement("td");
          timeCell.textContent = lead.time;
          row.appendChild(timeCell);
  
          const dateCell = document.createElement("td");
          const formattedDate = new Date(lead.date).toLocaleDateString("en-GB");
          dateCell.textContent = formattedDate;
          row.appendChild(dateCell);
  
          const nameCell = document.createElement("td");
          nameCell.textContent = lead.name;
          row.appendChild(nameCell);
  
          const emailCell = document.createElement("td");
          emailCell.textContent = lead.email;
          row.appendChild(emailCell);
  
          const phoneCell = document.createElement("td");
          phoneCell.textContent = lead.phoneNumber;
          row.appendChild(phoneCell);
  
          tableBody.appendChild(row);
        });
      })
      .catch(error => console.error('Error fetching leads:', error));
  });
  
  document.getElementById("excelDownloadBtn").addEventListener("click", () => {
    fetch(`${config.backendBaseUrl}/api/allLeads`)
      .then(response => response.json())
      .then(data => {
        // Map the data to only include the specified fields
        const filteredData = data.map(lead => ({
          time: lead.time,
          date: lead.date,
          name: lead.name,
          email: lead.email,
          phoneNumber: lead.phoneNumber // Ensure this matches your data structure
        }));
  
        // Create a new workbook and a worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(filteredData);
  
        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, "LeadsData");
  
        // Create and trigger the download
        XLSX.writeFile(wb, "LeadsData.xlsx");
      })
      .catch(error => console.error("Error fetching leads for Excel download:", error));
  });
  
