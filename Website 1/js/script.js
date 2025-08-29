document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            // Toggle icon
            const icon = this.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!mobileMenu.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            const icon = mobileMenu.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });

    // Close mobile menu when clicking a nav link
    const navLinkElements = document.querySelectorAll('.nav-link');
    navLinkElements.forEach(link => {
        link.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                const icon = mobileMenu.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // Account dropdown functionality
    const accountLinkToggle = document.getElementById('accountLinkToggle');
    const accountDropdown = document.getElementById('accountDropdown');

    if (accountLinkToggle) {
        accountLinkToggle.addEventListener('click', function (e) {
            e.preventDefault();
            accountDropdown.classList.toggle('show');
        });
    }

    // Close dropdown when clicking outside
    window.addEventListener('click', function (e) {
        if (accountDropdown && !accountLinkToggle.contains(e.target) && !accountDropdown.contains(e.target)) {
            accountDropdown.classList.remove('show');
        }
    });

    // Add to cart functionality
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const cartCount = document.querySelector('.cart-count');
    let cartItems = JSON.parse(localStorage.getItem('bytebazaar_cart')) || [];

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const productCard = this.closest('.product-card');
            const h3 = productCard.querySelector('h3').cloneNode(true);
            h3.querySelector('.product-rating')?.remove();
            const productTitle = h3.textContent.trim();
            const productImage = productCard.querySelector('img').src;
            const productPrice = productCard.querySelector('.product-price').textContent;
            const ratingElement = productCard.querySelector('.product-rating span');
            const productRating = ratingElement ? parseFloat(ratingElement.textContent) : 0;

            const product = {
                id: generateProductId(productTitle),
                image: productImage,
                title: productTitle,
                price: productPrice,
                rating: productRating,
                quantity: 1,
                dateAdded: new Date().toISOString()
            };

            // Check if item already exists in cart
            const existingItemIndex = cartItems.findIndex(item => item.id === product.id);

            if (existingItemIndex !== -1) {
                cartItems[existingItemIndex].quantity += 1;
            } else {
                cartItems.push(product);
            }

            localStorage.setItem('bytebazaar_cart', JSON.stringify(cartItems));
            updateCartCount();

            // Add animation
            cartCount.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartCount.style.transform = 'scale(1)';
            }, 200);

            // Show success message
            showNotification('Product added to cart!');
        });
    });

    // Update cart count function
    function updateCartCount() {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    }

    // Initialize cart count on page load
    updateCartCount();

    // Wishlist functionality
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');

    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation(); // Prevent card click
            const icon = this.querySelector('i');
            if (icon) {
                const productCard = this.closest('.product-card');
                const h3 = productCard.querySelector('h3').cloneNode(true);
                h3.querySelector('.product-rating')?.remove();
                const productTitle = h3.textContent.trim();
                const productImage = productCard.querySelector('img').src;
                const productPrice = productCard.querySelector('.product-price').textContent;
                const ratingElement = productCard.querySelector('.product-rating span');
                const productRating = ratingElement ? parseFloat(ratingElement.textContent) : 0;

                const product = {
                    id: generateProductId(productTitle), // Add unique ID
                    image: productImage,
                    title: productTitle,
                    price: productPrice,
                    rating: productRating,
                    dateAdded: new Date().toISOString()
                };

                // Get current wishlist from localStorage
                let wishlist = JSON.parse(localStorage.getItem('bytebazaar_wishlist')) || [];

                // Check if item already exists in wishlist
                const existingItemIndex = wishlist.findIndex(item => item.id === product.id);

                if (existingItemIndex !== -1) {
                    // Remove from wishlist
                    wishlist.splice(existingItemIndex, 1);
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    showNotification('Removed from wishlist');
                } else {
                    // Add to wishlist
                    wishlist.push(product);
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    showNotification('Added to wishlist!');

                    // Add animation
                    icon.style.transform = 'scale(1.3)';
                    setTimeout(() => {
                        icon.style.transform = 'scale(1)';
                    }, 300);
                }

                localStorage.setItem('bytebazaar_wishlist', JSON.stringify(wishlist));

                // Dispatch custom event for wishlist updates
                window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: wishlist }));
            }
        });
    });

    // Initialize wishlist state on page load
    function initializeWishlistState() {
        const wishlist = JSON.parse(localStorage.getItem('bytebazaar_wishlist')) || [];
        const wishlistBtns = document.querySelectorAll('.wishlist-btn');

        wishlistBtns.forEach(btn => {
            const productCard = btn.closest('.product-card');
            if (productCard) {
                const h3 = productCard.querySelector('h3').cloneNode(true);
                h3.querySelector('.product-rating')?.remove();
                const productTitle = h3.textContent.trim();
                const productId = generateProductId(productTitle);
                const icon = btn.querySelector('i');

                if (icon) {
                    const isInWishlist = wishlist.some(item => item.id === productId);
                    if (isInWishlist) {
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                    } else {
                        icon.classList.remove('fas');
                        icon.classList.add('far');
                    }
                }
            }
        });
    }

    // Generate unique product ID
    function generateProductId(title) {
        return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    // Call initialization on DOM ready
    initializeWishlistState();

    // Quick view functionality
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');

    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation(); // Prevent card click
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('h3').textContent;
            showNotification(`Quick view for ${productTitle}`);
        });
    });

    // Image loading handler
    const productImages = document.querySelectorAll('.product-image img');
    productImages.forEach(img => {
        img.addEventListener('load', function () {
            this.classList.add('loaded');
        });

        img.addEventListener('error', function () {
            this.src = 'https://placehold.co/250x250/e0e0e0/999?text=Image+Not+Available';
            this.classList.add('loaded');
        });
    });

    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                showNotification('Thank you for subscribing!');
                this.querySelector('input[type="email"]').value = '';
            }
        });
    }

    // Search functionality
    const searchInput = document.querySelector('.nav-search input');
    const searchBtn = document.querySelector('.nav-search button');

    if (searchBtn) {
        searchBtn.addEventListener('click', function () {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                showNotification(`Searching for: ${searchTerm}`);
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    showNotification(`Searching for: ${searchTerm}`);
                }
            }
        });
    }

    // Hero section buttons
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            if (this.textContent.includes('Shopping')) {
                showNotification('Welcome to ByteBazaar! Start browsing our products.');
            } else if (this.textContent.includes('Seller')) {
                showNotification('Ready to become a seller? Let\'s get started!');
            }
        });
    });

    // Form validation for auth forms
    const loginForm = document.querySelector('#loginForm form');
    const registerForm = document.querySelector('#registerForm form');

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;

            if (email && password) {
                showNotification('Login successful! Welcome back.');
                modal.style.display = 'none';
            } else {
                showNotification('Please fill in all fields.');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const password = this.querySelector('input[placeholder="Password"]').value;
            const confirmPassword = this.querySelector('input[placeholder="Confirm Password"]').value;

            if (password !== confirmPassword) {
                showNotification('Passwords do not match.');
                return;
            }

            showNotification('Account created successfully! Welcome to ByteBazaar.');
            modal.style.display = 'none';
        });
    }

    // Seller card click handling
    const sellerCards = document.querySelectorAll('.seller-card');
    sellerCards.forEach(card => {
        const visitBtn = card.querySelector('.btn-secondary');
        if (visitBtn) {
            visitBtn.addEventListener('click', function () {
                const sellerName = card.querySelector('h3').textContent;
                showNotification(`Visiting ${sellerName} store`);
            });
        }
    });

    // View All Sellers button
    const viewAllBtn = document.querySelector('.view-all-btn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function () {
            showNotification('Redirecting to all sellers page...');
            // Here you would typically redirect to a sellers page
        });
    }

    // View All Products button
    const viewAllProductsBtn = document.querySelector('.view-all-products-btn');
    if (viewAllProductsBtn) {
        viewAllProductsBtn.addEventListener('click', function () {
            window.location.href = 'products.html';
        });
    }

    // Cart link functionality
    const cartLinks = document.querySelectorAll('a[href="cart.html"]');
    cartLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    });
});

// Utility function to show notifications
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff6b35;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}
