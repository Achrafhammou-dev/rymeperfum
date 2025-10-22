document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animation library
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Shopping Cart Functionality
    let cart = [];
    const cartButton = document.getElementById('cartButton');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    const checkoutBtn = document.getElementById('checkoutBtn');
    const orderModal = new bootstrap.Modal(document.getElementById('orderModal'));
    const placeOrderBtn = document.getElementById('placeOrderBtn');

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.dataset.id;
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price);
            
            // Check if item already in cart
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    quantity: 1
                });
            }
            
            updateCart();
            showAddedToCartAlert(name);
        });
    });

    // Show alert when item added to cart
    function showAddedToCartAlert(productName) {
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show animated';
        alertDiv.role = 'alert';
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '20px';
        alertDiv.style.right = '20px';
        alertDiv.style.zIndex = '9999';
        alertDiv.style.maxWidth = '300px';
        
        alertDiv.innerHTML = `
            <strong>Added to Cart!</strong> ${productName} has been added to your cart.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Remove alert after 3 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }

    // Update cart display
    function updateCart() {
        // Update cart count
        const cartCount = document.querySelector('.cart-count');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update cart modal content
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="text-center empty-cart-message">Your cart is empty</p>';
            cartTotal.textContent = 'mad 0';
        } else {
            let cartHTML = '';
            let total = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                cartHTML += `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="cart-item-img">
                            <img src="../img/MoreCollection2.jpeg" alt="${item.name}">
                        </div>
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">Mad ${item.price.toFixed(2)}</div>
                        </div>
                        <div class="cart-item-quantity">
                            <span class="quantity-btn decrease">-</span>
                            <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                            <span class="quantity-btn increase">+</span>
                            <span class="remove-item"><i class="fas fa-trash-alt"></i></span>
                        </div>
                    </div>
                `;
            });
            
            cartItems.innerHTML = cartHTML;
            cartTotal.textContent = `Mad ${total.toFixed(2)}`;
            
            // Add event listeners for quantity buttons
            document.querySelectorAll('.increase').forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.closest('.cart-item').dataset.id;
                    const item = cart.find(item => item.id === id);
                    item.quantity++;
                    updateCart();
                });
            });
            
            document.querySelectorAll('.decrease').forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.closest('.cart-item').dataset.id;
                    const item = cart.find(item => item.id === id);
                    if (item.quantity > 1) {
                        item.quantity--;
                    } else {
                        cart = cart.filter(cartItem => cartItem.id !== id);
                    }
                    updateCart();
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.closest('.cart-item').dataset.id;
                    cart = cart.filter(item => item.id !== id);
                    updateCart();
                });
            });
        }
    }

    // Open cart modal
    cartButton.addEventListener('click', function(e) {
        e.preventDefault();
        cartModal.show();
    });

    // Checkout button
    checkoutBtn.addEventListener('click', function() {
        if (cart.length > 0) {
            cartModal.hide();
            orderModal.show();
        } else {
            alert('Your cart is empty. Add some products before checkout.');
        }
    });

    // Place order button
    placeOrderBtn.addEventListener('click', function() {
        const orderForm = document.getElementById('orderForm');
        
        // Check if form is valid
        if (orderForm.checkValidity()) {
            // Get form data
            const formData = {
                name: document.getElementById('fullName').value,
                email: document.getElementById('orderEmail').value,
                address: document.getElementById('address').value,
                phone: document.getElementById('phone').value,
                paymentMethod: document.getElementById('paymentMethod').value,
                items: cart,
                total: cart.reduce((total, item) => total + (item.price * item.quantity), 0)
            };
            
            // Here you would normally send this data to a server
            // For this demo, we'll just show a success message
            orderModal.hide();
            
            // Clear cart
            cart = [];
            updateCart();
            
            // Show success message
            showOrderSuccessAlert();
            
            // Reset form
            orderForm.reset();
        } else {
            // Trigger form validation
            orderForm.reportValidity();
        }
    });

    // Show order success alert
    function showOrderSuccessAlert() {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show animated';
        alertDiv.role = 'alert';
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '20px';
        alertDiv.style.right = '20px';
        alertDiv.style.zIndex = '9999';
        alertDiv.style.maxWidth = '300px';
        
        alertDiv.innerHTML = `
            <strong>Order Placed Successfully!</strong> Thank you for your purchase.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Remove alert after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Here you would normally send this data to a server
            // For this demo, we'll just show a success message
            showContactSuccessAlert();
            
            // Reset form
            contactForm.reset();
        });
    }

    // Show contact form success alert
    function showContactSuccessAlert() {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show animated';
        alertDiv.role = 'alert';
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '20px';
        alertDiv.style.right = '20px';
        alertDiv.style.zIndex = '9999';
        alertDiv.style.maxWidth = '300px';
        
        alertDiv.innerHTML = `
            <strong>Message Sent!</strong> We'll get back to you soon.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Remove alert after 3 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }

    // Collection view buttons
    const collectionModal = new bootstrap.Modal(document.getElementById('collectionModal'));
    const collectionModalLabel = document.getElementById('collectionModalLabel');
    const collectionProducts = document.getElementById('collectionProducts');
    
    document.querySelectorAll('.view-collection').forEach(button => {
        button.addEventListener('click', function() {
            const collection = this.dataset.collection;
            let products = [];
            
            // Set collection title
            if (collection === 'luxury') {
                collectionModalLabel.textContent = 'Luxury Collection';
                products = [
                    { id: 'lux1', name: 'Royal Amber', price: 180, desc: 'Rich amber with vanilla and sandalwood notes' },
                    { id: 'lux2', name: 'Velvet Noir', price: 165, desc: 'Deep black currant with hints of musk' },
                    { id: 'lux3', name: 'Golden Oud', price: 195, desc: 'Precious oud wood with golden amber' },
                    { id: 'lux4', name: 'Crystal Rose', price: 170, desc: 'Delicate rose with crystal jasmine notes' }
                ];
            } else if (collection === 'signature') {
                collectionModalLabel.textContent = 'Signature Collection';
                products = [
                    { id: 'sig1', name: 'Classic Elegance', price: 120, desc: 'Timeless blend of citrus and woody notes' },
                    { id: 'sig2', name: 'Modern Muse', price: 135, desc: 'Contemporary floral with a hint of spice' },
                    { id: 'sig3', name: 'Urban Sophisticate', price: 125, desc: 'Sophisticated blend for the modern individual' },
                    { id: 'sig4', name: 'Eternal Grace', price: 130, desc: 'Graceful composition of white flowers' }
                ];
            } else if (collection === 'limited') {
                collectionModalLabel.textContent = 'Limited Edition Collection';
                products = [
                    { id: 'lim1', name: 'Summer Solstice', price: 150, desc: 'Limited summer release with tropical notes' },
                    { id: 'lim2', name: 'Winter Frost', price: 155, desc: 'Seasonal blend with pine and spice' },
                    { id: 'lim3', name: 'Midnight Bloom', price: 160, desc: 'Rare night-blooming flowers and amber' },
                    { id: 'lim4', name: 'Autumn Whisper', price: 145, desc: 'Fall-inspired with warm vanilla and cinnamon' }
                ];
            }
            
            // Generate product HTML
            let productsHTML = '';
            products.forEach(product => {
                productsHTML += `
                    <div class="col-md-6 mb-4">
                        <div class="product-card">
                            <div class="product-img">
                                <img src="https://via.placeholder.com/300x300" alt="${product.name}" class="img-fluid">
                            </div>
                            <div class="product-info">
                                <h4>${product.name}</h4>
                                <p class="product-desc">${product.desc}</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="product-price">Mad ${product.price}</span>
                                    <button class="btn btn-sm btn-primary collection-add-to-cart" 
                                        data-id="${product.id}" 
                                        data-name="${product.name}" 
                                        data-price="${product.price}">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            collectionProducts.innerHTML = productsHTML;
            
            // Add event listeners for add to cart buttons in collection modal
            document.querySelectorAll('.collection-add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.dataset.id;
                    const name = this.dataset.name;
                    const price = parseFloat(this.dataset.price);
                    
                    // Check if item already in cart
                    const existingItem = cart.find(item => item.id === id);
                    
                    if (existingItem) {
                        existingItem.quantity++;
                    } else {
                        cart.push({
                            id,
                            name,
                            price,
                            quantity: 1
                        });
                    }
                    
                    updateCart();
                    showAddedToCartAlert(name);
                });
            });
            
            collectionModal.show();
        });
    });
});