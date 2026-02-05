// ================================================
// QuranPath Institute - Email via EmailJS
// ================================================
// Configure EmailJS: https://dashboard.emailjs.com/
// 1. Create Gmail service (use App Password)
// 2. Create template with {{form_name}} and {{email_body}}
// 3. Set the IDs below
// ================================================

const EMAILJS_CONFIG = {
    publicKey: 'YOUR_PUBLIC_KEY',
    serviceID: 'YOUR_SERVICE_ID',
    templateID: 'YOUR_TEMPLATE_ID'
};

async function sendEmailViaEmailJS(formName, emailBody) {
    if (typeof emailjs === 'undefined') {
        throw new Error('EmailJS script not loaded. Add the CDN script before script.js');
    }
    if (
        !EMAILJS_CONFIG.publicKey ||
        EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY' ||
        !EMAILJS_CONFIG.serviceID ||
        !EMAILJS_CONFIG.templateID
    ) {
        throw new Error('Configure EMAILJS_CONFIG in script.js with your EmailJS credentials');
    }
    const response = await emailjs.send(
        EMAILJS_CONFIG.serviceID,
        EMAILJS_CONFIG.templateID,
        { form_name: formName, email_body: emailBody },
        EMAILJS_CONFIG.publicKey
    );
    if (response.status !== 200) {
        throw new Error(response.text || 'Email service error');
    }
    return response;
}

