/**
 * Google Analytics Configuration
 * Centralized gtag setup for all pages
 */

const GA_MEASUREMENT_ID = 'G-S22BHY4Y5H';

/**
 * Initialize Google Analytics
 */
function initGoogleAnalytics() {
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

// Auto-initialize
initGoogleAnalytics();

export { GA_MEASUREMENT_ID, initGoogleAnalytics };
