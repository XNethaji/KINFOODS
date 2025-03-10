document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }
    
    // Set admin name
    const adminNameElement = document.getElementById('admin-name');
    if (adminNameElement) {
        adminNameElement.textContent = localStorage.getItem('adminName') || 'Admin User';
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear login status
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('adminName');
            
            // Redirect to login page
            window.location.href = 'login.html';
        });
    }
    
    // Search functionality
    const searchBox = document.querySelector('.search-box');
    const tableRows = document.querySelectorAll('tbody tr');
    
    if (searchBox) {
        searchBox.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            tableRows.forEach(row => {
                const orderId = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
                const customer = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                const items = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
                
                if (orderId.includes(searchTerm) || customer.includes(searchTerm) || items.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // Status filter functionality
    const statusFilter = document.querySelector('.table-actions select');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            const selectedStatus = this.value.toLowerCase();
            
            if (selectedStatus === 'all') {
                tableRows.forEach(row => {
                    row.style.display = '';
                });
                return;
            }
            
            tableRows.forEach(row => {
                const statusSelect = row.querySelector('td:nth-child(5) select');
                const currentStatus = statusSelect.value.toLowerCase();
                
                if (currentStatus === selectedStatus) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // Status change functionality
    const statusSelects = document.querySelectorAll('td select');
    
    statusSelects.forEach(select => {
        select.addEventListener('change', function() {
            const row = this.closest('tr');
            const orderId = row.querySelector('td:nth-child(1)').textContent;
            const newStatus = this.options[this.selectedIndex].text;
            
            // In a real application, you would send this update to the server
            alert(`Order ${orderId} status updated to "${newStatus}"`);
        });
    });
    
    // View and Delete buttons functionality
    const viewButtons = document.querySelectorAll('.view-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const orderId = row.querySelector('td:nth-child(1)').textContent;
            
            // In a real application, you would redirect to a detailed view page
            alert(`View details for order: ${orderId}`);
        });
    });
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const orderId = row.querySelector('td:nth-child(1)').textContent;
            
            if (confirm(`Are you sure you want to delete order "${orderId}"?`)) {
                // In a real application, you would send a delete request to the server
                row.remove();
                alert(`Order "${orderId}" deleted successfully!`);
            }
        });
    });
});