// src/core/I18nManager.js

/**
 * I18nManager - Internationalization and localization manager
 * Handles multi-language support with event-driven updates
 */
import eventBus from './EventBus.js';
import storage from './StorageAdapter.js';

/**
 * Supported languages configuration
 */
export const SUPPORTED_LANGUAGES = {
    en: { name: 'English', nativeName: 'English', flag: '🇺🇸' },
    es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳' }
};

/**
 * Default language
 */
export const DEFAULT_LANGUAGE = 'en';

/**
 * Storage key for language preference
 */
const STORAGE_KEY = 'app_language';

class I18nManager {
    constructor() {
        /** @private {string} Current language code */
        this.currentLanguage = DEFAULT_LANGUAGE;

        /** @private {Object} Translations cache by language */
        this.translations = {};

        /** @private {boolean} Whether translations are loaded */
        this.isLoaded = false;
    }

    /**
     * Initialize the i18n manager
     * Loads saved language preference and translations
     * @returns {Promise<void>}
     */
    async init() {
        // Load saved language preference
        const savedLanguage = storage.get(STORAGE_KEY, null);

        if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage]) {
            this.currentLanguage = savedLanguage;
        } else {
            // Try to detect browser language
            this.currentLanguage = this.detectBrowserLanguage();
        }

        // Load translations for current language
        await this.loadTranslations(this.currentLanguage);

        // Also preload English as fallback
        if (this.currentLanguage !== 'en') {
            await this.loadTranslations('en');
        }

        this.isLoaded = true;

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;

        eventBus.emit('i18n:initialized', { language: this.currentLanguage });
    }

    /**
     * Detect browser language preference
     * @private
     * @returns {string} Language code
     */
    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0].toLowerCase();

        // Check if browser language is supported
        if (SUPPORTED_LANGUAGES[langCode]) {
            return langCode;
        }

        return DEFAULT_LANGUAGE;
    }

    /**
     * Load translations for a specific language
     * @private
     * @param {string} langCode - Language code
     * @returns {Promise<void>}
     */
    async loadTranslations(langCode) {
        if (this.translations[langCode]) {
            return; // Already loaded
        }

        try {
            const module = await import(`../locales/${langCode}.js`);
            this.translations[langCode] = module.default;
        } catch (error) {
            console.warn(`Failed to load translations for ${langCode}:`, error);
            // If not English and failed, try to load English as fallback
            if (langCode !== 'en' && !this.translations['en']) {
                await this.loadTranslations('en');
            }
        }
    }

    /**
     * Get current language code
     * @returns {string}
     */
    getLanguage() {
        return this.currentLanguage;
    }

    /**
     * Get current language info
     * @returns {Object}
     */
    getLanguageInfo() {
        return SUPPORTED_LANGUAGES[this.currentLanguage];
    }

    /**
     * Get all supported languages
     * @returns {Object}
     */
    getSupportedLanguages() {
        return SUPPORTED_LANGUAGES;
    }

    /**
     * Change current language
     * @param {string} langCode - Language code
     * @returns {Promise<boolean>} Success status
     */
    async setLanguage(langCode) {
        if (!SUPPORTED_LANGUAGES[langCode]) {
            console.warn(`Unsupported language: ${langCode}`);
            return false;
        }

        if (langCode === this.currentLanguage) {
            return true; // Already set
        }

        const oldLanguage = this.currentLanguage;

        // Load translations if not already loaded
        await this.loadTranslations(langCode);

        // Update current language
        this.currentLanguage = langCode;

        // Save preference
        storage.set(STORAGE_KEY, langCode);

        // Update HTML lang attribute
        document.documentElement.lang = langCode;

        // Emit event for components to update
        eventBus.emit('i18n:language-changed', {
            from: oldLanguage,
            to: langCode
        });

        return true;
    }

    /**
     * Translate a key
     * @param {string} key - Translation key (dot notation: 'nav.home')
     * @param {Object} [params] - Interpolation parameters
     * @returns {string} Translated string or key if not found
     */
    t(key, params = {}) {
        // Get translation from current language
        let translation = this.getNestedValue(this.translations[this.currentLanguage], key);

        // Fallback to English
        if (translation === undefined && this.currentLanguage !== 'en') {
            translation = this.getNestedValue(this.translations['en'], key);
        }

        // Return key if translation not found
        if (translation === undefined) {
            console.warn(`Missing translation for key: ${key}`);
            return key;
        }

        // Interpolate parameters
        if (Object.keys(params).length > 0) {
            translation = this.interpolate(translation, params);
        }

        return translation;
    }

    /**
     * Get nested value from object using dot notation
     * @private
     * @param {Object} obj - Object to search
     * @param {string} path - Dot notation path
     * @returns {*} Value or undefined
     */
    getNestedValue(obj, path) {
        if (!obj) return undefined;

        const keys = path.split('.');
        let value = obj;

        for (const key of keys) {
            if (value === undefined || value === null) {
                return undefined;
            }
            value = value[key];
        }

        return value;
    }

    /**
     * Interpolate parameters into translation string
     * @private
     * @param {string} str - String with placeholders {{param}}
     * @param {Object} params - Parameters to interpolate
     * @returns {string} Interpolated string
     */
    interpolate(str, params) {
        return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return params[key] !== undefined ? params[key] : match;
        });
    }

    /**
     * Check if translations are loaded
     * @returns {boolean}
     */
    isReady() {
        return this.isLoaded;
    }
}

// Export singleton instance
const i18n = new I18nManager();
export default i18n;

// Convenience function for translations
export const t = (key, params) => i18n.t(key, params);

// For debugging
if (typeof window !== 'undefined') {
    window.i18n = i18n;
}
