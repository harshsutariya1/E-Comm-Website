document.addEventListener('DOMContentLoaded', function () {
    // Utility function to show error messages
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        let errorElement = formGroup.querySelector('.error-message');

        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.cssText = `
                color: #e74c3c;
                font-size: 0.85rem;
                margin-top: 5px;
                font-weight: 500;
            `;
            formGroup.appendChild(errorElement);
        }

        errorElement.textContent = message;
        input.style.borderColor = '#e74c3c';
    }

    // Utility function to clear error messages
    function clearError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');

        if (errorElement) {
            errorElement.remove();
        }

        input.style.borderColor = '';
    }

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Real-time validation for inputs
    function addRealTimeValidation(input, validator, errorMessage) {
        input.addEventListener('blur', function () {
            if (this.value.trim() === '') {
                showError(this, `${this.placeholder || 'This field'} is required`);
            } else if (validator && !validator(this.value)) {
                showError(this, errorMessage);
            } else {
                clearError(this);
            }
        });

        input.addEventListener('input', function () {
            if (this.value.trim() !== '') {
                clearError(this);
            }
        });
    }

    // Login Form Validation and Submission
    const loginForm = document.querySelector('#loginForm form');
    if (loginForm) {
        const loginEmail = document.getElementById('login-email');
        const loginPassword = document.getElementById('login-password');

        // Add real-time validation
        addRealTimeValidation(loginEmail, isValidEmail, 'Please enter a valid email address');
        addRealTimeValidation(loginPassword, null, 'Password is required');

        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let isValid = true;

            // Validate email
            if (loginEmail.value.trim() === '') {
                showError(loginEmail, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(loginEmail.value)) {
                showError(loginEmail, 'Please enter a valid email address');
                isValid = false;
            } else {
                clearError(loginEmail);
            }

            // Validate password
            if (loginPassword.value.trim() === '') {
                showError(loginPassword, 'Password is required');
                isValid = false;
            } else {
                clearError(loginPassword);
            }

            if (isValid) {
                // Prepare form data
                const formData = new FormData();
                formData.append('email', loginEmail.value.trim());
                formData.append('password', loginPassword.value);

                // Send AJAX request
                fetch('../api/login.php', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            showNotification(data.message);
                            setTimeout(() => {
                                window.location.href = 'index.html';
                            }, 1500);
                        } else {
                            showNotification(data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        showNotification('An error occurred. Please try again.');
                    });
            }
        });
    }

    // Password toggle functionality
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
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
