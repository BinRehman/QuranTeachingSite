/**
 * EmailJS integration for Contact and Registration forms.
 * Sends form data via EmailJS without a backend server.
 * Success: Bootstrap 5 toast only. Errors: console only. No alerts.
 * Production-ready; runs after DOM is ready.
 */

(function() {
    'use strict';

    var EMAILJS_CONFIG = {
        publicKey: '7VMwqgJGAREMQ9HxN',
        serviceID: 'service_sve3885',
        templateID: 'template_6tp4jtn'
    };

    /**
     * Initialize EmailJS with the public key.
     */
    function initEmailJS() {
        if (typeof emailjs === 'undefined') {
            console.error('EmailJS SDK not loaded. Include the EmailJS script before emailjs.js.');
            return false;
        }
        emailjs.init(EMAILJS_CONFIG.publicKey);
        return true;
    }

    /**
     * Set submit button loading state.
     */
    function setButtonState(button, disabled, loadingText, originalHTML) {
        if (!button) return;
        button.disabled = disabled;
        if (loadingText && disabled) {
            button.dataset.originalHTML = button.innerHTML;
            button.innerHTML = loadingText;
        } else if (originalHTML) {
            button.innerHTML = originalHTML;
        }
    }

    /**
     * Ensure a Bootstrap 5 toast container exists in the DOM.
     */
    function getToastContainer() {
        var id = 'emailjs-toast-container';
        var existing = document.getElementById(id);
        if (existing) return existing;
        var container = document.createElement('div');
        container.id = id;
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-atomic', 'true');
        document.body.appendChild(container);
        return container;
    }

    /**
     * Show a success message using Bootstrap 5 toast.
     */
    function showSuccessToast(message) {
        var container = getToastContainer();
        var toastId = 'emailjs-toast-' + Date.now();
        var toastEl = document.createElement('div');
        toastEl.id = toastId;
        toastEl.className = 'toast align-items-center text-bg-success border-0';
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');
        toastEl.innerHTML = (
            '<div class="d-flex">' +
                '<div class="toast-body">' + (message || 'Your message has been sent successfully. We will get back to you soon.') + '</div>' +
                '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>' +
            '</div>'
        );
        container.appendChild(toastEl);

        if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
            var toast = new bootstrap.Toast(toastEl, { autohide: true, delay: 5000 });
            toastEl.addEventListener('hidden.bs.toast', function() {
                if (toastEl.parentNode) toastEl.parentNode.removeChild(toastEl);
            });
            toast.show();
        } else {
            console.warn('Bootstrap 5 not loaded. Success message: ', message);
            setTimeout(function() {
                if (toastEl.parentNode) toastEl.parentNode.removeChild(toastEl);
            }, 5000);
        }
    }

    /**
     * Get selected course names as course1, course2, course3, ... (max 10).
     * Selected courses fill in order; rest are empty string.
     */
    function getCoursesAsCourse1Course2(form) {
        var coursesSelect = form.querySelector('#courses');
        if (!coursesSelect || !coursesSelect.selectedOptions) {
            return { course1: '', course2: '', course3: '', course4: '', course5: '', course6: '' };
        }
        var selectedNames = Array.from(coursesSelect.selectedOptions).map(function(option) { return option.text; });
        var maxSlots = 10;
        var out = {};
        for (var i = 1; i <= maxSlots; i++) {
            out['course' + i] = selectedNames[i - 1] || '';
        }
        return out;
    }

    /**
     * Build template params from registration form.
     * Courses sent as course1, course2, course3... (data in selected slots, rest empty).
     */
    function getRegistrationTemplateParams(form) {
        var getVal = function(name) {
            var el = form.querySelector('[name="' + name + '"]');
            if (!el) return '';
            if (el.type === 'checkbox') return el.checked ? 'Yes' : 'No';
            return el.value || '';
        };
        var params = {
            title: getVal('title'),
            name: getVal('name'),
            email: getVal('email'),
            phone: getVal('phone'),
            age: getVal('age'),
            gender: getVal('gender'),
            address: getVal('address'),
            notes: getVal('notes'),
            agreement: getVal('agreement')
        };
        var courseSlots = getCoursesAsCourse1Course2(form);
        for (var key in courseSlots) {
            params[key] = courseSlots[key];
        }
        return params;
    }

    /**
     * Handle form submit: send via EmailJS, success toast + reset, errors to console only.
     * Registration form uses send() with explicit templateParams so selected_courses is always sent.
     */
    function handleSubmit(event, form) {
        event.preventDefault();

        var submitBtn = form.querySelector('button[type="submit"]');
        var originalHTML = submitBtn ? submitBtn.innerHTML : null;

        setButtonState(submitBtn, true, '<i class="fas fa-spinner fa-spin"></i> Sending...', null);

        var sendPromise;

        if (form.id === 'studentRegistrationForm') {
            var templateParams = getRegistrationTemplateParams(form);
            console.log(templateParams);
            sendPromise = emailjs.send(
                EMAILJS_CONFIG.serviceID,
                EMAILJS_CONFIG.templateID,
                templateParams
            );
        } else {
            sendPromise = emailjs.sendForm(
                EMAILJS_CONFIG.serviceID,
                EMAILJS_CONFIG.templateID,
                form
            );
        }

        sendPromise.then(function() {
            setButtonState(submitBtn, false, null, originalHTML);
            showSuccessToast('Thank you! Your message has been sent successfully. We will get back to you soon.');
            form.reset();
        }).catch(function(err) {
            setButtonState(submitBtn, false, null, originalHTML);
            console.error('EmailJS send failed:', err);
        });
    }

    /**
     * Attach submit listener to a form by id.
     */
    function bindForm(formId) {
        var form = document.getElementById(formId);
        if (!form) return;
        form.addEventListener('submit', function(e) {
            handleSubmit(e, form);
        });
    }

    function init() {
        if (!initEmailJS()) return;

        bindForm('contact-form');
        bindForm('studentRegistrationForm');
        bindForm('message-widget-form');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
