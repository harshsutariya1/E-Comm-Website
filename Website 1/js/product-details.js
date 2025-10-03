document.addEventListener('DOMContentLoaded', function () {
    // DOM elements
    const mainImage = document.getElementById('mainProductImage');
    const thumbnailGallery = document.getElementById('thumbnailGallery');
    const productName = document.getElementById('productName');
    const productRating = document.getElementById('productRating');
    const productPrice = document.getElementById('productPrice');
    const productBadge = document.getElementById('productBadge');
    const productDescription = document.getElementById('productDescription');
    const fullDescription = document.getElementById('fullDescription');
    const specificationsContent = document.getElementById('specificationsContent');
    const reviewsContent = document.getElementById('reviewsContent');
    const relatedProducts = document.getElementById('relatedProducts');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const wishlistBtn = document.getElementById('wishlistBtn');
    const quantityInput = document.getElementById('quantity');
    const decreaseQty = document.getElementById('decreaseQty');
    const increaseQty = document.getElementById('increaseQty');
    const zoomBtn = document.getElementById('zoomBtn');
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeModal = document.getElementById('closeModal');

    // Get product ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        showError('Product ID not found in URL');
        return;
    }

    // Load product details
    loadProductDetails(productId);

    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tabName = this.getAttribute('data-tab');

            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });

    // Quantity controls
    decreaseQty.addEventListener('click', function () {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    increaseQty.addEventListener('click', function () {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 99) {
            quantityInput.value = currentValue + 1;
        }
    });

    quantityInput.addEventListener('change', function () {
        let value = parseInt(this.value);
        if (value < 1) value = 1;
        if (value > 99) value = 99;
        this.value = value;
    });

    // Add to cart functionality
    addToCartBtn.addEventListener('click', function () {
        const quantity = parseInt(quantityInput.value);
        addToCart(productId, quantity);
    });

    // Wishlist functionality
    wishlistBtn.addEventListener('click', function () {
        toggleWishlist(productId);
    });

    // Image zoom functionality
    zoomBtn.addEventListener('click', function () {
        openImageModal(mainImage.src);
    });

    // Modal close functionality
    closeModal.addEventListener('click', function () {
        closeImageModal();
    });

    imageModal.addEventListener('click', function (e) {
        if (e.target === imageModal) {
            closeImageModal();
        }
    });

    // Load product details from database
    async function loadProductDetails(productId) {
        try {
            const response = await fetch(`../api/get_product.php?id=${productId}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Received non-JSON response');
            }

            const data = await response.json();

            if (data.success) {
                console.log('Product data:', data.product);
                displayProductDetails(data.product);
                loadRelatedProducts(data.product.category);
            } else {
                showError(data.message || 'Product not found');
            }
        } catch (error) {
            console.error('Error loading product details:', error);
            showError('Error loading product details: ' + error.message);
        }
    }

    // Display product details
    function displayProductDetails(product) {
        // Update page title
        document.title = `${product.title} - ByteBazaar`;

        // Main image
        mainImage.src = product.image;
        mainImage.alt = product.title;

        // Product name
        productName.textContent = product.title;

        // Rating
        productRating.innerHTML = generateStars(product.rating);

        // Price
        productPrice.textContent = product.price;

        // Badge
        if (product.badge) {
            productBadge.textContent = product.badge;
            productBadge.style.display = 'inline-block';
        } else {
            productBadge.style.display = 'none';
        }

        // Description
        productDescription.textContent = product.description.substring(0, 150) + '...';
        fullDescription.textContent = product.description;

        // Specifications (mock data for now)
        specificationsContent.innerHTML = `
            <div class="spec-item">
                <span class="spec-label">Category:</span>
                <span class="spec-value">${product.category}</span>
            </div>
            <div class="spec-item">
                <span class="spec-label">SKU:</span>
                <span class="spec-value">${product.id}</span>
            </div>
            <div class="spec-item">
                <span class="spec-label">Rating:</span>
                <span class="spec-value">${product.rating}/5.0</span>
            </div>
        `;

        // Reviews (mock data for now)
        reviewsContent.innerHTML = `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-author">John Doe</span>
                    <div class="review-rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                </div>
                <div class="review-date">2 weeks ago</div>
                <div class="review-text">Excellent product! Highly recommend to anyone looking for quality.</div>
            </div>
            <div class="review-item">
                <div class="review-header">
                    <span class="review-author">Jane Smith</span>
                    <div class="review-rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="far fa-star"></i>
                    </div>
                </div>
                <div class="review-date">1 month ago</div>
                <div class="review-text">Good value for money. Fast shipping and great customer service.</div>
            </div>
        `;

        // Check if product is in wishlist
        checkWishlistStatus(product.id);

        // Create thumbnail gallery (using the same image for now)
        thumbnailGallery.innerHTML = `
            <div class="thumbnail active">
                <img src="${product.image}" alt="${product.title}">
            </div>
        `;

        // Add click event to thumbnail
        const thumbnail = thumbnailGallery.querySelector('.thumbnail');
        thumbnail.addEventListener('click', function () {
            mainImage.src = product.image;
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    }

    // Load related products
    async function loadRelatedProducts(category) {
        try {
            const response = await fetch(`../api/get_products.php?category=${category}&limit=4`);

            if (response.ok) {
                const data = await response.json();

                if (data.success && data.products.length > 0) {
                    displayRelatedProducts(data.products);
                }
            }
        } catch (error) {
            console.warn('Error loading related products:', error);
        }
    }

    // Display related products
    function displayRelatedProducts(products) {
        relatedProducts.innerHTML = products.map(product => `
            <div class="related-card" onclick="window.location.href='product-details.html?id=${product.id}'">
                <img src="${product.image}" alt="${product.title}">
                <div class="related-card-info">
                    <h3>${product.title}</h3>
                    <div class="price">${product.price}</div>
                </div>
            </div>
        `).join('');
    }

    // Generate star rating HTML
    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        let starsHTML = '';

        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }

        if (halfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }

        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }

        return `<div class="product-rating">${starsHTML}<span>${rating}</span></div>`;
    }

    // Add to cart function
    function addToCart(productId, quantity) {
        // Get current cart
        let cart = JSON.parse(localStorage.getItem('bytebazaar_cart')) || [];

        // Find existing item
        const existingItemIndex = cart.findIndex(item => item.id === productId);

        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Get product details for cart
            const product = {
                id: productId,
                image: mainImage.src,
                title: productName.textContent,
                price: productPrice.textContent,
                rating: parseFloat(productRating.querySelector('span').textContent),
                quantity: quantity,
                dateAdded: new Date().toISOString()
            };
            cart.push(product);
        }

        // Save cart
        localStorage.setItem('bytebazaar_cart', JSON.stringify(cart));

        // Update cart count
        updateCartCount();

        // Show success message
        showNotification(`Added ${quantity} item(s) to cart!`);
    }

    // Toggle wishlist
    function toggleWishlist(productId) {
        let wishlist = JSON.parse(localStorage.getItem('bytebazaar_wishlist')) || [];

        const existingIndex = wishlist.findIndex(item => item.id === productId);

        if (existingIndex !== -1) {
            // Remove from wishlist
            wishlist.splice(existingIndex, 1);
            wishlistBtn.classList.remove('active');
            wishlistBtn.innerHTML = '<i class="far fa-heart"></i> Add to Wishlist';
            showNotification('Removed from wishlist');
        } else {
            // Add to wishlist
            const product = {
                id: productId,
                image: mainImage.src,
                title: productName.textContent,
                price: productPrice.textContent,
                rating: parseFloat(productRating.querySelector('span').textContent),
                dateAdded: new Date().toISOString()
            };
            wishlist.push(product);
            wishlistBtn.classList.add('active');
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> Added to Wishlist';
            showNotification('Added to wishlist!');
        }

        localStorage.setItem('bytebazaar_wishlist', JSON.stringify(wishlist));
    }

    // Check wishlist status
    function checkWishlistStatus(productId) {
        const wishlist = JSON.parse(localStorage.getItem('bytebazaar_wishlist')) || [];
        const isInWishlist = wishlist.some(item => item.id === productId);

        if (isInWishlist) {
            wishlistBtn.classList.add('active');
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> Added to Wishlist';
        } else {
            wishlistBtn.classList.remove('active');
            wishlistBtn.innerHTML = '<i class="far fa-heart"></i> Add to Wishlist';
        }
    }

    // Update cart count
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('bytebazaar_cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    }

    // Image modal functions
    function openImageModal(imageSrc) {
        modalImage.src = imageSrc;
        imageModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeImageModal() {
        imageModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Error display
    function showError(message) {
        const container = document.querySelector('.container');
        container.innerHTML = `
            <div style="text-align: center; padding: 80px 20px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: #e74c3c; margin-bottom: 20px;"></i>
                <h2 style="color: var(--text-color); margin-bottom: 15px;">Error Loading Product</h2>
                <p style="color: var(--text-secondary); font-size: 1.1rem;">${message}</p>
                <a href="index.html" class="btn btn-primary" style="margin-top: 30px;">Back to Home</a>
            </div>
        `;
    }

    // Initialize cart count
    updateCartCount();
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
