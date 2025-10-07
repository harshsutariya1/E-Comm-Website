document.addEventListener('DOMContentLoaded', function () {
    checkAdminAuth();
    loadDashboardStats();
    loadUsers();

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function (e) {
            if (this.id === 'logoutBtn') {
                e.preventDefault();
                logout();
                return;
            }

            const section = this.dataset.section;
            if (section) {
                e.preventDefault();
                switchSection(section);
            }
        });
    });

    // User search
    document.getElementById('userSearch').addEventListener('input', function (e) {
        filterUsers(e.target.value);
    });

    // Product search
    document.getElementById('productSearch').addEventListener('input', function (e) {
        filterProducts(e.target.value);
    });

    // Modal close
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => closeAllModals());
    });

    // Edit product form
    document.getElementById('editProductForm').addEventListener('submit', handleEditProduct);

    // Add product form
    document.getElementById('addProductForm').addEventListener('submit', handleAddProduct);
});

async function checkAdminAuth() {
    try {
        const response = await fetch('check_admin.php');
        const data = await response.json();

        if (!data.logged_in) {
            window.location.href = 'admin-login.html';
        } else {
            document.getElementById('adminName').textContent = data.admin.email;
        }
    } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = 'admin-login.html';
    }
}

async function loadDashboardStats() {
    try {
        const response = await fetch('admin_stats.php');
        const data = await response.json();

        if (data.success) {
            document.getElementById('totalUsers').textContent = data.stats.total_users;
            document.getElementById('totalSellers').textContent = data.stats.total_sellers;
            document.getElementById('totalProducts').textContent = data.stats.total_products;
            document.getElementById('totalOrders').textContent = data.stats.total_orders;
        }
    } catch (error) {
        console.error('Stats error:', error);
    }
}

let allUsers = [];

async function loadUsers() {
    try {
        const response = await fetch('admin_get_users.php');
        const data = await response.json();

        if (data.success) {
            allUsers = data.users;
            displayUsers(allUsers);
        } else {
            document.getElementById('usersTableBody').innerHTML = '<tr><td colspan="7" class="loading-cell">Failed to load users</td></tr>';
        }
    } catch (error) {
        console.error('Users error:', error);
        document.getElementById('usersTableBody').innerHTML = '<tr><td colspan="7" class="loading-cell">Error loading users</td></tr>';
    }
}

