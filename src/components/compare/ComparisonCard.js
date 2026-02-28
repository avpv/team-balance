import BaseComponent from '../BaseComponent.js';
import { getIcon } from '../base/Icons.js';
import { generateAvatar } from '../../utils/avatarGenerator.js';
import { t } from '../../core/I18nManager.js';
import { GLICKO2 } from '../../config/rating.js';

class ComparisonCard extends BaseComponent {
    constructor(container, props = {}) {
        super(container);
        this.player = props.player;
        this.opponentId = props.opponentId;
        this.positionName = props.positionName;
        this.positionKey = props.positionKey;
        this.side = props.side; // 'left' or 'right'
        this.keyboardHint = props.keyboardHint;
        this.onSelect = props.onSelect; // Callback for selection
    }

    render() {
        const { player, opponentId, positionName, positionKey, side, keyboardHint } = this;

        if (!player) return '';

        const rating = Math.round(player.ratings[positionKey]);
        const comparisons = player.comparisons[positionKey];
        const rd = player.rd?.[positionKey] ?? GLICKO2.INITIAL_RD;
        const rdConfidence = this.getRdConfidenceLevel(rd);
        const rdLabel = t(`compare.confidence.${rdConfidence}`);

        // Generate SVG avatar with ELO-based smile
        const avatarSvg = generateAvatar(player.name, 96, rating);

        return `
            <button
                class="player-card clickable comparison-player-card"
                id="${side}PlayerCard"
                data-winner-id="${player.id}"
                data-loser-id="${opponentId}"
                aria-label="Select ${this.escape(player.name)} as better player (keyboard: ${keyboardHint})"
                role="button">
                <div class="keyboard-hint" aria-hidden="true">${keyboardHint}</div>

                <div class="player-avatar comparison-avatar">
                    ${avatarSvg}
                </div>

                <div class="player-info-section">
                    <h4 class="player-name">${this.escape(player.name)}</h4>
                    <p class="player-position">${positionName}</p>
                </div>

                <div class="player-stats-section">
                    <div class="player-rating">
                        <span class="rating-value">${rating}</span>
                        <span class="rating-label">ELO</span>
                    </div>
                    <div class="player-rd-confidence">
                        <span class="rd-badge rd-badge--${rdConfidence}" title="${t('compare.confidence.tooltip', { rd: Math.round(rd) })}">${rdLabel}</span>
                    </div>
                    <p class="player-comparisons">${t('compare.comparison.comparedCount', { count: comparisons })}</p>
                </div>
            </button>
        `;
    }

    onMount() {
        const card = this.container.querySelector('.player-card');
        if (card) {
            card.addEventListener('click', () => {
                if (this.onSelect) {
                    this.onSelect(this.player.id, this.opponentId);
                }
            });
        }
    }

    getRdConfidenceLevel(rd) {
        const thresholds = GLICKO2.CONFIDENCE;
        if (rd <= thresholds.HIGH) return 'high';
        if (rd <= thresholds.MEDIUM) return 'medium';
        if (rd <= thresholds.LOW) return 'low';
        return 'very-low';
    }

    animate() {
        const card = this.container.querySelector('.player-card');
        if (card) {
            card.classList.add('key-pressed');
            setTimeout(() => {
                card.classList.remove('key-pressed');
            }, 400);
        }
    }
}

export default ComparisonCard;
