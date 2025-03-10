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
    
    // Image preview functionality
    const itemImageInput = document.getElementById('itemImage');
    const imagePreview = document.getElementById('imagePreview');
    
    if (itemImageInput && imagePreview) {
        itemImageInput.addEventListener('change', function() {
            const file = this.files[0];
            
            if (file) {
                const reader = new FileReader();
                
                reader.addEventListener('load', function() {
                    imagePreview.innerHTML = `<img src="${this.result}" alt="Preview">`;
                });
                
                reader.readAsDataURL(file);
            } else {
                imagePreview.innerHTML = `
                    <div class="image-preview-placeholder">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <p>Upload image</p>
                    </div>
                `;
            }
        });
    }
    
    // Form submission
    const addItemForm = document.getElementById('addItemForm');
    const resetBtn = document.getElementById('resetBtn');
    
    if (addItemForm) {
        addItemForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const restaurant = document.getElementById('restaurant').value;
            const category = document.getElementById('category').value;
            const itemName = document.getElementById('itemName').value;
            const price = document.getElementById('price').value;
            const description = document.getElementById('description').value;
            const isVeg = document.querySelector('input[name="isVeg"]:checked').value;
            
            // In a real application, you would send this data to the server
            // For this demo, we'll just show an alert and redirect
            alert(`Item "${itemName}" added successfully!`);
            
            // Reset form
            addItemForm.reset();
            
            // Reset image preview
            imagePreview.innerHTML = `
                <div class="image-preview-placeholder">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Upload image</p>
                </div>
            `;
            
            // Redirect to show items page
            // window.location.href = 'show-items.html';
        });
    }
    
    // Reset button functionality
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            addItemForm.reset();
            
            // Reset image preview
            imagePreview.innerHTML = `
                <div class="image-preview-placeholder">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Upload image</p>
                </div>
            `;
        });
    }
});