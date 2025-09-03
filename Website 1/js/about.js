document.addEventListener('DOMContentLoaded', function () {
    // Animate counters in hero stats
    function animateCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');

        statNumbers.forEach(stat => {
            const target = stat.textContent;
            const isPercentage = target.includes('%');
            const isDecimal = target.includes('.');
            const hasPlus = target.includes('+');

            let endValue;
            let suffix = '';

            if (isPercentage) {
                endValue = parseFloat(target.replace('%', ''));
                suffix = '%';
            } else if (target.includes('K')) {
                endValue = parseFloat(target.replace('K+', '').replace('K', ''));
                suffix = hasPlus ? 'K+' : 'K';
            } else if (target.includes('M')) {
                endValue = parseFloat(target.replace('M+', '').replace('M', ''));
                suffix = hasPlus ? 'M+' : 'M';
            } else {
                endValue = parseInt(target.replace('+', ''));
                suffix = hasPlus ? '+' : '';
            }

            let currentValue = 0;
            const increment = endValue / 100;
            const timer = setInterval(() => {
                currentValue += increment;

                if (currentValue >= endValue) {
                    stat.textContent = endValue + suffix;
                    clearInterval(timer);
                } else {
                    if (isDecimal) {
                        stat.textContent = currentValue.toFixed(1) + suffix;
                    } else {
                        stat.textContent = Math.floor(currentValue) + suffix;
                    }
                }
            }, 20);
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');

                // Trigger counter animation for hero stats
                if (entry.target.classList.contains('hero-stats')) {
                    setTimeout(animateCounters, 500);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.hero-stats, .story-content, .mission-card, .team-member, .culture-item');
    animateElements.forEach(el => observer.observe(el));

    // Add animation classes to CSS
    const style = document.createElement('style');
    style.textContent = `
        .hero-stats,
        .story-content,
        .mission-card,
        .team-member,
        .culture-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease;
        }
        
        .hero-stats.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .story-content.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .mission-card.animate,
        .team-member.animate,
        .culture-item.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .mission-card.animate {
            animation-delay: 0.2s;
        }
        
        .team-member.animate {
            animation-delay: 0.1s;
        }
        
        .culture-item.animate {
            animation-delay: 0.15s;
        }
    `;
    document.head.appendChild(style);

    // Initialize cart count
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('bytebazaar_cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add hover effects to team member social links
    const socialLinks = document.querySelectorAll('.member-overlay .social-links a');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });

        link.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Initialize page
    updateCartCount();
});
