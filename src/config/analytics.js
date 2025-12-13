/**
 * Google Analytics Configuration
 * Centralized gtag setup for all pages
 *
 * Performance: GA initialization is deferred to avoid blocking
 * the critical rendering path.
 */

const GA_MEASUREMENT_ID = 'G-S22BHY4Y5H';

/** @type {boolean} Flag to prevent multiple initializations */
let isInitialized = false;

/**
 * Initialize Google Analytics
 * Safe to call multiple times - will only init once
 */
function initGoogleAnalytics() {
    if (isInitialized) return;
    isInitialized = true;

    // Load gtag.js script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag function
    window.dataLayer = window.dataLayer || [];
    function gtag() {
        dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
}

/**
 * Track custom event
 * @param {string} eventName - Name of the event (e.g., 'click_button', 'generate_teams')
 * @param {Object} params - Optional event parameters
 */
function trackEvent(eventName, params = {}) {
    if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
    }
}

/**
 * Track button clicks with standard parameters
 * @param {string} buttonId - ID of the button
 * @param {string} category - Event category (e.g., 'navigation', 'teams', 'compare')
 * @param {string} label - Optional label for additional context
 */
function trackClick(buttonId, category, label = '') {
    const params = {
        event_category: category,
        button_id: buttonId
    };

    if (label) {
        params.event_label = label;
    }

    trackEvent('button_click', params);
}

/**
 * Deferred GA initialization
 * Uses requestIdleCallback to avoid blocking the main thread during page load
 * Falls back to setTimeout for browsers without requestIdleCallback support
 */
function deferredInit() {
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => initGoogleAnalytics(), { timeout: 2000 });
    } else {
        // Fallback: init after page becomes interactive
        setTimeout(initGoogleAnalytics, 1500);
    }
}

// Initialize GA after page load to not block critical path
if (document.readyState === 'complete') {
    deferredInit();
} else {
    window.addEventListener('load', deferredInit, { once: true });
}

export { GA_MEASUREMENT_ID, initGoogleAnalytics, trackEvent, trackClick };
