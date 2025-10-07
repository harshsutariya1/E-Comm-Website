document.addEventListener('DOMContentLoaded', function () {
    const becomeSellerForm = document.getElementById('becomeSellerForm');

    // Check if user is logged in
    checkLoginStatus();

    async function checkLoginStatus() {
        try {
            const response = await fetch('check_login.php');
            const data = await response.json();

            if (!data.logged_in) {
                showNotification('Please login to become a seller');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
                return;
            }

            // Check if user is already a seller
            if (data.user.is_seller) {
                showNotification('You are already a seller');
                setTimeout(() => {
                    window.location.href = 'seller-dashboard.html';
                }, 2000);
            }
        } catch (error) {
            console.error('Error checking login status:', error);
        }
    }

    // Form validation
    becomeSellerForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(becomeSellerForm);

        // Validate required fields
        const storeName = formData.get('storeName');
        const storeCategory = formData.get('storeCategory');
        const contactPhone = formData.get('contactPhone');
        const businessAddress = formData.get('businessAddress');

        if (!storeName || !storeCategory || !contactPhone || !businessAddress) {
            showNotification('Please fill in all required fields');
            return;
        }

        // Check checkboxes
        if (!document.getElementById('termsAccept').checked || !document.getElementById('dataAccuracy').checked) {
            showNotification('Please accept all terms and conditions');
            return;
        }

        // Submit form
        try {
            const response = await fetch('process_seller_registration.php', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Non-JSON response:', text);
                throw new Error('Server returned non-JSON response');
            }

            const data = await response.json();

            if (data.success) {
                showNotification(data.message);
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 2000);
            } else {
                showNotification(data.message || 'Failed to submit application');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showNotification('An error occurred. Please try again.');
        }
    });
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
