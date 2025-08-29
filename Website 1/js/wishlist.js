document.addEventListener('DOMContentLoaded', function () {
    // DOM elements
    const wishlistGrid = document.getElementById('wishlistGrid');
    const emptyWishlist = document.getElementById('emptyWishlist');
    const wishlistItemCount = document.getElementById('wishlistItemCount');
    const wishlistSearch = document.getElementById('wishlistSearch');
    const sortSelect = document.getElementById('sortSelect');

    // Get wishlist items from localStorage
    function getWishlist() {
        return JSON.parse(localStorage.getItem('bytebazaar_wishlist')) || [];
    }

    // Get cart items from localStorage
    function getCart() {
        return JSON.parse(localStorage.getItem('bytebazaar_cart')) || [];
    }

    // Save cart items to localStorage
    function saveCart(cart) {
        localStorage.setItem('bytebazaar_cart', JSON.stringify(cart));
    }

    // Generate stars based on rating
    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        let starsHTML = '';

        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }

        // Half star
        if (halfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }

        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }

        return starsHTML;
    }

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    // Create wishlist item HTML
    function createWishlistItemHTML(item, index) {
        return `
            <div class="wishlist-item" data-id="${item.id}">
                <div class="wishlist-item-image">
                    <img src="${item.image}" alt="${item.title}">
                    <button class="remove-btn" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="wishlist-item-info">
                    <h3>
                        <span class="product-title">${item.title}</span>
                        <div class="wishlist-item-rating">
                            <i class="fas fa-star"></i>
                            <span>${item.rating}</span>
                        </div>
                    </h3>
                    <p class="wishlist-item-price">${item.price}</p>
                    <p class="wishlist-item-date">Added ${formatDate(item.dateAdded)}</p>
                    <div class="wishlist-item-actions">
                        <button class="btn btn-primary add-to-cart-btn" data-index="${index}">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Render wishlist items
    function renderWishlist(wishlist = getWishlist()) {
        if (wishlist.length === 0) {
            wishlistGrid.style.display = 'none';
            emptyWishlist.style.display = 'block';
            wishlistItemCount.textContent = '0';
            return;
        }

        emptyWishlist.style.display = 'none';
        wishlistGrid.style.display = 'grid';
        wishlistItemCount.textContent = wishlist.length;

        wishlistGrid.innerHTML = wishlist.map((item, index) =>
            createWishlistItemHTML(item, index)
        ).join('');

        // Attach event listeners to the newly created add-to-cart buttons
        setupAddToCartListeners();
    }

    // Setup event listeners for add to cart buttons
    function setupAddToCartListeners() {
        const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                const wishlist = getWishlist();
                const item = wishlist[index];

                // Add item to cart
                addToCart(item);

                // Show success message
                showNotification('Product added to cart!');
            });
        });
    }

    // Add item to cart
    function addToCart(item) {
        const cart = getCart();

        // Create cart item from wishlist item
        const cartItem = {
            id: item.id,
            image: item.image,
            title: item.title,
            price: item.price,
            rating: item.rating,
            quantity: 1,
            dateAdded: new Date().toISOString()
        };

        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

        if (existingItemIndex !== -1) {
            // Increment quantity if item already exists
            cart[existingItemIndex].quantity += 1;
        } else {
            // Add new item to cart
            cart.push(cartItem);
        }

        // Save updated cart to localStorage
        saveCart(cart);

        // Update cart count in navigation
        updateCartCount();
    }

    // Update cart count in navigation
    function updateCartCount() {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const cartCountElements = document.querySelectorAll('.cart-count');

        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    }

    // Remove item from wishlist
    function removeFromWishlist(index) {
        const wishlist = getWishlist();
        wishlist.splice(index, 1);
        localStorage.setItem('bytebazaar_wishlist', JSON.stringify(wishlist));
        renderWishlist(wishlist);
        showNotification('Item removed from wishlist');
    }

    // Search wishlist
    function searchWishlist() {
        const searchTerm = wishlistSearch.value.toLowerCase().trim();
        const wishlist = getWishlist();

        if (searchTerm === '') {
            renderWishlist(wishlist);
            return;
        }

        const filteredWishlist = wishlist.filter(item =>
            item.title.toLowerCase().includes(searchTerm)
        );

        renderWishlist(filteredWishlist);
    }

    // Sort wishlist
    function sortWishlist() {
        const sortBy = sortSelect.value;
        const wishlist = getWishlist();

        if (sortBy === '') {
            renderWishlist(wishlist);
            return;
        }

        const sortedWishlist = [...wishlist];

        switch (sortBy) {
            case 'name':
                sortedWishlist.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'price-low':
                sortedWishlist.sort((a, b) => parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', '')));
                break;
            case 'price-high':
                sortedWishlist.sort((a, b) => parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', '')));
                break;
            case 'rating':
                sortedWishlist.sort((a, b) => b.rating - a.rating);
                break;
            case 'date':
                sortedWishlist.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
                break;
        }

        renderWishlist(sortedWishlist);
    }

    // Event Listeners
    wishlistGrid.addEventListener('click', function (e) {
        // Handle remove button clicks
        if (e.target.closest('.remove-btn')) {
            const index = parseInt(e.target.closest('.remove-btn').getAttribute('data-index'));
            removeFromWishlist(index);
        }
    });

    wishlistSearch.addEventListener('input', searchWishlist);
    sortSelect.addEventListener('change', sortWishlist);

    // Listen for wishlist updates from other pages
    window.addEventListener('wishlistUpdated', function () {
        renderWishlist();
    });

    // Initialize wishlist
    renderWishlist();
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
