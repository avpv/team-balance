/**
 * PreloadInit - Critical initialization before app loads
 *
 * This script runs before the main application and handles
 * essential tasks like preventing FOUC (Flash of Unstyled Content).
 */

/**
 * Initialize styles-loaded class on body
 * This prevents FOUC by ensuring body remains hidden until
 * stylesheets are fully loaded and applied.
 */
(function initStylesLoaded() {
    // Add styles-loaded class once DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Use requestAnimationFrame to ensure styles are applied
            requestAnimationFrame(function() {
                document.body.classList.add('styles-loaded');
            });
        });
    } else {
        // DOM already loaded
        requestAnimationFrame(function() {
            document.body.classList.add('styles-loaded');
        });
    }
})();
