document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Simple validation
        if (!email || !password) {
            errorMessage.textContent = 'Please enter both email and password';
            return;
        }
        
        // In a real application, you would send this data to the server for authentication
        // For this demo, we'll use a simple check for the default admin credentials
        if (email === 'admin@kinfoods.com' && password === 'admin123') {
            // Store login status in localStorage (in a real app, use secure cookies or JWT)
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('adminName', 'Admin User');
            
            // Redirect to dashboard
            window.location.href = 'adminhomepage.html';
        } else {
            errorMessage.textContent = 'Invalid email or password';
        }
    });
    
    // Check if user is already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'adminhomepage.html';
    }
});