// Initialize the page with animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create food particles for the background
    createFoodParticles();
    
    // Animate the heading text
    animateHeadingText();
    
    // Initialize scroll animations for food and restaurant cards
    initScrollAnimations();
    
    // Fix popup display and animation
    fixPopupAnimation();
    
    // Add hover effects to cards
    addCardHoverEffects();
});

// Create floating food particles in the background
function createFoodParticles() {
    const foodIcons = ['🍕', '🍔', '🍟', '🍗', '🍖', '🌮', '🌯', '🥪', '🍱', '🍛', '🍜', '🍝', '🍲', '🥘', '🥗', '🍚'];
    const container = document.querySelector('.food-particles');
    
    // Create 20 food particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('food-particle');
        
        // Random food icon
        const randomIcon = foodIcons[Math.floor(Math.random() * foodIcons.length)];
        particle.textContent = randomIcon;
        
        // Random position
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        
        // Random size
        const size = 20 + Math.random() * 30;
        particle.style.fontSize = `${size}px`;
        
        // Random animation duration
        const duration = 15 + Math.random() * 20;
        particle.style.animation = `float ${duration}s linear infinite`;
        
        // Random delay
        particle.style.animationDelay = `${Math.random() * 20}s`;
        
        container.appendChild(particle);
    }
}

// Animate the main heading text with a typewriter effect
function animateHeadingText() {
    const headingText = document.querySelector('.animated-text');
    const text = headingText.textContent;
    headingText.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            headingText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    typeWriter();
}

// Initialize scroll animations for food and restaurant cards
function initScrollAnimations() {
    const foodsContainer = document.querySelector('.foods');
    const restaurantsContainer = document.querySelector('.restaurants');
    
    // Add scroll buttons for horizontal scrolling
    addScrollButtons(foodsContainer, 'Popular Foods');
    addScrollButtons(restaurantsContainer, 'Top Restaurants');
    
    // Animate cards on scroll
    animateOnScroll();
}

// Add scroll buttons for horizontal scrolling
function addScrollButtons(container, sectionName) {
    const parentSection = container.parentElement;
    const sectionTitle = parentSection.querySelector(`h3:contains('${sectionName}')`);
    
    const scrollLeftBtn = document.createElement('button');
    scrollLeftBtn.classList.add('scroll-btn', 'scroll-left');
    scrollLeftBtn.innerHTML = '&lt;';
    scrollLeftBtn.addEventListener('click', () => {
        container.scrollBy({ left: -300, behavior: 'smooth' });
    });
    
    const scrollRightBtn = document.createElement('button');
    scrollRightBtn.classList.add('scroll-btn', 'scroll-right');
    scrollRightBtn.innerHTML = '&gt;';
    scrollRightBtn.addEventListener('click', () => {
        container.scrollBy({ left: 300, behavior: 'smooth' });
    });
    
    parentSection.style.position = 'relative';
    parentSection.appendChild(scrollLeftBtn);
    parentSection.appendChild(scrollRightBtn);
    
    // Add CSS for scroll buttons
    const style = document.createElement('style');
    style.textContent = `
        .scroll-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.8);
            border: none;
            font-size: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 10;
            transition: all 0.3s ease;
        }
        .scroll-btn:hover {
            background: white;
            transform: translateY(-50%) scale(1.1);
        }
        .scroll-left {
            left: 10px;
        }
        .scroll-right {
            right: 10px;
        }
    `;
    document.head.appendChild(style);
}

// Fix for querySelector with text content
Document.prototype.querySelector = function(selector) {
    if (selector.includes(':contains(')) {
        const text = selector.match(/:contains$$'(.+?)'$$/)[1];
        const elements = Array.from(this.querySelectorAll('*'));
        return elements.find(el => el.textContent.includes(text));
    }
    return Document.prototype.querySelector.call(this, selector);
};