document.addEventListener('DOMContentLoaded', () => {
    
    // ================================================
    // Toaster Notification System
    // ================================================
    
    // Create toaster container if it doesn't exist
    let toasterContainer = document.querySelector('.toaster-container');
    if (!toasterContainer) {
        toasterContainer = document.createElement('div');
        toasterContainer.className = 'toaster-container';
        document.body.appendChild(toasterContainer);
    }
    
    // Toaster function
    window.showToast = function(options) {
        const {
            type = 'success', // success, error, warning, info
            title = '',
            message = '',
            duration = 5000, // 5 seconds default
            showProgress = true
        } = options;
        
        // Icon mapping
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        // Default titles
        const defaultTitles = {
            success: 'Success!',
            error: 'Error!',
            warning: 'Warning!',
            info: 'Information'
        };
        
        // Create toaster element
        const toaster = document.createElement('div');
        toaster.className = `toaster ${type}`;
        toaster.innerHTML = `
            <div class="toaster-icon">
                <i class="fas ${icons[type]}"></i>
            </div>
            <div class="toaster-content">
                <div class="toaster-title">${title || defaultTitles[type]}</div>
                <p class="toaster-message">${message}</p>
            </div>
            <button class="toaster-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
            ${showProgress ? `
            <div class="toaster-progress">
                <div class="toaster-progress-bar"></div>
            </div>
            ` : ''}
        `;
        
        // Add to container
        toasterContainer.appendChild(toaster);
        
        // Trigger animation
        requestAnimationFrame(() => {
            toaster.classList.add('show');
        });
        
        // Progress bar animation
        if (showProgress) {
            const progressBar = toaster.querySelector('.toaster-progress-bar');
            if (progressBar) {
                progressBar.style.transition = `transform ${duration}ms linear`;
                requestAnimationFrame(() => {
                    progressBar.style.transform = 'scaleX(0)';
                });
            }
        }
        
        // Close function
        const closeToaster = () => {
            toaster.classList.remove('show');
            toaster.classList.add('hide');
            setTimeout(() => {
                if (toaster.parentNode) {
                    toaster.parentNode.removeChild(toaster);
                }
            }, 400);
        };
        
        // Close button event
        const closeBtn = toaster.querySelector('.toaster-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeToaster);
        }
        
        // Auto close after duration
        const autoCloseTimer = setTimeout(closeToaster, duration);
        
        // Pause on hover
        toaster.addEventListener('mouseenter', () => {
            clearTimeout(autoCloseTimer);
            const progressBar = toaster.querySelector('.toaster-progress-bar');
            if (progressBar) {
                progressBar.style.animationPlayState = 'paused';
                progressBar.style.transition = 'none';
            }
        });
        
        toaster.addEventListener('mouseleave', () => {
            setTimeout(closeToaster, 1000); // Close 1 second after mouse leaves
        });
        
        return toaster;
    };
    
    // Shorthand functions
    window.toastSuccess = (message, title) => showToast({ type: 'success', message, title });
    window.toastError = (message, title) => showToast({ type: 'error', message, title });
    window.toastWarning = (message, title) => showToast({ type: 'warning', message, title });
    window.toastInfo = (message, title) => showToast({ type: 'info', message, title });
    
    // ================================================
    // Welcome Popup Functionality
    // ================================================
    const welcomePopup = document.getElementById('welcomePopup');
    const closeWelcomeBtn = document.getElementById('closeWelcomePopup');
    const skipWelcomeBtn = document.getElementById('skipWelcomePopup');
    
    // Show popup after a short delay when page loads
    if (welcomePopup) {
        // Check if popup was already shown in this session
        const popupShown = sessionStorage.getItem('welcomePopupShown');
        
        if (!popupShown) {
            setTimeout(() => {
                welcomePopup.classList.add('active');
                document.body.style.overflow = 'hidden';
            }, 1500); // Show after 1.5 seconds
        }
    }
    
    // Close popup function
    function closeWelcomePopup() {
        if (welcomePopup) {
            welcomePopup.classList.remove('active');
            document.body.style.overflow = '';
            // Mark as shown for this session
            sessionStorage.setItem('welcomePopupShown', 'true');
        }
    }
    
    // Close button click
    if (closeWelcomeBtn) {
        closeWelcomeBtn.addEventListener('click', closeWelcomePopup);
    }
    
    // Skip/Maybe Later click
    if (skipWelcomeBtn) {
        skipWelcomeBtn.addEventListener('click', closeWelcomePopup);
    }
    
    // Close on overlay click (outside popup)
    if (welcomePopup) {
        welcomePopup.addEventListener('click', (e) => {
            if (e.target === welcomePopup) {
                closeWelcomePopup();
            }
        });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && welcomePopup && welcomePopup.classList.contains('active')) {
            closeWelcomePopup();
        }
    });
    
    // Close popup when clicking CTA button (navigates to registration)
    const welcomeCTA = welcomePopup ? welcomePopup.querySelector('.welcome-popup-cta') : null;
    if (welcomeCTA) {
        welcomeCTA.addEventListener('click', () => {
            sessionStorage.setItem('welcomePopupShown', 'true');
        });
    }
    
    // ================================================
    // Student Registration Form – submission handled by emailjs.js (sendForm)
    // ================================================
    const studentRegistrationForm = document.getElementById('studentRegistrationForm');
    if (studentRegistrationForm) {
        const formInputs = studentRegistrationForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                const formGroup = this.closest('.form-group');
                if (formGroup) formGroup.classList.remove('error');
            });
            input.addEventListener('change', function() {
                const formGroup = this.closest('.form-group');
                if (formGroup) formGroup.classList.remove('error');
            });
        });
    }

    // ================================================
    // Left Side Message Widget Functionality
    // ================================================
    const messageToggleBtn = document.getElementById('messageToggleBtn');
    const messageChatBox = document.getElementById('messageChatBox');
    const closeMessageChat = document.getElementById('closeMessageChat');
    const quickOptionBtns = document.querySelectorAll('.quick-option-btn');
    const msgWidgetForm = document.getElementById('message-widget-form');
    const msgUserName = msgWidgetForm ? msgWidgetForm.querySelector('[name="name"]') : null;
    const msgUserEmail = msgWidgetForm ? msgWidgetForm.querySelector('[name="email"]') : null;
    const msgUserMessage = msgWidgetForm ? msgWidgetForm.querySelector('[name="message"]') : null;
    const msgSendWhatsApp = document.getElementById('msgSendWhatsApp');
    const msgSendEmail = document.getElementById('msgSendEmail');
    
    // Toggle Message Chat Box
    if (messageToggleBtn && messageChatBox) {
        messageToggleBtn.addEventListener('click', () => {
            messageChatBox.classList.toggle('active');
            messageToggleBtn.classList.toggle('active');
            
            // Hide notification badge when opened
            const badge = messageToggleBtn.querySelector('.notification-badge');
            if (badge && messageChatBox.classList.contains('active')) {
                badge.style.display = 'none';
            }
        });
    }
    
    // Close Message Chat Box
    if (closeMessageChat && messageChatBox) {
        closeMessageChat.addEventListener('click', () => {
            messageChatBox.classList.remove('active');
            messageToggleBtn.classList.remove('active');
        });
    }
    
    // Quick Option Buttons
    quickOptionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove selected from all
            quickOptionBtns.forEach(b => b.classList.remove('selected'));
            // Add selected to clicked
            btn.classList.add('selected');
            // Update message textarea
            if (msgUserMessage) {
                msgUserMessage.value = btn.getAttribute('data-message');
                msgUserMessage.focus();
            }
        });
    });
    
    // Send via WhatsApp
    if (msgSendWhatsApp) {
        msgSendWhatsApp.addEventListener('click', (e) => {
            e.preventDefault();
            
            const name = msgUserName ? msgUserName.value.trim() : '';
            const message = msgUserMessage ? msgUserMessage.value.trim() : '';
            
            // Compose message with name if provided
            let fullMessage = message;
            if (name) {
                fullMessage = `Hi, my name is ${name}. ${message}`;
            }
            
            if (!fullMessage) {
                if (msgUserMessage) {
                    msgUserMessage.style.borderColor = '#e74c3c';
                    msgUserMessage.focus();
                    setTimeout(() => {
                        msgUserMessage.style.borderColor = '';
                    }, 2000);
                }
                return;
            }
            
            // WhatsApp number for USA and UK
            const whatsappNumber = '447836372841';
            const encodedMessage = encodeURIComponent(fullMessage);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            window.open(whatsappUrl, '_blank');
        });
    }
    
    // Send via Email
    if (msgSendEmail) {
        msgSendEmail.addEventListener('click', (e) => {
            e.preventDefault();
            
            const name = msgUserName ? msgUserName.value.trim() : '';
            const email = msgUserEmail ? msgUserEmail.value.trim() : '';
            const message = msgUserMessage ? msgUserMessage.value.trim() : '';
            
            if (!message) {
                if (msgUserMessage) {
                    msgUserMessage.style.borderColor = '#e74c3c';
                    msgUserMessage.focus();
                    setTimeout(() => {
                        msgUserMessage.style.borderColor = '';
                    }, 2000);
                }
                return;
            }
            
            // Create email body
            let emailBody = message;
            if (name) {
                emailBody += `\n\nFrom: ${name}`;
            }
            if (email) {
                emailBody += `\nEmail: ${email}`;
            }
            
            const subject = 'Inquiry from QuranPath Website';
            const mailtoUrl = `mailto:info@quranpath.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
            
            window.location.href = mailtoUrl;
        });
    }
    
    // Message widget form submit is handled by emailjs.js (sends email to you)
    // On success, emailjs.js shows toast and resets form; optionally close widget
    if (msgWidgetForm) {
        msgWidgetForm.addEventListener('submit', function() {
            setTimeout(function() {
                if (messageChatBox && messageChatBox.classList.contains('active')) {
                    messageChatBox.classList.remove('active');
                    if (messageToggleBtn) messageToggleBtn.classList.remove('active');
                }
            }, 1500);
        });
    }

    // Reset field border on input
    [msgUserName, msgUserEmail, msgUserMessage].forEach(field => {
        if (field) {
            field.addEventListener('input', () => {
                field.style.borderColor = '';
            });
        }
    });
    
    // Close message chat on outside click
    document.addEventListener('click', (e) => {
        const widget = document.getElementById('messageWidget');
        if (widget && messageChatBox && messageChatBox.classList.contains('active')) {
            if (!widget.contains(e.target)) {
                messageChatBox.classList.remove('active');
                messageToggleBtn.classList.remove('active');
            }
        }
    });
    
    // ================================================
    // WhatsApp Widget Functionality
    // ================================================
    const whatsappToggleBtn = document.getElementById('whatsappToggleBtn');
    const whatsappChatBox = document.getElementById('whatsappChatBox');
    const closeWhatsappChat = document.getElementById('closeWhatsappChat');
    const countryBtns = document.querySelectorAll('.country-btn');
    const sendWhatsappBtn = document.getElementById('sendWhatsappMessage');
    const whatsappMessageInput = document.getElementById('whatsappMessage');
    
    let selectedCountryNumber = '447836372841'; // UK/USA number
    
    // Toggle WhatsApp Chat Box
    if (whatsappToggleBtn && whatsappChatBox) {
        whatsappToggleBtn.addEventListener('click', () => {
            whatsappChatBox.classList.toggle('active');
            whatsappToggleBtn.classList.toggle('active');
        });
    }
    
    // Close WhatsApp Chat Box
    if (closeWhatsappChat && whatsappChatBox) {
        closeWhatsappChat.addEventListener('click', () => {
            whatsappChatBox.classList.remove('active');
            whatsappToggleBtn.classList.remove('active');
        });
    }
    
    // Country Selection
    countryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove selected from all
            countryBtns.forEach(b => b.classList.remove('selected'));
            // Add selected to clicked
            btn.classList.add('selected');
            // Update selected number
            selectedCountryNumber = btn.getAttribute('data-number');
        });
    });
    
    // Send WhatsApp Message
    if (sendWhatsappBtn) {
        sendWhatsappBtn.addEventListener('click', () => {
            const message = whatsappMessageInput ? whatsappMessageInput.value.trim() : '';
            
            if (!message) {
                // Highlight textarea if empty
                if (whatsappMessageInput) {
                    whatsappMessageInput.style.borderColor = '#e74c3c';
                    whatsappMessageInput.focus();
                    setTimeout(() => {
                        whatsappMessageInput.style.borderColor = '';
                    }, 2000);
                }
                return;
            }
            
            // Encode message for URL
            const encodedMessage = encodeURIComponent(message);
            
            // Create WhatsApp URL
            const whatsappUrl = `https://wa.me/${selectedCountryNumber}?text=${encodedMessage}`;
            
            // Open WhatsApp in new tab/app
            window.open(whatsappUrl, '_blank');
            
            // Close chat box after sending
            setTimeout(() => {
                if (whatsappChatBox) whatsappChatBox.classList.remove('active');
                if (whatsappToggleBtn) whatsappToggleBtn.classList.remove('active');
            }, 500);
        });
    }
    
    // Close chat box on outside click
    document.addEventListener('click', (e) => {
        const widget = document.getElementById('whatsappWidget');
        if (widget && whatsappChatBox && whatsappChatBox.classList.contains('active')) {
            if (!widget.contains(e.target)) {
                whatsappChatBox.classList.remove('active');
                whatsappToggleBtn.classList.remove('active');
            }
        }
    });
    
    // ================================================
    // Mobile Navigation Toggle
    // ================================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 992) {
                    mobileMenuToggle.classList.remove('active');
                    mainNav.classList.remove('active');
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 992) {
                if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    mobileMenuToggle.classList.remove('active');
                    mainNav.classList.remove('active');
                }
            }
        });
    }
    
    // ================================================
    // Pricing Toggle Functionality
    // ================================================
    const pricingToggleButtons = document.querySelectorAll('.btn-pricing');
    const ukPlans = document.querySelector('.uk-plans');
    const usPlans = document.querySelector('.us-plans');

    if (pricingToggleButtons.length > 0 && ukPlans && usPlans) {
        pricingToggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                pricingToggleButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                const currency = button.dataset.currency;
                if (currency === 'uk') {
                    ukPlans.classList.add('active');
                    usPlans.classList.remove('active');
                } else {
                    usPlans.classList.add('active');
                    ukPlans.classList.remove('active');
                }
            });
        });
    }

    // ================================================
    // Auto-scrolling Slider Logic
    // ================================================
    function setupAutoScrollSlider(sliderSelector, cardSelector, interval = 3000) {
        const slider = document.querySelector(sliderSelector);
        if (!slider) return;

        let scrollInterval;
        let isUserInteracting = false;

        const startScrolling = () => {
            if (isUserInteracting) return;
            
            scrollInterval = setInterval(() => {
                const cards = slider.querySelectorAll(cardSelector);
                if (cards.length === 0) return;

                const computedStyle = getComputedStyle(slider);
                const gap = parseInt(computedStyle.gap) || 30;
                const cardWidth = cards[0].offsetWidth + gap;
                const maxScroll = slider.scrollWidth - slider.clientWidth;

                if (slider.scrollLeft >= maxScroll - 5) {
                    // Smooth scroll back to start
                    slider.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
                }
            }, interval);
        };

        const stopScrolling = () => {
            clearInterval(scrollInterval);
        };

        // Start auto-scrolling
        startScrolling();

        // Pause on hover
        slider.addEventListener('mouseenter', () => {
            isUserInteracting = true;
            stopScrolling();
        });
        
        slider.addEventListener('mouseleave', () => {
            isUserInteracting = false;
            startScrolling();
        });

        // Pause on touch
        slider.addEventListener('touchstart', () => {
            isUserInteracting = true;
            stopScrolling();
        }, { passive: true });
        
        slider.addEventListener('touchend', () => {
            setTimeout(() => {
                isUserInteracting = false;
                startScrolling();
            }, 3000); // Resume after 3 seconds of no interaction
        }, { passive: true });
    }

    // Setup auto-scrolling for Faculty Slider
    setupAutoScrollSlider('.faculty-slider-container', '.faculty-card', 4000);

    // Setup auto-scrolling for Testimonial Slider
    setupAutoScrollSlider('.testimonial-slider', '.testimonial-card', 5000);

    // ================================================
    // Smooth Scroll for Anchor Links
    // ================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ================================================
    // Header Scroll Effect
    // ================================================
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    if (header) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
            }
            
            lastScrollTop = scrollTop;
        }, { passive: true });
    }

    // Contact form submission is handled by emailjs.js (id="contact-form")

    // ================================================
    // Newsletter Form
    // ================================================
    const newsletterForms = document.querySelectorAll('.newsletter-signup form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            if (emailInput.value) {
                submitBtn.textContent = 'Subscribed!';
                submitBtn.disabled = true;
                
                // Show success toaster
                showToast({
                    type: 'success',
                    title: 'Subscribed!',
                    message: 'Thank you for subscribing to our newsletter. Stay tuned for updates!',
                    duration: 4000
                });
                
                setTimeout(() => {
                    emailInput.value = '';
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    });

    // ================================================
    // Intersection Observer for Animations
    // ================================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    const elementsToAnimate = document.querySelectorAll(
        '.course-card, .step-card, .plan-card, .faculty-card, .testimonial-card, .feature-card, .contact-info-card'
    );
    
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // ================================================
    // Dropdown Touch Support for Mobile
    // ================================================
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        const content = dropdown.querySelector('.dropdown-content');
        
        if (link && content && window.innerWidth <= 992) {
            link.addEventListener('click', function(e) {
                // On mobile, toggle dropdown instead of navigating
                if (content.style.display === 'block') {
                    content.style.display = 'none';
                } else {
                    // Close all other dropdowns first
                    dropdowns.forEach(d => {
                        const c = d.querySelector('.dropdown-content');
                        if (c) c.style.display = 'none';
                    });
                    content.style.display = 'block';
                }
                e.preventDefault();
            });
        }
    });

    // ================================================
    // Policy Modals (Terms, Refund, Privacy)
    // ================================================
    document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
                if (mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
                }
            }
        });
    });

    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.getAttribute('data-close');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });
    });

    // Close policy modal on overlay click
    document.querySelectorAll('.policy-modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                this.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });
    });

    // Close policy modal on Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.policy-modal-overlay.active').forEach(modal => {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            });
        }
    });

    // Inline links inside modals that open another modal: close current then open target
    document.querySelectorAll('.policy-modal-body [data-modal]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const openModal = this.closest('.policy-modal-overlay');
            const targetId = this.getAttribute('data-modal');
            const targetModal = document.getElementById(targetId);
            if (openModal) {
                openModal.classList.remove('active');
                openModal.setAttribute('aria-hidden', 'true');
            }
            if (targetModal) {
                targetModal.classList.add('active');
                targetModal.setAttribute('aria-hidden', 'false');
            }
        });
    });
});

// ================================================
// Utility Functions
// ================================================

// Debounce function for performance optimization
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

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
