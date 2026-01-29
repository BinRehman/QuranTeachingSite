// ================================================
// QuranPath Institute - Main JavaScript
// ================================================

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
    // Student Registration Form (Registration Page)
    // ================================================
    const studentRegistrationForm = document.getElementById('studentRegistrationForm');
    
    if (studentRegistrationForm) {
        studentRegistrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            let isValid = true;
            const requiredFields = this.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                const formGroup = field.closest('.form-group');
                if (!field.value || (field.type === 'checkbox' && !field.checked)) {
                    if (formGroup) formGroup.classList.add('error');
                    isValid = false;
                } else {
                    if (formGroup) formGroup.classList.remove('error');
                }
            });
            
            // Email validation
            const emailField = this.querySelector('#email');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    emailField.closest('.form-group').classList.add('error');
                    isValid = false;
                }
            }
            
            if (!isValid) {
                // Scroll to first error
                const firstError = this.querySelector('.form-group.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }
            
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Registration Successful!';
                submitBtn.style.background = 'linear-gradient(135deg, #2E7D32, #4CAF50)';
                
                // Reset form after success
                setTimeout(() => {
                    this.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    
                    // Show success toaster
                    showToast({
                        type: 'success',
                        title: 'Registration Successful!',
                        message: 'Thank you for registering! Our team will contact you within 24 hours to schedule your free trial class.',
                        duration: 6000
                    });
                    
                    // Redirect after a delay
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 3000);
                }, 1500);
            }, 2000);
        });
        
        // Remove error class on input
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
    const msgUserMessage = document.getElementById('msgUserMessage');
    const msgUserName = document.getElementById('msgUserName');
    const msgUserEmail = document.getElementById('msgUserEmail');
    const msgSendWhatsApp = document.getElementById('msgSendWhatsApp');
    const msgSendEmail = document.getElementById('msgSendEmail');
    const msgSubmitBtn = document.getElementById('msgSubmitBtn');
    
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
            
            // Default to UK number, user can change via main WhatsApp widget
            const whatsappNumber = '447848008574';
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
    
    // Submit Message Button (simulated form submission)
    if (msgSubmitBtn) {
        msgSubmitBtn.addEventListener('click', () => {
            const name = msgUserName ? msgUserName.value.trim() : '';
            const email = msgUserEmail ? msgUserEmail.value.trim() : '';
            const message = msgUserMessage ? msgUserMessage.value.trim() : '';
            
            // Basic validation
            let isValid = true;
            
            if (!name && msgUserName) {
                msgUserName.style.borderColor = '#e74c3c';
                isValid = false;
            }
            if (!email && msgUserEmail) {
                msgUserEmail.style.borderColor = '#e74c3c';
                isValid = false;
            }
            if (!message && msgUserMessage) {
                msgUserMessage.style.borderColor = '#e74c3c';
                isValid = false;
            }
            
            if (!isValid) {
                setTimeout(() => {
                    if (msgUserName) msgUserName.style.borderColor = '';
                    if (msgUserEmail) msgUserEmail.style.borderColor = '';
                    if (msgUserMessage) msgUserMessage.style.borderColor = '';
                }, 2000);
                return;
            }
            
            // Show loading state
            const originalText = msgSubmitBtn.innerHTML;
            msgSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            msgSubmitBtn.disabled = true;
            
            // Simulate sending (replace with actual API call)
            setTimeout(() => {
                msgSubmitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent!';
                msgSubmitBtn.style.background = 'linear-gradient(135deg, #2E7D32, #4CAF50)';
                
                setTimeout(() => {
                    // Reset form
                    if (msgUserName) msgUserName.value = '';
                    if (msgUserEmail) msgUserEmail.value = '';
                    if (msgUserMessage) msgUserMessage.value = 'Hello! I am interested in your Quran courses. Please guide me about the classes, timings, and fee structure.';
                    quickOptionBtns.forEach(b => b.classList.remove('selected'));
                    
                    // Reset button
                    msgSubmitBtn.innerHTML = originalText;
                    msgSubmitBtn.disabled = false;
                    msgSubmitBtn.style.background = '';
                    
                    // Close chat box
                    if (messageChatBox) messageChatBox.classList.remove('active');
                    if (messageToggleBtn) messageToggleBtn.classList.remove('active');
                    
                    // Show success toaster
                    showToast({
                        type: 'success',
                        title: 'Message Sent!',
                        message: 'Thank you! Your message has been sent. We will get back to you shortly.',
                        duration: 5000
                    });
                }, 1500);
            }, 2000);
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
    
    let selectedCountryNumber = '447848008574'; // Default UK number
    
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

    // ================================================
    // Form Validation Enhancement
    // ================================================
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form elements
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.backgroundColor = '#2E7D32';
                
                // Show success toaster
                showToast({
                    type: 'success',
                    title: 'Message Sent!',
                    message: 'Thank you for contacting us. We will respond to your inquiry shortly.',
                    duration: 5000
                });
                
                // Reset form
                setTimeout(() => {
                    this.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                }, 2000);
            }, 1500);
        });
    }

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
