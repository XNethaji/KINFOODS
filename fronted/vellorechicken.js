document.addEventListener('DOMContentLoaded', function() {
    // Create food particles
    createFoodParticles();
    
    // Initialize theme
    initTheme();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize cart
    initCart();
    
    // Initialize menu filtering and sorting
    initMenuFilters();
    
    // Initialize quantity controls
    initQuantityControls();
});



// Initialize theme toggle
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark');
        
        if (document.body.classList.contains('dark')) {
            themeToggle.textContent = '☀️';
        } else {
            themeToggle.textContent = '🌙';
        }
    });
}

// Initialize navigation
function initNavigation() {
    const menuButton = document.getElementById('menuButton');
    const closeNav = document.getElementById('closeNav');
    const mainNav = document.getElementById('mainNav');
    
    menuButton.addEventListener('click', function() {
        mainNav.classList.add('active');
    });
    
    closeNav.addEventListener('click', function() {
        mainNav.classList.remove('active');
    });
    
    // Close nav when clicking outside
    document.addEventListener('click', function(event) {
        if (!mainNav.contains(event.target) && event.target !== menuButton) {
            mainNav.classList.remove('active');
        }
    });
}

// Initialize cart functionality
function initCart() {
    const cartButton = document.getElementById('cartButton');
    const closeCart = document.getElementById('closeCart');
    const cartPanel = document.getElementById('cartPanel');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.querySelector('.cart-count');
    
    let cart = [];
    
    cartButton.addEventListener('click', function() {
        cartPanel.classList.add('active');
    });
    
    closeCart.addEventListener('click', function() {
        cartPanel.classList.remove('active');
    });
    
    // Add to cart functionality
    const addButtons = document.querySelectorAll('.add-to-cart');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const itemName = menuItem.querySelector('h3').textContent;
            const itemPrice = parseInt(menuItem.dataset.price);
            const itemImage = menuItem.querySelector('img').src;
            const quantity = parseInt(menuItem.querySelector('.quantity').textContent);
            
            if (quantity > 0) {
                // Check if item already in cart
                const existingItem = cart.find(item => item.name === itemName);
                
                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    cart.push({
                        name: itemName,
                        price: itemPrice,
                        image: itemImage,
                        quantity: quantity
                    });
                }
                
                // Reset quantity
                menuItem.querySelector('.quantity').textContent = '0';
                
                // Update cart UI
                updateCart();
                
                // Show notification
                showNotification(`${itemName} added to cart!`);
            }
        });
    });
    
    // Update cart UI
    function updateCart() {
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update cart items
        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        } else {
            cartItems.innerHTML = '';
            
            cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">₹${item.price}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-index="${index}">−</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn plus" data-index="${index}">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" data-index="${index}">×</button>
                `;
                
                cartItems.appendChild(cartItem);
            });
            
            // Add event listeners to cart item buttons
            document.querySelectorAll('.cart-item .minus').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.dataset.index);
                    if (cart[index].quantity > 1) {
                        cart[index].quantity--;
                    } else {
                        cart.splice(index, 1);
                    }
                    updateCart();
                });
            });
            
            document.querySelectorAll('.cart-item .plus').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.dataset.index);
                    cart[index].quantity++;
                    updateCart();
                });
            });
            
            document.querySelectorAll('.cart-item-remove').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.dataset.index);
                    cart.splice(index, 1);
                    updateCart();
                });
            });
        }
        
        // Update cart total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `₹${total}`;
        
        // Add pulse animation to cart button if items in cart
        if (totalItems > 0) {
            cartButton.classList.add('pulse');
        } else {
            cartButton.classList.remove('pulse');
        }
    }
}

// Initialize menu filtering and sorting
function initMenuFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sortSelect');
    const searchInput = document.getElementById('searchInput');
    const menuItems = document.querySelectorAll('.menu-item');
    
    // Filter by type (veg/nonveg)
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            menuItems.forEach(item => {
                if (filter === 'all' || item.dataset.type === filter) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Sort menu items
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        const itemsArray = Array.from(menuItems);
        
        itemsArray.sort((a, b) => {
            if (sortValue === 'name') {
                return a.dataset.name.localeCompare(b.dataset.name);
            } else if (sortValue === 'price-low') {
                return parseInt(a.dataset.price) - parseInt(b.dataset.price);
            } else if (sortValue === 'price-high') {
                return parseInt(b.dataset.price) - parseInt(a.dataset.price);
            }
        });
        
        // Reorder items in DOM
        const menuList = document.getElementById('menuList');
        itemsArray.forEach(item => {
            menuList.appendChild(item);
        });
    });
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        menuItems.forEach(item => {
            const itemName = item.dataset.name.toLowerCase();
            
            if (itemName.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Initialize quantity controls
function initQuantityControls() {
    const minusButtons = document.querySelectorAll('.menu-item .minus');
    const plusButtons = document.querySelectorAll('.menu-item .plus');
    
    minusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const quantitySpan = this.nextElementSibling;
            let quantity = parseInt(quantitySpan.textContent);
            
            if (quantity > 0) {
                quantity--;
                quantitySpan.textContent = quantity;
            }
        });
    });
    
    plusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const quantitySpan = this.previousElementSibling;
            let quantity = parseInt(quantitySpan.textContent);
            
            quantity++;
            quantitySpan.textContent = quantity;
        });
    });
}

// Show notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.querySelector('.notification-content').textContent = message;
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
    // Initialize cart count
    updateCartCount();

    // Cart button click handler
    cartButton.addEventListener('click', function() {
        if (getTotalItems() > 0) {
            orderDetailsPanel.classList.add('active');
            renderOrderItems();
        } else {
            emptyMessage.classList.add('show');
        }
    });

    // Close panel button handler
    closePanel.addEventListener('click', function() {
        orderDetailsPanel.classList.remove('active');
    });

    // Close empty message handler
    closeMessage.addEventListener('click', function() {
        emptyMessage.classList.remove('show');
    });

    // Filter buttons functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            // Filter logic would go here in a real application
        });
    });
