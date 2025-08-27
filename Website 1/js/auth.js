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

    // Password strength validation
    function isValidPassword(password) {
        // At least 8 characters, one uppercase, one lowercase, one number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
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

    // Login Form Validation
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
                // Simulate login process
                showNotification('Login successful! Welcome back.');

                // Redirect after a short delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }
        });
    }

    // Register Form Validation
    const registerForm = document.querySelector('#registerForm form');
    if (registerForm) {
        const firstName = document.getElementById('first-name');
        const lastName = document.getElementById('last-name');
        const registerEmail = document.getElementById('register-email');
        const registerPassword = document.getElementById('register-password');
        const confirmPassword = document.getElementById('confirm-password');
        const termsCheckbox = document.querySelector('#registerForm input[type="checkbox"]');

        // Add real-time validation
        addRealTimeValidation(firstName, (value) => value.length >= 2, 'First name must be at least 2 characters');
        addRealTimeValidation(lastName, (value) => value.length >= 2, 'Last name must be at least 2 characters');
        addRealTimeValidation(registerEmail, isValidEmail, 'Please enter a valid email address');
        addRealTimeValidation(registerPassword, isValidPassword, 'Password must be at least 8 characters with uppercase, lowercase, and number');

        confirmPassword.addEventListener('blur', function () {
            if (this.value !== registerPassword.value) {
                showError(this, 'Passwords do not match');
            } else if (this.value.trim() === '') {
                showError(this, 'Please confirm your password');
            } else {
                clearError(this);
            }
        });

        confirmPassword.addEventListener('input', function () {
            if (this.value === registerPassword.value && this.value.trim() !== '') {
                clearError(this);
            }
        });

        registerPassword.addEventListener('input', function () {
            if (confirmPassword.value !== '' && confirmPassword.value !== this.value) {
                showError(confirmPassword, 'Passwords do not match');
            } else if (confirmPassword.value !== '' && confirmPassword.value === this.value) {
                clearError(confirmPassword);
            }
        });

        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let isValid = true;

            // Validate first name
            if (firstName.value.trim() === '') {
                showError(firstName, 'First name is required');
                isValid = false;
            } else if (firstName.value.trim().length < 2) {
                showError(firstName, 'First name must be at least 2 characters');
                isValid = false;
            } else {
                clearError(firstName);
            }

            // Validate last name
            if (lastName.value.trim() === '') {
                showError(lastName, 'Last name is required');
                isValid = false;
            } else if (lastName.value.trim().length < 2) {
                showError(lastName, 'Last name must be at least 2 characters');
                isValid = false;
            } else {
                clearError(lastName);
            }

            // Validate email
            if (registerEmail.value.trim() === '') {
                showError(registerEmail, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(registerEmail.value)) {
                showError(registerEmail, 'Please enter a valid email address');
                isValid = false;
            } else {
                clearError(registerEmail);
            }

            // Validate password
            if (registerPassword.value.trim() === '') {
                showError(registerPassword, 'Password is required');
                isValid = false;
            } else if (!isValidPassword(registerPassword.value)) {
                showError(registerPassword, 'Password must be at least 8 characters with uppercase, lowercase, and number');
                isValid = false;
            } else {
                clearError(registerPassword);
            }

            // Validate confirm password
            if (confirmPassword.value.trim() === '') {
                showError(confirmPassword, 'Please confirm your password');
                isValid = false;
            } else if (confirmPassword.value !== registerPassword.value) {
                showError(confirmPassword, 'Passwords do not match');
                isValid = false;
            } else {
                clearError(confirmPassword);
            }

            // Validate terms checkbox
            if (!termsCheckbox.checked) {
                showError(termsCheckbox, 'You must agree to the terms and conditions');
                isValid = false;
            } else {
                clearError(termsCheckbox);
            }

            if (isValid) {
                // Simulate registration process
                showNotification('Account created successfully! Welcome to ByteBazaar.');

                // Redirect after a short delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
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
