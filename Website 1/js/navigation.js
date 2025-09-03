// Function to load categories in navigation menu
async function loadNavigationCategories() {
    try {
        const response = await fetch('get_categories.php');

        if (!response.ok) {
            console.warn('Failed to load categories for navigation');
            return;
        }

        const data = await response.json();

        if (data.success && data.categories.length > 0) {
            updateNavigationMenu(data.categories);
        }
    } catch (error) {
        console.warn('Error loading navigation categories:', error);
    }
}

// Update navigation menu with categories
function updateNavigationMenu(categories) {
    const categoriesLists = document.querySelectorAll('.categories-list');

    categoriesLists.forEach(list => {
        // Keep first 8 categories to match original design
        const displayCategories = categories.slice(0, 8);

        list.innerHTML = displayCategories.map(category => {
            const categoryUrl = category.slug === 'home-garden' ? 'home' : category.slug;
            return `
                <li>
                    <a href="products.html?category=${categoryUrl}">
                        <i class="${category.icon_class}"></i> ${category.name}
                    </a>
                </li>
            `;
        }).join('');
    });
}

// Initialize navigation categories when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    loadNavigationCategories();
});
