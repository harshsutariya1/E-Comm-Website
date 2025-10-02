document.addEventListener('DOMContentLoaded', function () {
    const categoryGrid = document.getElementById('categoryGrid');
    const loadingMessage = document.getElementById('loadingMessage');

    // Fetch categories from database
    async function fetchCategories() {
        try {
            const response = await fetch('get_categories.php');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Received non-JSON response. Check if PHP is enabled on the server.');
            }

            const data = await response.json();

            if (data.success) {
                renderCategories(data.categories);
            } else {
                showError('Failed to load categories: ' + data.message);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            showError('Error loading categories: ' + error.message);
        }
    }

    // Render categories
    function renderCategories(categories) {
        if (loadingMessage) {
            loadingMessage.style.display = 'none';
        }

        if (categories.length === 0) {
            categoryGrid.innerHTML = '<p class="no-categories">No categories available.</p>';
            return;
        }

        categoryGrid.innerHTML = categories.map(category => createCategoryCard(category)).join('');
    }

    // Create category card HTML
    function createCategoryCard(category) {
        return `
            <a href="products.html?category=${category.name}" class="category-display-card">
                <div class="card-image">
                    <img src="${category.image}" alt="${category.name}" onerror="this.src='https://placehold.co/400x300/ff6b35/ffffff?text=${encodeURIComponent(category.name)}'">
                </div>
                <div class="card-content">
                    <h3><i class="${category.icon_class}"></i> ${category.name}</h3>
                    <p>${category.description || 'Discover our ' + category.name.toLowerCase() + ' collection.'}</p>
                    ${category.products_count > 0 ? `<span class="product-count">${category.products_count} products</span>` : ''}
                </div>
            </a>
        `;
    }

    // Show error message
    function showError(message) {
        if (loadingMessage) {
            loadingMessage.style.display = 'none';
        }
        categoryGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">Retry</button>
            </div>
        `;
    }

    // Initialize
    fetchCategories();
});
