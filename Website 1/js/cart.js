document.addEventListener('DOMContentLoaded', function () {
    // DOM elements
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartSummary = document.getElementById('cartSummary');
    const itemCount = document.getElementById('itemCount');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Load cart from localStorage
    function loadCart() {
        const cart = JSON.parse(localStorage.getItem('bytebazaar_cart')) || [];
        return cart;
    }

    // Save cart to localStorage
    function saveCart(cart) {
        localStorage.setItem('bytebazaar_cart', JSON.stringify(cart));
    }

    // Update cart count in navigation
    function updateCartCount() {
        const cart = loadCart();
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    }

    // Render cart items
    function renderCart() {
        const cart = loadCart();

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '';
            emptyCart.style.display = 'block';
            cartSummary.style.display = 'none';
            return;
        }

        emptyCart.style.display = 'none';
        cartSummary.style.display = 'block';

        cartItemsContainer.innerHTML = cart.map((item, index) => createCartItemHTML(item, index)).join('');

        updateCartSummary();
        updateCartCount();
    }

    // Create cart item HTML
    function createCartItemHTML(item, index) {
        const quantity = item.quantity || 1;
        const itemTotal = parseFloat(item.price.replace('$', '')) * quantity;

        return `
            <div class="cart-item" data-index="${index}" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-info">
                    <h3>${item.title}</h3>
                    <p class="cart-item-price">${item.price}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease-btn" data-index="${index}">-</button>
                        <input type="number" class="quantity-input" value="${quantity}" min="1" data-index="${index}">
                        <button class="quantity-btn increase-btn" data-index="${index}">+</button>
                    </div>
                    <a href="#" class="remove-btn" data-index="${index}">Remove</a>
                </div>
                <div class="item-total">
                    <span>$${itemTotal.toFixed(2)}</span>
                </div>
            </div>
        `;
    }

    // Update cart summary
    function updateCartSummary() {
        const cart = loadCart();
        const subtotal = cart.reduce((sum, item) => {
            const quantity = item.quantity || 1;
            return sum + (parseFloat(item.price.replace('$', '')) * quantity);
        }, 0);

        const shipping = subtotal > 50 ? 0 : 9.99;
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + shipping + tax;

        itemCount.textContent = cart.length;
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        shippingElement.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }

    // Update item quantity
    function updateQuantity(index, newQuantity) {
        const cart = loadCart();
        if (cart[index]) {
            cart[index].quantity = Math.max(1, newQuantity);
            saveCart(cart);
            renderCart();
        }
    }

    // Remove item from cart
    function removeItem(index) {
        const cart = loadCart();
        cart.splice(index, 1);
        saveCart(cart);
        renderCart();
        showNotification('Item removed from cart');
    }

    // Clear cart
    function clearCart() {
        localStorage.removeItem('bytebazaar_cart');
        renderCart();
        showNotification('Cart cleared');
    }

    // Event listeners
    cartItemsContainer.addEventListener('click', function (e) {
        e.preventDefault();

        if (e.target.classList.contains('decrease-btn')) {
            const index = parseInt(e.target.dataset.index);
            const cart = loadCart();
            const currentQuantity = cart[index].quantity || 1;
            if (currentQuantity > 1) {
                updateQuantity(index, currentQuantity - 1);
            }
        }

        if (e.target.classList.contains('increase-btn')) {
            const index = parseInt(e.target.dataset.index);
            const cart = loadCart();
            const currentQuantity = cart[index].quantity || 1;
            updateQuantity(index, currentQuantity + 1);
        }

        if (e.target.classList.contains('remove-btn')) {
            const index = parseInt(e.target.dataset.index);
            removeItem(index);
        }
    });

    cartItemsContainer.addEventListener('change', function (e) {
        if (e.target.classList.contains('quantity-input')) {
            const index = parseInt(e.target.dataset.index);
            const newQuantity = parseInt(e.target.value);
            if (newQuantity > 0) {
                updateQuantity(index, newQuantity);
            } else {
                e.target.value = 1;
                updateQuantity(index, 1);
            }
        }
    });

    checkoutBtn.addEventListener('click', async function () {
        const cart = loadCart();
        if (cart.length === 0) {
            showNotification('Your cart is empty');
            return;
        }

        // Check login status and user details
        try {
            const response = await fetch('../api/check_login.php');
            const data = await response.json();

            if (!data.logged_in) {
                showNotification('You must be logged in to checkout. Redirecting to login...');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
                return;
            }

            const user = data.user;
            if (!user.address || !user.phone_number) {
                showNotification('Please add your address and phone number in your profile before checking out.');
                setTimeout(() => {
                    window.location.href = 'profile.html#settings';
                }, 2000);
                return;
            }

            // Process order
            const formData = new FormData();
            formData.append('cart_items', JSON.stringify(cart));

            const orderResponse = await fetch('../api/process_order.php', {
                method: 'POST',
                body: formData
            });
            const orderData = await orderResponse.json();

            if (orderData.success) {
                // Clear cart
                localStorage.removeItem('bytebazaar_cart');
                updateCartCount();

                // Redirect to confirmation page
                const orderIds = orderData.order_ids.join(',');
                window.location.href = `order-confirmation.html?order_ids=${orderIds}`;
            } else {
                showNotification(orderData.message);
            }

        } catch (error) {
            console.error('Error during checkout:', error);
            showNotification('An error occurred during checkout. Please try again.');
        }
    });

    // Initialize cart on page load
    renderCart();
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
