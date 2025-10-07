document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('adminLoginForm');
    const passwordToggle = document.querySelector('.password-toggle');
    const passwordInput = document.getElementById('admin-password');

    // Password toggle
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function () {
            const icon = this.querySelector('i');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }

    // Login form submission
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = document.getElementById('admin-email').value;
        const password = document.getElementById('admin-password').value;

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        try {
            const response = await fetch('admin_login.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                showNotification('Login successful!');
                setTimeout(() => {
                    window.location.href = 'admin-dashboard.html';
                }, 1000);
            } else {
                showNotification(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('An error occurred. Please try again.');
        }
    });
});

function showNotification(message) {
    const notification = document.createElement('div');
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
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}
