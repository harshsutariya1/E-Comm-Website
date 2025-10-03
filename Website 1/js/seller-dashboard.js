document.addEventListener('DOMContentLoaded', function () {
    // DOM elements
    const dashboardNavItems = document.querySelectorAll('.dashboard-nav-item');
    const dashboardTabs = document.querySelectorAll('.dashboard-tab');

    // Load seller dashboard data
    async function loadDashboardData() {
        try {
            const response = await fetch('../api/check_login.php');
            const data = await response.json();

            if (data.logged_in && data.user.is_seller) {
                const user = data.user;
                populateDashboard(user);
                loadSellerStats(user.u_id);
                loadSellerProducts(user.u_id);
                loadSellerOrders(user.u_id);
            } else {
                // Redirect if not a seller
                window.location.href = 'profile.html';
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    // Populate dashboard with user data
    function populateDashboard(user) {
        document.getElementById('storeName').textContent = user.seller_store_name || 'No Store Name';
        document.getElementById('storeCategory').textContent = user.seller_category || 'No Category';
        document.getElementById('memberSince').textContent = new Date(user.created_at).toLocaleDateString();
        document.getElementById('totalProducts').textContent = user.seller_total_products || 0;
        document.getElementById('totalSales').textContent = user.seller_total_sells || 0;
        document.getElementById('averageRating').textContent = user.seller_ratings || '0.0';
        // Calculate total revenue (placeholder)
        document.getElementById('totalRevenue').textContent = '$0.00'; // Would need to calculate from orders
    }

    // Load seller statistics
    async function loadSellerStats(sellerId) {
        // Placeholder for loading additional stats
        console.log('Loading seller stats for:', sellerId);
    }

    // Load seller products
    async function loadSellerProducts(sellerId) {
        try {
            const response = await fetch(`../api/get_seller_products.php?seller_id=${sellerId}`);
            const data = await response.json();

            if (data.success) {
                displaySellerProducts(data.products);
            } else {
                document.getElementById('sellerProducts').innerHTML = '<p>No products found.</p>';
            }
        } catch (error) {
            console.error('Error loading seller products:', error);
            document.getElementById('sellerProducts').innerHTML = '<p>Error loading products.</p>';
        }
    }

    // Display seller products
    function displaySellerProducts(products) {
        const productsHtml = products.map(product => `
            <div class="product-item">
                <img src="${product.p_image}" alt="${product.p_title}">
                <div class="product-info">
                    <h4>${product.p_title}</h4>
                    <p>Price: $${product.p_price}</p>
                    <p>Sold: ${product.p_total_sold}</p>
                </div>
            </div>
        `).join('');

        document.getElementById('sellerProducts').innerHTML = productsHtml || '<p>No products found.</p>';
    }

    // Load seller orders
    async function loadSellerOrders(sellerId) {
        try {
            const response = await fetch(`../api/get_seller_orders.php?seller_id=${sellerId}`);
            const data = await response.json();

            if (data.success) {
                displaySellerOrders(data.orders);
            } else {
                document.getElementById('sellerOrders').innerHTML = '<p>No orders found.</p>';
            }
        } catch (error) {
            console.error('Error loading seller orders:', error);
            document.getElementById('sellerOrders').innerHTML = '<p>Error loading orders.</p>';
        }
    }

    // Display seller orders
    function displaySellerOrders(orders) {
        const ordersHtml = orders.map(order => `
            <div class="order-item">
                <div class="order-header">
                    <span>Order #${order.o_id}</span>
                    <span>${new Date(order.o_createdat).toLocaleDateString()}</span>
                    <span>${order.is_delivered ? 'Delivered' : 'Processing'}</span>
                </div>
                <div class="order-details">
                    <p>Product: ${order.p_title}</p>
                    <p>Buyer: ${order.buyer_name}</p>
                    <p>Price: $${order.p_price}</p>
                </div>
            </div>
        `).join('');

        document.getElementById('sellerOrders').innerHTML = ordersHtml || '<p>No orders found.</p>';
    }

    // Handle tab switching
    dashboardNavItems.forEach(item => {
        item.addEventListener('click', function () {
            const tabName = this.getAttribute('data-tab');

            // Remove active class from all nav items and tabs
            dashboardNavItems.forEach(nav => nav.classList.remove('active'));
            dashboardTabs.forEach(tab => tab.classList.remove('active'));

            // Add active class to clicked nav item and corresponding tab
            this.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });

    // Initialize dashboard
    loadDashboardData();
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
