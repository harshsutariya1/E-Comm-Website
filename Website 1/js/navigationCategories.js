// Function to load categories in navigation menu
async function loadNavigationCategories() {
    try {
        const response = await fetch('../api/get_categories.php');

        if (!response.ok) {
            console.warn('Failed to load categories for navigation');
            return;
        }

        const data = await response.json();

        if (data.success && data.categories.length > 0) {
            console.log('Categories loaded for navigation:', data.categories);
            updateNavigationMenu(data.categories);
        }
    } catch (error) {
        console.warn('Error loading navigation categories:', error);
    }
}

// Update navigation menu with categories
function updateNavigationMenu(categories) {
    const navigationCategoriesLists = document.querySelectorAll('.categories-list');
    const footerCategoriesList = document.querySelector('.footer-categories');

    navigationCategoriesLists.forEach(list => {
        // Keep first 8 categories to match original design
        const displayCategories = categories.slice(0, 8);

        list.innerHTML = displayCategories.map(category => {
            return `
                <li>
                    <a href="products.html?category=${category.name.toLowerCase()}">
                        <i class="${category.icon_class}"></i> ${category.name}
                    </a>
                </li>
            `;
        }).join('');
        console.info('Navigation categories updated');
    });

    if (footerCategoriesList) {
        footerCategoriesList.innerHTML = categories.map(category => {
            return `
                <li>
                    <a href="products.html?category=${category.name.toLowerCase()}">
                        ${category.name}
                    </a>
                </li>
            `;
        }).join('');
        console.info('Footer categories updated');
    }
}

// Initialize navigation categories when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    loadNavigationCategories();
});
