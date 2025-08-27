document.addEventListener('DOMContentLoaded', function () {
    // Get DOM elements
    const wishlistGrid = document.getElementById('wishlistGrid');
    const emptyWishlist = document.getElementById('emptyWishlist');
    const wishlistItemCount = document.getElementById('wishlistItemCount');
    const sortSelect = document.getElementById('sortSelect');
    const searchInput = document.getElementById('wishlistSearch');

    // Load wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('bytebazaar_wishlist')) || [];

    // Update wishlist count
    function updateWishlistCount() {
        wishlistItemCount.textContent = wishlist.length;
    }

    // Render wishlist items
    function renderWishlist(filteredWishlist = wishlist) {
        wishlistGrid.innerHTML = '';

        if (filteredWishlist.length === 0 && wishlist.length > 0) {
            wishlistGrid.innerHTML = '<div class="no-results"><p>No items match your search.</p></div>';
            return;
        }

        if (wishlist.length === 0) {
            emptyWishlist.style.display = 'block';
            wishlistGrid.style.display = 'none';
        } else {
            emptyWishlist.style.display = 'none';
            wishlistGrid.style.display = 'grid';

            filteredWishlist.forEach((item, index) => {
                const wishlistItem = createWishlistItem(item, index);
                wishlistGrid.appendChild(wishlistItem);
            });
        }

        updateWishlistCount();
    }

    // Create wishlist item element
    function createWishlistItem(item, index) {
        const itemElement = document.createElement('div');
        itemElement.className = 'wishlist-item';
        itemElement.innerHTML = `
            <div class="wishlist-item-image">
                <img src="${item.image}" alt="${item.title}">
                <button class="wishlist-item-remove" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="wishlist-item-info">
                <h3 class="wishlist-item-title">${item.title}</h3>
                <p class="wishlist-item-price">${item.price}</p>
                <div class="wishlist-item-rating">
                    ${generateStars(item.rating)}
                    <span>(${item.rating})</span>
                </div>
                <div class="wishlist-item-date">
                    <small>Added: ${formatDate(item.dateAdded)}</small>
                </div>
                <div class="wishlist-item-actions">
                    <button class="btn btn-primary add-to-cart-btn" data-index="${index}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn btn-secondary view-product-btn" data-index="${index}">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            </div>
        `;

        // Add event listeners
        const removeBtn = itemElement.querySelector('.wishlist-item-remove');
        const addToCartBtn = itemElement.querySelector('.add-to-cart-btn');
        const viewProductBtn = itemElement.querySelector('.view-product-btn');

        removeBtn.addEventListener('click', () => removeFromWishlist(index));
        addToCartBtn.addEventListener('click', () => addToCart(item));
        viewProductBtn.addEventListener('click', () => viewProduct(item));

        return itemElement;
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

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Remove item from wishlist
    function removeFromWishlist(index) {
        const item = wishlist[index];
        wishlist.splice(index, 1);
        localStorage.setItem('bytebazaar_wishlist', JSON.stringify(wishlist));
        renderWishlist();
        showNotification('Item removed from wishlist');

        // Dispatch event for other pages
        window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: wishlist }));
    }

    // Add item to cart
    function addToCart(item) {
        // Get current cart from localStorage
        let cart = JSON.parse(localStorage.getItem('bytebazaar_cart')) || [];

        // Check if item already exists in cart
        const existingItem = cart.find(cartItem => cartItem.id === item.id);

        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }

        localStorage.setItem('bytebazaar_cart', JSON.stringify(cart));
        showNotification('Item added to cart!');
    }

    // View product details
    function viewProduct(item) {
        // For now, just show a notification
        // In a real app, this would navigate to the product page
        showNotification(`Viewing ${item.title} details`);
    }

    // Sort wishlist
    function sortWishlist(criteria) {
        let sortedWishlist = [...wishlist];

        switch (criteria) {
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
            default:
                break;
        }

        renderWishlist(sortedWishlist);
    }

    // Search wishlist
    function searchWishlist(query) {
        if (!query.trim()) {
            renderWishlist();
            return;
        }

        const filteredWishlist = wishlist.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase())
        );
        renderWishlist(filteredWishlist);
    }

    // Event listeners
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortWishlist(e.target.value);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchWishlist(e.target.value);
        });
    }

    // Listen for wishlist updates from other pages
    window.addEventListener('storage', function (e) {
        if (e.key === 'bytebazaar_wishlist') {
            wishlist = JSON.parse(e.newValue) || [];
            renderWishlist();
        }
    });

    // Listen for custom wishlist update events
    window.addEventListener('wishlistUpdated', function (e) {
        wishlist = e.detail;
        renderWishlist();
    });

    // Initialize wishlist
    renderWishlist();
});
