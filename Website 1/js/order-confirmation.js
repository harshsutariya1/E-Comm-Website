document.addEventListener('DOMContentLoaded', function () {
    // Get order IDs from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdsParam = urlParams.get('order_ids');

    if (!orderIdsParam) {
        showError('Order IDs not found in URL');
        return;
    }

    const orderIds = orderIdsParam.split(',').map(id => parseInt(id));

    // Load order details
    loadOrderDetails(orderIds);

    async function loadOrderDetails(orderIds) {
        try {
            const response = await fetch(`get_order_details.php?order_ids=${orderIds.join(',')}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                displayOrderDetails(data.order_details, data.user_info);
            } else {
                showError(data.message || 'Failed to load order details');
            }
        } catch (error) {
            console.error('Error loading order details:', error);
            showError('Error loading order details: ' + error.message);
        }
    }

    function displayOrderDetails(orderDetails, userInfo) {
        // Order info
        document.getElementById('orderId').textContent = orderDetails[0].o_id;
        document.getElementById('orderDate').textContent = new Date(orderDetails[0].o_createdat).toLocaleDateString();
        document.getElementById('totalItems').textContent = orderDetails.length;
        const totalAmount = orderDetails.reduce((sum, item) => sum + (parseFloat(item.p_price) * 1), 0); // Assuming quantity 1 for now
        document.getElementById('totalAmount').textContent = `$${totalAmount.toFixed(2)}`;

        // Order items
        const itemsHtml = orderDetails.map(item => `
            <div class="order-item">
                <div class="item-image">
                    <img src="${item.p_image}" alt="${item.p_title}">
                </div>
                <div class="item-details">
                    <h3>${item.p_title}</h3>
                    <p class="item-price">$${item.p_price}</p>
                    <p class="item-seller">Sold by: ${item.seller_name}</p>
                </div>
            </div>
        `).join('');
        document.getElementById('orderItems').innerHTML = itemsHtml;

        // Shipping details
        const shippingHtml = `
            <div class="shipping-item">
                <h4>Shipping Address</h4>
                <p>${userInfo.first_name} ${userInfo.last_name}</p>
                <p>${userInfo.address || 'Address not provided'}</p>
                <p>Phone: ${userInfo.phone_number || 'Phone not provided'}</p>
            </div>
        `;
        document.getElementById('shippingDetails').innerHTML = shippingHtml;
    }

    function showError(message) {
        const container = document.querySelector('.container');
        container.innerHTML = `
            <div style="text-align: center; padding: 80px 20px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: #e74c3c; margin-bottom: 20px;"></i>
                <h2 style="color: var(--text-color); margin-bottom: 15px;">Error Loading Order</h2>
                <p style="color: var(--text-secondary); font-size: 1.1rem;">${message}</p>
                <a href="index.html" class="btn btn-primary" style="margin-top: 30px;">Back to Home</a>
            </div>
        `;
    }
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
