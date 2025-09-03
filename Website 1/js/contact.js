document.addEventListener('DOMContentLoaded', function () {
    // DOM elements
    const contactForm = document.getElementById('contactForm');
    const faqItems = document.querySelectorAll('.faq-item');

    // Form validation patterns
    const patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\+]?[1-9][\d]{0,15}$/
    };

    // Initialize page
    initializeFAQ();
    initializeFormValidation();

    // FAQ functionality
    function initializeFAQ() {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                // Close other open FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle current item
                item.classList.toggle('active');
            });
        });
    }

    // Form validation and submission
    function initializeFormValidation() {
        if (!contactForm) return;

        const inputs = contactForm.querySelectorAll('input, select, textarea');
        const submitBtn = contactForm.querySelector('.submit-btn');

        // Add real-time validation
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateField(input);
                }
            });
        });

        // Handle form submission
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Validate individual field
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const formGroup = field.closest('.form-group');
        let isValid = true;
        let errorMessage = '';

        // Remove existing error/success classes
        formGroup.classList.remove('error', 'success');
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `${getFieldLabel(fieldName)} is required`;
        }
        // Email validation
        else if (fieldName === 'email' && value && !patterns.email.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
        // Phone validation (if provided)
        else if (fieldName === 'phone' && value && !patterns.phone.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
        // Message length validation
        else if (fieldName === 'message' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long';
        }

        // Apply validation result
        if (!isValid) {
            formGroup.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errorMessage;
            formGroup.appendChild(errorDiv);
        } else if (value) {
            formGroup.classList.add('success');
        }

        return isValid;
    }

    // Get user-friendly field label
    function getFieldLabel(fieldName) {
        const labels = {
            firstName: 'First name',
            lastName: 'Last name',
            email: 'Email address',
            phone: 'Phone number',
            subject: 'Subject',
            message: 'Message'
        };
        return labels[fieldName] || fieldName;
    }

    // Handle form submission
    function handleFormSubmit(e) {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('.submit-btn');
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        let isFormValid = true;

        // Validate all fields
        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            showNotification('Please correct the errors below and try again.', 'error');
            return;
        }

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<i class="fas fa-spinner"></i> Sending...';

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Reset loading state
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';

            // Show success message
            showNotification('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');

            // Reset form
            contactForm.reset();

            // Remove all validation classes
            inputs.forEach(input => {
                const formGroup = input.closest('.form-group');
                formGroup.classList.remove('error', 'success');
                const errorMessage = formGroup.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
            });

        }, 2000);
    }

    // Enhanced notification function
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        const bgColors = {
            success: '#27ae60',
            error: '#e74c3c',
            info: '#ff6b35'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColors[type] || bgColors.info};
            color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 3000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.4s ease;
            max-width: 400px;
            border-left: 4px solid rgba(255, 255, 255, 0.3);
        `;

        const notificationContent = notification.querySelector('.notification-content');
        notificationContent.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
        `;

        const icon = notification.querySelector('i');
        icon.style.cssText = `
            font-size: 1.2rem;
            flex-shrink: 0;
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
            }, 400);
        }, 5000);
    }

    // Get icon for notification type
    function getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    // Initialize cart count
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('bytebazaar_cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    }

    // Initialize page
    updateCartCount();
});
