document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
   
    if (!token) {
      window.location.href = '../admin.html';
    }
  
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = '../admin.html';
    });

});