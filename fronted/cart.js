document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements
    const cartButton = document.getElementById('cartButton');
    const orderDetailsPanel = document.getElementById('orderDetailsPanel');
    const closePanel = document.getElementById('closePanel');
    const orderItems = document.getElementById('orderItems');
    const emptyMessage = document.getElementById('emptyMessage');
    const closeMessage = document.querySelector('.close-message');
    const totalAmount = document.querySelector('.total-amount');
    const cartCount = document.querySelector('.cart-count');
    
    // Sample order data (in real app, this would come from a database/localStorage)
    let orderData = [
        {
            id: 1,
            name: "Paneer Butter Masala",
            price: 355,
            quantity: 3,
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-08%20231215-fUd7ndpf5r1Vae9sYeZxb5kYXVlldl.png"
        },
        {
            id: 2,
            name: "Chicken Biryani",
            price: 180,
            quantity: 2,
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-08%20141336-UapKlPwHrY48Guj67o8MWJLmVtipZ4.png"
        }
    ];

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

    // Render order items
    function renderOrderItems() {
        orderItems.innerHTML = '';
        const template = document.getElementById('orderItemTemplate');

        orderData.forEach((item, index) => {
            const orderItem = template.content.cloneNode(true);
            
            // Set item details
            orderItem.querySelector('.item-name').textContent = item.name;
            orderItem.querySelector('.item-price').textContent = `₹${item.price}`;
            orderItem.querySelector('.quantity').textContent = item.quantity;
            orderItem.querySelector('img').src = item.image;
            orderItem.querySelector('img').alt = item.name;

            // Add event listeners for quantity controls
            const quantityControls = orderItem.querySelector('.quantity-control');
            const quantitySpan = quantityControls.querySelector('.quantity');
            const minusBtn = quantityControls.querySelector('.minus');
            const plusBtn = quantityControls.querySelector('.plus');
            const removeBtn = orderItem.querySelector('.remove-item');

            minusBtn.addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity--;
                    quantitySpan.textContent = item.quantity;
                    updateTotalAmount();
                    updateCartCount();
                }
            });

            plusBtn.addEventListener('click', () => {
                item.quantity++;
                quantitySpan.textContent = item.quantity;
                updateTotalAmount();
                updateCartCount();
            });

            removeBtn.addEventListener('click', () => {
                orderData = orderData.filter(orderItem => orderItem.id !== item.id);
                renderOrderItems();
                updateTotalAmount();
                updateCartCount();
                
                if (orderData.length === 0) {
                    orderDetailsPanel.classList.remove('active');
                }
            });

            orderItems.appendChild(orderItem);
        });

        updateTotalAmount();
    }

    // Update total amount
    function updateTotalAmount() {
        const total = orderData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalAmount.textContent = `₹${total}`;
    }

    // Get total number of items
    function getTotalItems() {
        return orderData.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Update cart count
    function updateCartCount() {
        const totalItems = getTotalItems();
        cartCount.textContent = totalItems;
        
        if (totalItems === 0) {
            cartButton.classList.remove('pulse');
        } else {
            cartButton.classList.add('pulse');
        }
    }

    // Checkout button handler
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.addEventListener('click', function() {
        // Add checkout logic here
        alert('Proceeding to checkout...');
    });

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark');
        if (document.body.classList.contains('dark')) {
            themeToggle.textContent = '☀️';
        } else {
            themeToggle.textContent = '🌙';
        }
    });
});