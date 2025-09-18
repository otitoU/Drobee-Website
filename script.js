// Drobee Landing Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Waitlist form handling
    initWaitlistForm();
    
    // Image lazy loading
    initLazyLoading();
    
    // Mobile menu functionality
    initMobileMenu();
    
    // Intersection Observer for animations
    initScrollAnimations();
    
    // Analytics tracking
    initAnalytics();
});

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                // Check for reduced motion preference
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                
                target.scrollIntoView({
                    behavior: prefersReducedMotion ? 'auto' : 'smooth',
                    block: 'start'
                });
                
                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }
            }
        });
    });
}

/**
 * Handle waitlist form submission
 */
function initWaitlistForm() {
    const form = document.getElementById('waitlist-form');
    const successMsg = document.getElementById('form-success');
    const errorMsg = document.getElementById('form-error');
    const submitButton = form.querySelector('button[type="submit"]');
    
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = form.querySelector('input[type="email"]').value.trim();
        const originalButtonText = submitButton.textContent;
        
        // Basic email validation
        if (!isValidEmail(email)) {
            showFormMessage(errorMsg, 'Please enter a valid email address.');
            return;
        }
        
        // Show loading state
        submitButton.textContent = 'Joining...';
        submitButton.disabled = true;
        
        // Hide previous messages
        hideFormMessages();
        
        // Simulate API call - replace with actual endpoint
        simulateFormSubmission(email)
            .then(() => {
                showFormMessage(successMsg, 'Thanks! We\'ll email you when Drobee is ready.');
                form.reset();
                
                // Track successful signup
                trackEvent('waitlist_signup', { email: email });
            })
            .catch(() => {
                showFormMessage(errorMsg, 'Something went wrong. Please try again.');
            })
            .finally(() => {
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
    });
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show form message
 */
function showFormMessage(element, message) {
    element.textContent = message;
    element.classList.remove('hidden');
}

/**
 * Hide all form messages
 */
function hideFormMessages() {
    document.getElementById('form-success').classList.add('hidden');
    document.getElementById('form-error').classList.add('hidden');
}

/**
 * Simulate form submission - replace with actual API call
 */
function simulateFormSubmission(email) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success/failure
            if (Math.random() > 0.1) { // 90% success rate for demo
                resolve();
            } else {
                reject(new Error('Submission failed'));
            }
        }, 1000);
    });
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const menuButton = document.querySelector('[aria-label="Open menu"]');
    if (!menuButton) return;
    
    // This is a placeholder - you'd implement actual mobile menu logic here
    menuButton.addEventListener('click', function() {
        console.log('Mobile menu clicked - implement navigation menu');
        // Example: Toggle mobile navigation
        // const mobileNav = document.getElementById('mobile-nav');
        // mobileNav.classList.toggle('hidden');
    });
}

/**
 * Initialize scroll animations using Intersection Observer
 */
function initScrollAnimations() {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Add animation to key sections
    document.querySelectorAll('section').forEach(section => {
        animateOnScroll.observe(section);
    });
}

/**
 * Initialize analytics tracking
 */
function initAnalytics() {
    // Track page view
    trackEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href
    });
    
    // Track CTA button clicks
    document.querySelectorAll('button').forEach(button => {
        if (button.textContent.includes('Get the app') || 
            button.textContent.includes('Try free preview') ||
            button.textContent.includes('Start free') ||
            button.textContent.includes('Upgrade to Pro')) {
            
            button.addEventListener('click', function() {
                trackEvent('cta_click', {
                    button_text: this.textContent.trim(),
                    button_location: this.closest('section')?.className || 'unknown'
                });
            });
        }
    });
    
    // Track demo video clicks
    document.querySelectorAll('a[href*="demo"]').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('demo_click', {
                link_text: this.textContent.trim()
            });
        });
    });
}

/**
 * Track events (placeholder - replace with your analytics service)
 */
function trackEvent(eventName, properties = {}) {
    // Example implementations:
    
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    
    // Mixpanel
    if (typeof mixpanel !== 'undefined') {
        mixpanel.track(eventName, properties);
    }
    
    // Custom analytics
    console.log('Analytics Event:', eventName, properties);
    
    // You could also send to your own analytics endpoint:
    // fetch('/api/analytics', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ event: eventName, properties })
    // });
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for testing (if in module environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        trackEvent,
        debounce,
        throttle
    };
}