document.addEventListener('DOMContentLoaded', function () {
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
    let allProducts = []; // Will be populated from database
    let filteredProducts = [];

    // Fetch products from database
    async function fetchProducts() {
        try {
            console.log('Fetching products from database...');
            const response = await fetch('get_products.php');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Received data:', data);

            if (data.success) {
                allProducts = data.products;
                filteredProducts = [...allProducts];
                renderProducts();
                console.log('Products loaded successfully:', allProducts.length);
            } else {
                console.error('Failed to fetch products:', data.message);
                showNotification('Failed to load products: ' + data.message);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            showNotification('Error loading products: ' + error.message + '. Please check your connection and server setup.');
        }
    }

    // Generate star rating HTML
    function generateStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }

        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }

        return stars;
    }

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
        filteredProducts = category ? allProducts.filter(product => product.category === category) : [...allProducts];
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
                filteredProducts = [...allProducts];
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
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    }

    // Initialize page by fetching products
    fetchProducts();
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
