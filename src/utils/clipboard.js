import { getIcon } from '../components/base/Icons.js';
import { t } from '../core/I18nManager.js';

/**
 * Copy text to clipboard and show visual feedback on the trigger button.
 * @param {HTMLElement} button - The button element to show feedback on
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Whether the copy succeeded
 */
export async function copyWithFeedback(button, text) {
    try {
        await navigator.clipboard.writeText(text);

        const originalHTML = button.innerHTML;
        button.innerHTML = `${getIcon('check', { size: 14 })} ${t('teams.export.copiedSuccess')}`;
        button.classList.add('copied');

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('copied');
        }, 2000);

        return true;
    } catch {
        return false;
    }
}
