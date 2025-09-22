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

                if (user.is_seller) {
                    document.getElementById('sellerTab').style.display = 'block';
                }

                // Load additional data
                loadWishlistCount();
                loadOrderCount();
            } else {
                // Redirect to login if not logged in
                window.location.href = 'login.html';
            }
        } catch (error) {
            console.error('Error loading profile data:', error);
        }
    }

    // Load wishlist count
    function loadWishlistCount() {
        const wishlist = JSON.parse(localStorage.getItem('bytebazaar_wishlist')) || [];
        document.getElementById('wishlistCount').textContent = wishlist.length;

        if (wishlist.length > 0) {
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
    function loadOrderCount() {
        // This would typically fetch from server
        document.getElementById('totalOrders').textContent = '0'; // Placeholder
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
        settingsForm.addEventListener('submit', function (e) {
            e.preventDefault();
            // Handle form submission (placeholder)
            showNotification('Settings updated successfully!');
        });
    }

    // Add logout functionality
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'profile-nav-item';
    logoutBtn.textContent = 'Logout';
    logoutBtn.style.background = '#e74c3c';
    logoutBtn.style.color = 'white';
    logoutBtn.addEventListener('click', function () {
        window.location.href = 'logout.php';
    });
    document.querySelector('.profile-nav').appendChild(logoutBtn);

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