// Animate elements when they come into view
function animateOnScroll() {
    const cards = document.querySelectorAll('.food-card, .restaurant-card, .category-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

// Fix popup animation
function fixPopupAnimation() {
    // Override the original popup functions
    window.openPopup = function(id) {
        const popup = document.getElementById(id);
        popup.style.display = 'block';
        
        // Force reflow
        void popup.offsetWidth;
        
        popup.classList.add('active');
    };
    
    window.closePopup = function(id) {
        const popup = document.getElementById(id);
        popup.classList.remove('active');
        
        // Wait for animation to complete before hiding
        setTimeout(() => {
            popup.style.display = 'none';
        }, 500);
    };
}

// Add hover effects to cards
function addCardHoverEffects() {
    const cards = document.querySelectorAll('.food-card, .restaurant-card, .category-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
            this.style.boxShadow = '0px 15px 30px rgba(0, 0, 0, 0.2)';
            
            // Add a subtle rotation
            const randomRotation = (Math.random() * 4) - 2;
            this.style.transform += ` rotate(${randomRotation}deg)`;
            
            // Animate the image
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0px 10px 20px rgba(0, 0, 0, 0.1)';
            
            // Reset image
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1)';
            }
        });
    });
    
    // Add pulse animation to cart button
    const cartButton = document.querySelector('.cart-button');
    if (cartButton) {
        setInterval(() => {
            cartButton.classList.add('pulse');
            setTimeout(() => {
                cartButton.classList.remove('pulse');
            }, 1000);
        }, 5000);
        
        // Add CSS for pulse animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            .pulse {
                animation: pulse 1s ease;
            }
        `;
        document.head.appendChild(style);
    }
}

// Add a simple cart functionality
let cartCount = 0;
const cartNotification = document.querySelector('.cart-notification');

// Add click event to all food cards to add to cart
const foodCards = document.querySelectorAll('.food-card');
foodCards.forEach(card => {
    card.addEventListener('click', function(e) {
        // Prevent default navigation
        e.preventDefault();
        e.stopPropagation();
        
        // Increment cart count
        cartCount++;
        cartNotification.textContent = cartCount;
        
        // Show add to cart animation
        const foodName = this.textContent.trim();
        showAddToCartNotification(foodName);
        
        // Add floating animation from card to cart
        const cardRect = this.getBoundingClientRect();
        const cartRect = document.querySelector('.cart-button').getBoundingClientRect();
        
        const floatingItem = document.createElement('div');
        floatingItem.classList.add('floating-item');
        floatingItem.style.cssText = `
            position: fixed;
            top: ${cardRect.top + cardRect.height/2}px;
            left: ${cardRect.left + cardRect.width/2}px;
            width: 20px;
            height: 20px;
            background-color: #ff5722;
            border-radius: 50%;
            z-index: 1000;
            pointer-events: none;
        `;
        
        document.body.appendChild(floatingItem);
        
        // Animate the floating item to the cart
        setTimeout(() => {
            floatingItem.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
            floatingItem.style.top = `${cartRect.top + cartRect.height/2}px`;
            floatingItem.style.left = `${cartRect.left + cartRect.width/2}px`;
            floatingItem.style.opacity = '0';
            floatingItem.style.transform = 'scale(0.5)';
            
            // Remove the floating item after animation
            setTimeout(() => {
                document.body.removeChild(floatingItem);
            }, 800);
        }, 10);
    });
});

// Show add to cart notification
function showAddToCartNotification(foodName) {
    const notification = document.createElement('div');
    notification.classList.add('add-to-cart-notification');
    notification.textContent = `${foodName} added to cart!`;
    
    document.body.appendChild(notification);
    
    // Add CSS for notification
    const style = document.createElement('style');
    style.textContent = `
        .add-to-cart-notification {
            position: fixed;
            bottom: 100px;
            right: 30px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            animation: fadeInOut 2s forwards;
        }
        
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(20px); }
            20% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
        }
    `;
    document.head.appendChild(style);
    
    // Remove notification after animation
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 2000);
}
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



//contact us
// Fade-in animation on scroll
document.addEventListener('DOMContentLoaded', function() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    }
    
    // Check on initial load
    checkFade();
    
    // Check on scroll
    window.addEventListener('scroll', checkFade);
    
    // Form submission handling
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const submitButton = document.querySelector('.btn-submit');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Add loading state to button
        submitButton.classList.add('loading');
        
        // Simulate form submission (replace with actual form submission)
        setTimeout(function() {
            // Remove loading state
            submitButton.classList.remove('loading');
            
            // Show success message
            successMessage.style.display = 'block';
            
            // Reset form
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(function() {
                successMessage.style.display = 'none';
            }, 5000);
        }, 1500);
    });
    
    // Input animation
    const formControls = document.querySelectorAll('.form-control');
    
    formControls.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
    });
});

// Interactive hover effects for contact info items
const infoItems = document.querySelectorAll('.info-item');

infoItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.querySelector('.info-icon').style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.querySelector('.info-icon').style.transform = 'scale(1) rotate(0)';
    });
});