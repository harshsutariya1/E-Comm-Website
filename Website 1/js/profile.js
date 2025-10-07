document.addEventListener('DOMContentLoaded', function () {
    // DOM elements
    const profileNavItems = document.querySelectorAll('.profile-nav-item');
    const profileTabs = document.querySelectorAll('.profile-tab');
    const settingsForm = document.getElementById('settingsForm');
    const wishlistPreview = document.getElementById('wishlistPreview');

    // Load user profile data
    async function loadProfileData() {
        try {
            const response = await fetch('check_login.php');
            const data = await response.json();

            if (data.logged_in) {
                const user = data.user;
                document.getElementById('userName').textContent = `${user.first_name} ${user.last_name}`;
                document.getElementById('userEmail').textContent = user.email;
                document.getElementById('memberSince').textContent = `Member since: ${new Date(user.created_at).toLocaleDateString()}`;
                document.getElementById('totalOrders').textContent = user.total_user_orders || 0;

                // Update profile avatar - use seller_profile_pic if seller, otherwise use placeholder
                const avatarElement = document.getElementById('profileAvatar');
                if (user.is_seller && user.seller_profile_pic) {
                    avatarElement.src = user.seller_profile_pic;
                } else {
                    const firstLetter = user.first_name.charAt(0).toUpperCase();
                    avatarElement.src = `https://placehold.co/150x150/ff6b35/ffffff?text=${firstLetter}&font=roboto`;
                }

                // Populate settings form
                document.getElementById('firstName').value = user.first_name;
                document.getElementById('lastName').value = user.last_name;
                document.getElementById('email').value = user.email;
                document.getElementById('phone_number').value = user.phone_number || '';
                document.getElementById('address').value = user.address || '';

                // Update seller button based on seller status
                const sellerBtn = document.getElementById('sellerBtn');
                if (user.is_seller) {
                    sellerBtn.textContent = 'Seller Dashboard';
                    sellerBtn.onclick = () => window.location.href = 'seller-dashboard.html';
                } else {
                    sellerBtn.textContent = 'Become a Seller';
                    sellerBtn.onclick = () => window.location.href = 'become-seller.html';
                }

                // Load additional data
                loadWishlistCount();
                loadOrders();
            } else {
                // Redirect to login if not logged in
                window.location.href = 'login.html';
            }
        } catch (error) {
            console.error('Error loading profile data:', error);
        }
    }

    // Load orders for the orders tab
    async function loadOrders() {
        try {
            const response = await fetch('get_user_orders.php');
            const data = await response.json();

            if (data.success) {
                displayOrders(data.orders);
            } else {
                document.getElementById('ordersList').innerHTML = '<p>No orders found.</p>';
            }
        } catch (error) {
            console.error('Error loading orders:', error);
            document.getElementById('ordersList').innerHTML = '<p>Error loading orders.</p>';
        }
    }

    // Display orders in the orders tab
    function displayOrders(orders) {
        const ordersList = document.getElementById('ordersList');
        if (orders.length === 0) {
            ordersList.innerHTML = `
                <div class="no-orders">
                    <i class="fas fa-box-open"></i>
                    <p>No orders found.</p>
                    <a href="index.html" class="btn btn-primary">Start Shopping</a>
                </div>
            `;
            return;
        }

        const ordersHtml = orders.map(order => `
            <div class="order-item">
                <div class="order-header">
                    <span class="order-id">Order #${order.o_id}</span>
                    <span class="order-date">${new Date(order.o_createdat).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })}</span>
                    <span class="order-status ${order.is_delivered ? 'delivered' : 'processing'}">
                        ${order.is_delivered ? '✓ Delivered' : '⏳ Processing'}
                    </span>
                </div>
                <div class="order-details">
                    <img src="${order.p_image}" alt="${order.p_title}" class="order-image">
                    <div class="order-info">
                        <h4>${order.p_title}</h4>
                        <p>$${parseFloat(order.p_price).toFixed(2)}</p>
                        <p>Sold by: ${order.seller_name}</p>
                    </div>
                </div>
            </div>
        `).join('');

        ordersList.innerHTML = ordersHtml;
    }

    // Populate seller settings
    function populateSellerSettings(user) {
        document.getElementById('storeName').value = user.seller_store_name || '';
        document.getElementById('storeCategory').value = user.seller_category || '';
        document.getElementById('storeRating').value = user.seller_ratings || '0.00';
        document.getElementById('totalProducts').value = user.seller_total_products || '0';
        document.getElementById('totalSales').value = user.seller_total_sells || '0';
    }

    // Load wishlist count
    function loadWishlistCount() {
        const wishlist = JSON.parse(localStorage.getItem('bytebazaar_wishlist')) || [];
        document.getElementById('wishlistCount').textContent = wishlist.length;

        if (wishlistPreview && wishlist.length > 0) {
            wishlistPreview.innerHTML = wishlist.slice(0, 3).map(item => `
                <div class="wishlist-item-preview">
                    <img src="${item.image}" alt="${item.title}">
                    <div>
                        <h4>${item.title}</h4>
                        <p>${item.price}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    // Load order count (placeholder)
    function loadOrderCount(totalOrders) {
        document.getElementById('totalOrders').textContent = totalOrders;
    }

    // Handle tab switching
    profileNavItems.forEach(item => {
        item.addEventListener('click', function () {
            const tabName = this.getAttribute('data-tab');

            // Remove active class from all nav items and tabs
            profileNavItems.forEach(nav => nav.classList.remove('active'));
            profileTabs.forEach(tab => tab.classList.remove('active'));

            // Add active class to clicked nav item and corresponding tab
            this.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });

    // Handle settings form submission
    if (settingsForm) {
        settingsForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = new FormData();
            formData.append('first_name', document.getElementById('firstName').value);
            formData.append('last_name', document.getElementById('lastName').value);
            formData.append('email', document.getElementById('email').value);
            formData.append('phone_number', document.getElementById('phone_number').value);
            formData.append('address', document.getElementById('address').value);

            try {
                const response = await fetch('update_profile.php', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                showNotification(data.message);

                if (data.success) {
                    loadProfileData(); // Reload profile data to show changes
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                showNotification('An error occurred while updating your profile.');
            }
        });
    }

    // Handle logout
    document.getElementById('logoutBtn').addEventListener('click', function () {
        window.location.href = 'logout.php';
    });

    // Initialize profile page
    loadProfileData();
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
