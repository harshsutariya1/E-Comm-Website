document.addEventListener('DOMContentLoaded', function () {
    // Product data
    const products = [
        {
            id: 'premium-headphones',
            title: 'Premium Headphones',
            price: '$99.99',
            rating: 4.2,
            image: 'https://blobcdn.same.energy/a/35/c9/35c93bd71cf4e6e84dc0e8392b8ac13d620be867',
            category: 'electronics',
            badge: 'New',
            description: 'High-quality wireless headphones with noise cancellation and premium sound quality.'
        },
        {
            id: 'smart-watch',
            title: 'Smart Watch',
            price: '$199.99',
            rating: 4.8,
            image: 'https://blobcdn.same.energy/a/aa/df/aadf17fbbcb0b27b77c266eeef9bce73e51c4127',
            category: 'electronics',
            badge: 'Best Seller',
            description: 'Advanced fitness tracking smartwatch with heart rate monitor and GPS.'
        },
        {
            id: 'designer-backpack',
            title: 'Designer Backpack',
            price: '$79.99',
            rating: 4.1,
            image: 'https://blobcdn.same.energy/a/6a/b0/6ab02c96c2fbe6c248cbeba571fb96273e0e0a7a',
            category: 'fashion',
            badge: null,
            description: 'Stylish and durable backpack for everyday use with multiple compartments.'
        },
        {
            id: 'wireless-speaker',
            title: 'Wireless Speaker',
            price: '$149.99',
            rating: 4.9,
            image: 'https://blobcdn.same.energy/b/ee/3d/ee3d982582428fc8af247e35291c30051d6acf05',
            category: 'electronics',
            badge: 'Sale',
            description: 'Portable Bluetooth speaker with excellent sound quality and waterproof design.'
        },
        {
            id: 'gaming-keyboard',
            title: 'Gaming Keyboard',
            price: '$129.99',
            rating: 4.7,
            image: 'https://blobcdn.same.energy/a/9f/ec/9fec7195862d1e0ce4e502e7a52940e1463dd60b',
            category: 'electronics',
            badge: null,
            description: 'Mechanical gaming keyboard with RGB lighting and customizable keys.'
        },
        {
            id: 'fitness-tracker',
            title: 'Fitness Tracker',
            price: '$89.99',
            rating: 4.3,
            image: 'https://blobcdn.same.energy/b/8a/ad/8aad3251eaac9ebcf50038c4fcd70fd32290839a',
            category: 'sports',
            badge: null,
            description: 'Advanced fitness tracker with sleep monitoring and step counting.'
        },
        {
            id: 'coffee-maker',
            title: 'Coffee Maker',
            price: '$159.99',
            rating: 4.5,
            image: 'https://placehold.co/250x250/ff9771/ffffff?text=Coffee+Maker',
            category: 'home',
            badge: null,
            description: 'Premium coffee maker with programmable features and thermal carafe.'
        },
        {
            id: 'desk-lamp',
            title: 'Desk Lamp',
            price: '$49.99',
            rating: 4.6,
            image: 'https://placehold.co/250x250/ff9771/ffffff?text=Desk+Lamp',
            category: 'home',
            badge: null,
            description: 'LED desk lamp with adjustable brightness and USB charging port.'
        },
        {
            id: 'yoga-mat',
            title: 'Yoga Mat',
            price: '$29.99',
            rating: 4.4,
            image: 'https://placehold.co/250x250/ff9771/ffffff?text=Yoga+Mat',
            category: 'sports',
            badge: null,
            description: 'Non-slip yoga mat for comfortable workouts and meditation.'
        },
        {
            id: 'phone-case',
            title: 'Phone Case',
            price: '$19.99',
            rating: 4.8,
            image: 'https://placehold.co/250x250/ff9771/ffffff?text=Phone+Case',
            category: 'electronics',
            badge: null,
            description: 'Protective phone case with card holder and shock absorption.'
        },
        {
            id: 'running-shoes',
            title: 'Running Shoes',
            price: '$119.99',
            rating: 4.7,
            image: 'https://placehold.co/250x250/ff9771/ffffff?text=Running+Shoes',
            category: 'sports',
            badge: 'New',
            description: 'High-performance running shoes with advanced cushioning technology.'
        },
        {
            id: 'blender',
            title: 'Professional Blender',
            price: '$199.99',
            rating: 4.6,
            image: 'https://placehold.co/250x250/ff9771/ffffff?text=Blender',
            category: 'home',
            badge: 'Sale',
            description: 'Professional blender with multiple speed settings and durable blades.'
        }
    ];

    // DOM elements
    const productsGrid = document.getElementById('productsGrid');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortProducts = document.getElementById('sortProducts');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');

    // Pagination variables
    let currentPage = 1;
    const productsPerPage = 8;
    let filteredProducts = [...products];

    // Create product card HTML
    function createProductCard(product) {
        return `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}">
                    <div class="product-overlay">
                        <button class="btn-icon wishlist-btn" aria-label="Add to wishlist" data-product-id="${product.id}">
                            <i class="far fa-heart"></i>
                        </button>
                        <button class="btn-icon quick-view-btn" aria-label="Quick view">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                </div>
                <div class="product-info">
                    <h3>
                        <span class="product-title">${product.title}</span>
                        <div class="product-rating">
                            <i class="fas fa-star"></i>
                            <span>${product.rating}</span>
                        </div>
                    </h3>
                    <p class="product-price">${product.price}</p>
                    <p class="product-description">${product.description}</p>
                    <button class="btn btn-primary add-to-cart-btn">Add to Cart</button>
                </div>
            </div>
        `;
    }

    // Render products
    function renderProducts() {
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const productsToShow = filteredProducts.slice(startIndex, endIndex);

        productsGrid.innerHTML = productsToShow.map(product => createProductCard(product)).join('');

        // Update pagination
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        currentPageSpan.textContent = currentPage;
        totalPagesSpan.textContent = totalPages;

        prevPage.disabled = currentPage === 1;
        nextPage.disabled = currentPage === totalPages;

        // Re-initialize wishlist state for new products
        initializeWishlistState();
    }

    // Filter products
    function filterProducts() {
        const category = categoryFilter.value;
        filteredProducts = category ? products.filter(product => product.category === category) : [...products];
        currentPage = 1;
        renderProducts();
    }

    // Sort products
    function sortProductsFunction() {
        const sortBy = sortProducts.value;

        switch (sortBy) {
            case 'price-low':
                filteredProducts.sort((a, b) => parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', '')));
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', '')));
                break;
            case 'rating':
                filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'name':
                filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
                break;
            default:
                filteredProducts = [...products];
                break;
        }

        currentPage = 1;
        renderProducts();
    }

    // Initialize wishlist state
    function initializeWishlistState() {
        const wishlist = JSON.parse(localStorage.getItem('bytebazaar_wishlist')) || [];
        const wishlistBtns = document.querySelectorAll('.wishlist-btn');

        wishlistBtns.forEach(btn => {
            const productId = btn.getAttribute('data-product-id');
            const icon = btn.querySelector('i');

            const isInWishlist = wishlist.some(item => item.id === productId);
            if (isInWishlist) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        });
    }

    // Generate unique product ID
    function generateProductId(title) {
        return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    // Event listeners
    categoryFilter.addEventListener('change', filterProducts);
    sortProducts.addEventListener('change', sortProductsFunction);

    prevPage.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderProducts();
        }
    });

    nextPage.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderProducts();
        }
    });

    // Wishlist functionality for products page
    document.addEventListener('click', function (e) {
        if (e.target.closest('.wishlist-btn')) {
            e.stopPropagation();
            const btn = e.target.closest('.wishlist-btn');
            const productCard = btn.closest('.product-card');
            const productId = btn.getAttribute('data-product-id');
            const productTitle = productCard.querySelector('.product-title').textContent.trim();
            const productImage = productCard.querySelector('img').src;
            const productPrice = productCard.querySelector('.product-price').textContent;
            const ratingElement = productCard.querySelector('.product-rating span');
            const productRating = ratingElement ? parseFloat(ratingElement.textContent) : 0;

            const product = {
                id: productId,
                image: productImage,
                title: productTitle,
                price: productPrice,
                rating: productRating,
                dateAdded: new Date().toISOString()
            };

            // Get current wishlist from localStorage
            let wishlist = JSON.parse(localStorage.getItem('bytebazaar_wishlist')) || [];

            // Check if item already exists in wishlist
            const existingItemIndex = wishlist.findIndex(item => item.id === productId);

            if (existingItemIndex !== -1) {
                // Remove from wishlist
                wishlist.splice(existingItemIndex, 1);
                btn.querySelector('i').classList.remove('fas');
                btn.querySelector('i').classList.add('far');
                showNotification('Removed from wishlist');
            } else {
                // Add to wishlist
                wishlist.push(product);
                btn.querySelector('i').classList.remove('far');
                btn.querySelector('i').classList.add('fas');
                showNotification('Added to wishlist!');

                // Add animation
                btn.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    btn.style.transform = 'scale(1)';
                }, 300);
            }

            localStorage.setItem('bytebazaar_wishlist', JSON.stringify(wishlist));

            // Dispatch custom event for wishlist updates
            window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: wishlist }));
        }

        // Add to cart functionality for products page
        if (e.target.closest('.add-to-cart-btn')) {
            e.stopPropagation();
            const btn = e.target.closest('.add-to-cart-btn');
            const productCard = btn.closest('.product-card');
            const productImage = productCard.querySelector('img').src;
            const productTitle = productCard.querySelector('.product-title').textContent.trim();
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

            // Get current cart from localStorage
            let cart = JSON.parse(localStorage.getItem('bytebazaar_cart')) || [];

            // Check if item already exists in cart
            const existingItemIndex = cart.findIndex(item => item.id === product.id);

            if (existingItemIndex !== -1) {
                cart[existingItemIndex].quantity += 1;
            } else {
                cart.push(product);
            }

            localStorage.setItem('bytebazaar_cart', JSON.stringify(cart));
            updateCartCount();
            showNotification('Product added to cart!');
        }
    });

    // Update cart count function
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('bytebazaar_cart')) || [];
        const totalCount = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);
        const cartCountElement = document.getElementById('cartCount');

        if (cartCountElement) {
            cartCountElement.textContent = totalCount > 0 ? totalCount : '';
        }
    }

    // Initialize page
    renderProducts();
});

// Utility function to show notifications (if not already defined)
if (typeof showNotification === 'undefined') {
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
}
