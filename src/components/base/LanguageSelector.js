// src/components/base/LanguageSelector.js

/**
 * LanguageSelector - Language switcher component
 * Allows users to change the application language
 */

import i18n, { SUPPORTED_LANGUAGES, t } from '../../core/I18nManager.js';
import eventBus from '../../core/EventBus.js';
import { getIcon } from './Icons.js';

class LanguageSelector {
    constructor(container, props = {}) {
        this.container = container;
        this.props = props;
        this.isOpen = false;
        this.boundHandleOutsideClick = this.handleOutsideClick.bind(this);
    }

    mount() {
        this.render();
        this.attachEventListeners();

        // Listen for language changes
        eventBus.on('i18n:language-changed', () => {
            this.render();
            this.attachEventListeners();
        });
    }

    render() {
        const currentLang = i18n.getLanguage();
        const currentLangInfo = SUPPORTED_LANGUAGES[currentLang];

        this.container.innerHTML = `
            <div class="language-selector">
                <button
                    type="button"
                    class="language-selector__trigger"
                    aria-label="${t('languages.selectLanguage')}"
                    aria-expanded="${this.isOpen}"
                    aria-haspopup="listbox"
                >
                    <span class="language-selector__flag">${currentLangInfo.flag}</span>
                    <span class="language-selector__code">${currentLang.toUpperCase()}</span>
                    ${getIcon('chevron-down', { size: 12, className: 'language-selector__icon' })}
                </button>
                <div class="language-selector__dropdown ${this.isOpen ? 'open' : ''}" role="listbox">
                    ${Object.entries(SUPPORTED_LANGUAGES).map(([code, info]) => `
                        <button
                            type="button"
                            class="language-selector__option ${code === currentLang ? 'active' : ''}"
                            data-lang="${code}"
                            role="option"
                            aria-selected="${code === currentLang}"
                        >
                            <span class="language-selector__flag">${info.flag}</span>
                            <span class="language-selector__name">${info.nativeName}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const trigger = this.container.querySelector('.language-selector__trigger');
        const options = this.container.querySelectorAll('.language-selector__option');

        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown();
            });
        }

        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const langCode = option.dataset.lang;
                this.selectLanguage(langCode);
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', this.boundHandleOutsideClick);
    }

    toggleDropdown() {
        this.isOpen = !this.isOpen;
        const dropdown = this.container.querySelector('.language-selector__dropdown');
        const trigger = this.container.querySelector('.language-selector__trigger');

        if (dropdown) {
            dropdown.classList.toggle('open', this.isOpen);
        }
        if (trigger) {
            trigger.setAttribute('aria-expanded', this.isOpen);
        }
    }

    closeDropdown() {
        this.isOpen = false;
        const dropdown = this.container.querySelector('.language-selector__dropdown');
        const trigger = this.container.querySelector('.language-selector__trigger');

        if (dropdown) {
            dropdown.classList.remove('open');
        }
        if (trigger) {
            trigger.setAttribute('aria-expanded', 'false');
        }
    }

    handleOutsideClick(e) {
        const selector = this.container.querySelector('.language-selector');
        if (selector && !selector.contains(e.target)) {
            this.closeDropdown();
        }
    }

    async selectLanguage(langCode) {
        await i18n.setLanguage(langCode);
        this.closeDropdown();

        // Reload the page to apply translations
        // In a more advanced setup, you could re-render components
        window.location.reload();
    }

    destroy() {
        document.removeEventListener('click', this.boundHandleOutsideClick);
    }
}

export default LanguageSelector;