function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');

    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading-cell">No users found</td></tr>';
        return;
    }

    tbody.innerHTML = users.map(user => {
        const roleClass = user.is_seller == 1 ? 'seller' : '';
        const roleText = user.is_seller == 1 ? 'Seller' : 'User';
        const statusClass = user.is_user_active == 1 ? 'active' : 'inactive';
        const statusText = user.is_user_active == 1 ? 'Active' : 'Inactive';
        const toggleButtonText = user.is_user_active == 1 ? 'Deactivate' : 'Activate';

        return `
            <tr>
                <td>${user.u_id}</td>
                <td>${user.first_name} ${user.last_name}</td>
                <td>${user.email}</td>
                <td><span class="role-badge ${roleClass}">${roleText}</span></td>
                <td>${user.total_user_orders || 0}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="action-btn btn-toggle" onclick="toggleUserStatus(${user.u_id}, ${user.is_user_active})">
                        <i class="fas fa-power-off"></i> ${toggleButtonText}
                    </button>
                    <button class="action-btn btn-delete" onclick="deleteUser(${user.u_id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function filterUsers(searchTerm) {
    const filtered = allUsers.filter(user =>
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    displayUsers(filtered);
}

// Product Management
let allProducts = [];

async function loadProducts() {
    try {
        const response = await fetch('admin_get_products.php');
        const data = await response.json();

        if (data.success) {
            allProducts = data.products;
            displayProducts(allProducts);
            await loadSellersForDropdown();
        } else {
            document.getElementById('productsTableBody').innerHTML = '<tr><td colspan="8" class="loading-cell">Failed to load products</td></tr>';
        }
    } catch (error) {
        console.error('Products error:', error);
        document.getElementById('productsTableBody').innerHTML = '<tr><td colspan="8" class="loading-cell">Error loading products</td></tr>';
    }
}

async function loadSellersForDropdown() {
    try {
        const response = await fetch('admin_get_sellers.php');
        const data = await response.json();

        if (data.success) {
            const sellerSelect = document.getElementById('addProductSeller');
            sellerSelect.innerHTML = '<option value="">Select a seller...</option>' +
                data.sellers.map(seller =>
                    `<option value="${seller.u_id}">${seller.first_name} ${seller.last_name} (${seller.seller_store_name || 'No Store'})</option>`
                ).join('');
        }
    } catch (error) {
        console.error('Sellers dropdown error:', error);
    }
}

function displayProducts(products) {
    const tbody = document.getElementById('productsTableBody');

    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="loading-cell">No products found</td></tr>';
        return;
    }

    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.p_id}</td>
            <td><img src="${product.p_image}" alt="${product.p_title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
            <td>${product.p_title}</td>
            <td>$${parseFloat(product.p_price).toFixed(2)}</td>
            <td>${product.seller_name || 'Unknown'}</td>
            <td>${product.p_category || 'N/A'}</td>
            <td>${product.p_total_sold || 0}</td>
            <td>
                <button class="action-btn btn-edit" onclick="editProduct(${product.p_id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn btn-delete" onclick="deleteProduct(${product.p_id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

function filterProducts(searchTerm) {
    const filtered = allProducts.filter(product =>
        product.p_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.seller_name && product.seller_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.p_category && product.p_category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    displayProducts(filtered);
}

function editProduct(productId) {
    const product = allProducts.find(p => p.p_id === productId);
    if (!product) return;

    document.getElementById('editProductId').value = product.p_id;
    document.getElementById('editProductTitle').value = product.p_title;
    document.getElementById('editProductPrice').value = product.p_price;
    document.getElementById('editProductCategory').value = product.p_category || '';
    document.getElementById('editProductDescription').value = product.p_description || '';
    document.getElementById('editProductImage').value = product.p_image || '';

    document.getElementById('editProductModal').classList.add('active');
}

async function handleEditProduct(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('product_id', document.getElementById('editProductId').value);
    formData.append('title', document.getElementById('editProductTitle').value);
    formData.append('price', document.getElementById('editProductPrice').value);
    formData.append('category', document.getElementById('editProductCategory').value);
    formData.append('description', document.getElementById('editProductDescription').value);
    formData.append('image', document.getElementById('editProductImage').value);

    try {
        const response = await fetch('admin_update_product.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            showNotification('Product updated successfully', 'success');
            closeAllModals();
            await loadProducts();
            await loadDashboardStats();
        } else {
            showNotification(data.message || 'Update failed', 'error');
        }
    } catch (error) {
        console.error('Update error:', error);
        showNotification('An error occurred', 'error');
    }
}

async function handleAddProduct(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('seller_id', document.getElementById('addProductSeller').value);
    formData.append('title', document.getElementById('addProductTitle').value);
    formData.append('price', document.getElementById('addProductPrice').value);
    formData.append('category', document.getElementById('addProductCategory').value);
    formData.append('description', document.getElementById('addProductDescription').value);
    formData.append('image', document.getElementById('addProductImage').value);

    try {
        const response = await fetch('admin_add_product.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            showNotification('Product added successfully', 'success');
            closeAllModals();
            document.getElementById('addProductForm').reset();
            await loadProducts();
            await loadDashboardStats();
        } else {
            showNotification(data.message || 'Failed to add product', 'error');
        }
    } catch (error) {
        console.error('Add error:', error);
        showNotification('An error occurred', 'error');
    }
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

    const formData = new FormData();
    formData.append('product_id', productId);

    try {
        const response = await fetch('admin_delete_product.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            showNotification('Product deleted successfully', 'success');
            await loadProducts();
            await loadDashboardStats();
        } else {
            showNotification(data.message || 'Delete failed', 'error');
        }
    } catch (error) {
        console.error('Delete error:', error);
        showNotification('An error occurred', 'error');
    }
}

async function toggleUserStatus(userId, currentStatus) {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) return;

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('status', currentStatus ? 0 : 1);

    try {
        const response = await fetch('admin_toggle_user.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            showNotification('User status updated successfully', 'success');
            await loadUsers();
            await loadDashboardStats();
        } else {
            showNotification(data.message || 'Update failed', 'error');
        }
    } catch (error) {
        console.error('Toggle error:', error);
        showNotification('An error occurred', 'error');
    }
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    const formData = new FormData();
    formData.append('user_id', userId);

    try {
        const response = await fetch('admin_delete_user.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            showNotification('User deleted successfully', 'success');
            await loadUsers();
            await loadDashboardStats();
        } else {
            showNotification(data.message || 'Delete failed', 'error');
        }
    } catch (error) {
        console.error('Delete error:', error);
        showNotification('An error occurred', 'error');
    }
}

function openAddProductModal() {
    document.getElementById('addProductModal').classList.add('active');
}

function switchSection(section) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-section="${section}"]`).classList.add('active');

    document.querySelectorAll('.admin-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(section).classList.add('active');

    const titles = {
        dashboard: 'Dashboard',
        users: 'User Management',
        products: 'Product Management',
        orders: 'Order Management'
    };
    document.getElementById('pageTitle').textContent = titles[section];

    if (section === 'dashboard') {
        loadDashboardStats();
    } else if (section === 'products') {
        loadProducts();
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

async function logout() {
    if (confirm('Are you sure you want to logout?')) {
        try {
            await fetch('admin_logout.php');
            window.location.href = 'admin-login.html';
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = 'admin-login.html';
        }
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;

    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#ff6b35'
    };

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
