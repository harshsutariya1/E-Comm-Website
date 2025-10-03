document.addEventListener('DOMContentLoaded', function () {
    // Fetch sellers data and populate the section
    async function loadSellers() {
        try {
            const response = await fetch('../api/get_sellers.php');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                renderSellers(data.sellers);
                console.log('Sellers loaded successfully:', data.sellers.length);
            } else {
                console.error('Failed to fetch sellers:', data.message);
                showNotification('Failed to load sellers: ' + data.message);
            }
        } catch (error) {
            console.error('Error fetching sellers:', error);
            showNotification('Error loading sellers: ' + error.message);
        }
    }

    // Generate star rating HTML
    function generateStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

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

    // Format numbers (e.g., 2500 -> 2.5K)
    function formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Create seller card HTML
    function createSellerCard(seller) {
        return `
            <div class="seller-card" data-seller-id="${seller.id}">
                <div class="seller-header">
                    <div class="seller-logo">
                        <img src="${seller.profile_pic}" alt="${seller.store_name}">
                    </div>
                    <div class="seller-info">
                        <h3>${seller.store_name}</h3>
                        <p class="seller-category">${seller.category}</p>
                        <div class="seller-rating">
                            ${generateStars(seller.rating)}
                            <span>(${seller.rating})</span>
                        </div>
                    </div>
                </div>
                <div class="seller-stats">
                    <div class="stat">
                        <span class="stat-number">${formatNumber(seller.total_products)}</span>
                        <span class="stat-label">Products</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">${formatNumber(seller.total_sales)}</span>
                        <span class="stat-label">Sales</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">${Math.round((seller.rating / 5) * 100)}%</span>
                        <span class="stat-label">Positive</span>
                    </div>
                </div>
                <button class="btn btn-secondary visit-store-btn" data-seller-id="${seller.id}">Visit Store</button>
            </div>
        `;
    }

    // Render sellers in the grid
    function renderSellers(sellers) {
        const sellersGrid = document.querySelector('.sellers-grid');
        if (!sellersGrid) return;

        // Show only first 3 sellers for the popular sellers section
        const sellersToShow = sellers.slice(0, 3);

        sellersGrid.innerHTML = sellersToShow.map(seller => createSellerCard(seller)).join('');

        // Add event listeners for visit store buttons
        const visitButtons = sellersGrid.querySelectorAll('.visit-store-btn');
        visitButtons.forEach(button => {
            button.addEventListener('click', function () {
                const sellerId = this.getAttribute('data-seller-id');
                // For now, just show a notification. In a real app, this would navigate to the seller's store page
                showNotification(`Redirecting to ${this.previousElementSibling.previousElementSibling.querySelector('h3').textContent} store...`);
                // window.location.href = `seller-store.html?id=${sellerId}`;
            });
        });
    }

    // Initialize sellers loading
    loadSellers();
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
