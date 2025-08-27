document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', function () {
            navLinks.classList.toggle('active');
        });
    }

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
    const addToCartBtns = document.querySelectorAll('.product-card .btn-primary');
    const cartCount = document.querySelector('.cart-count');
    let cartItems = 0;

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            cartItems++;
            cartCount.textContent = cartItems;

            // Add animation
            cartCount.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartCount.style.transform = 'scale(1)';
            }, 200);

            // Show success message
            showNotification('Product added to cart!');
        });
    });

    // Wishlist functionality
    const wishlistBtns = document.querySelectorAll('.btn-icon');

    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-heart')) {
                if (icon.classList.contains('fas')) {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    showNotification('Removed from wishlist');
                } else {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    showNotification('Added to wishlist!');
                }
            }
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

    // Category card click handling
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function () {
            const categoryName = this.querySelector('h3').textContent;
            showNotification(`Browsing ${categoryName} category`);
        });
    });

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
            showNotification('Redirecting to all products page...');
            // Here you would typically redirect to a products page
        });
    }

    // Add scroll animations _____________________________________________ //
    // function animateOnScroll() {
    //     const elements = document.querySelectorAll('.category-card, .product-card, .seller-card');
    //
    //     elements.forEach(element => {
    //         const elementTop = element.getBoundingClientRect().top;
    //         const elementVisible = 150;
    //
    //         if (elementTop < window.innerHeight - elementVisible) {
    //             element.style.opacity = '1';
    //             element.style.transform = 'translateY(0)';
    //         }
    //     });
    // }
    //
    // // Initialize scroll animations
    // const elements = document.querySelectorAll('.category-card, .product-card, .seller-card');
    // elements.forEach(element => {
    //     element.style.opacity = '0';
    //     element.style.transform = 'translateY(20px)';
    //     element.style.transition = 'all 0.6s ease';
    // });
    //
    // window.addEventListener('scroll', animateOnScroll);
    // animateOnScroll(); _________________________________________________ //

    // Categories Carousel functionality
    const carousel = document.getElementById('categoriesCarousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator');

    let currentSlide = 0;
    const totalSlides = 4; // Updated to 4 indicator dots for 12 categories
    const cardsPerSlide = window.innerWidth <= 768 ? 1 : (window.innerWidth <= 1024 ? 2 : 3);

    function updateCarousel() {
        const cardWidth = 250 + 30; // card width + gap
        const translateX = currentSlide * (cardWidth * cardsPerSlide);
        carousel.style.transform = `translateX(-${translateX}px)`;

        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });

        // Update button states
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;
    }

    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateCarousel();
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    }

    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateCarousel();
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });

    // Auto-slide functionality
    let autoSlideInterval = setInterval(() => {
        if (currentSlide === totalSlides - 1) {
            currentSlide = 0;
        } else {
            currentSlide++;
        }
        updateCarousel();
    }, 6000); // Increased to 6 seconds for more categories

    // Pause auto-slide on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });

        carouselContainer.addEventListener('mouseleave', () => {
            autoSlideInterval = setInterval(() => {
                if (currentSlide === totalSlides - 1) {
                    currentSlide = 0;
                } else {
                    currentSlide++;
                }
                updateCarousel();
            }, 6000);
        });
    }

    // Initialize carousel
    updateCarousel();

    // Handle window resize
    window.addEventListener('resize', () => {
        updateCarousel();
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
