import BaseComponent from '../BaseComponent.js';
import { getIcon } from '../base/Icons.js';
import { generateAvatar } from '../../utils/avatarGenerator.js';
import { t } from '../../core/I18nManager.js';

class DragDropRanking extends BaseComponent {
    constructor(container, props = {}) {
        super(container);
        this.position = props.position;
        this.positionName = props.positionName;
        this.players = props.players || [];
        this.onApply = props.onApply;
        this.onCancel = props.onCancel;
        this.onChange = props.onChange;

        // Ordered list of player IDs (best first, sorted by current ELO)
        this.orderedIds = [...this.players]
            .sort((a, b) => (b.ratings[this.position] || 1500) - (a.ratings[this.position] || 1500))
            .map(p => p.id);

        // Tie markers: tieWithNext[i] = true means player at index i is tied with i+1
        // Auto-detect ties for players with equal ratings
        this.tieWithNext = this.orderedIds.slice(0, -1).map((id, i) => {
            const nextId = this.orderedIds[i + 1];
            const currentPlayer = this.getPlayerById(id);
            const nextPlayer = this.getPlayerById(nextId);
            const currentRating = currentPlayer?.ratings[this.position] || 1500;
            const nextRating = nextPlayer?.ratings[this.position] || 1500;
            return currentRating === nextRating;
        });

        // Drag state
        this.dragState = null;
        this.boundPointerMove = this.handlePointerMove.bind(this);
        this.boundPointerUp = this.handlePointerUp.bind(this);
    }

    getPlayerById(id) {
        return this.players.find(p => p.id === id);
    }

    getTiers() {
        const tiers = [];
        let currentTier = [this.orderedIds[0]];

        for (let i = 0; i < this.tieWithNext.length; i++) {
            if (this.tieWithNext[i]) {
                currentTier.push(this.orderedIds[i + 1]);
            } else {
                tiers.push(currentTier);
                currentTier = [this.orderedIds[i + 1]];
            }
        }
        tiers.push(currentTier);
        return tiers;
    }

    getRankNumber(index) {
        let rank = 1;
        for (let i = 0; i < index; i++) {
            if (!this.tieWithNext[i]) {
                rank = i + 2;
            }
        }
        return rank;
    }

    render() {
        if (!this.orderedIds.length) return '';

        return `
            <div class="ranking-area" role="region" aria-label="${t('compare.ranking.title')}">
                <div class="ranking-header">
                    <div class="ranking-header__info">
                        <h3 class="ranking-header__title">${t('compare.ranking.orderPlayers')} <strong>${this.escape(this.positionName)}</strong></h3>
                        <p class="ranking-header__hint">${t('compare.ranking.dragHint')}</p>
                    </div>
                </div>

                <div class="ranking-list" id="rankingList" role="list" aria-label="${t('compare.ranking.playerOrder')}">
                    ${this.orderedIds.map((id, index) => this.renderItem(id, index)).join('')}
                </div>

                <div class="ranking-actions">
                    <button class="btn btn-secondary ranking-actions__cancel" id="rankingCancel">
                        ${getIcon('arrow-left', { size: 16, className: 'btn-icon' })}
                        ${t('common.cancel')}
                    </button>
                </div>
            </div>
        `;
    }

    renderItem(playerId, index) {
        const player = this.getPlayerById(playerId);
        if (!player) return '';

        const rating = Math.round(player.ratings[this.position] || 1500);
        const rank = this.getRankNumber(index);
        const avatarSvg = generateAvatar(player.name, 40, rating);
        const isDragging = this.dragState?.dragIndex === index;

        let tierSeparator = '';
        if (index < this.orderedIds.length - 1) {
            const isTied = this.tieWithNext[index];
            tierSeparator = `
                <div class="ranking-tier-separator" data-separator-index="${index}">
                    <button class="ranking-tier-toggle ${isTied ? 'ranking-tier-toggle--tied' : ''}"
                            data-toggle-index="${index}"
                            aria-label="${isTied ? t('compare.ranking.markDifferent') : t('compare.ranking.markEqual')}"
                            title="${isTied ? t('compare.ranking.markDifferent') : t('compare.ranking.markEqual')}">
                        <span class="ranking-tier-toggle__symbol">${isTied ? '=' : '>'}</span>
                    </button>
                    <div class="ranking-tier-separator__line ${isTied ? 'ranking-tier-separator__line--tied' : ''}"></div>
                </div>
            `;
        }

        return `
            <div class="ranking-item ${isDragging ? 'ranking-item--dragging' : ''}"
                 data-player-id="${playerId}"
                 data-index="${index}"
                 role="listitem"
                 aria-label="${player.name}, ${t('compare.ranking.rank')} ${rank}">

                <div class="ranking-item__rank">${rank}</div>

                <div class="ranking-item__grip" data-grip-index="${index}"
                     aria-label="${t('compare.ranking.dragToReorder')}"
                     role="button" tabindex="0">
                    ${getIcon('grip-vertical', { size: 16 })}
                </div>

                <div class="ranking-item__avatar">${avatarSvg}</div>

                <div class="ranking-item__info">
                    <span class="ranking-item__name">${this.escape(player.name)}</span>
                    <span class="ranking-item__rating">${rating} ELO</span>
                </div>

                <div class="ranking-item__arrows">
                    <button class="ranking-item__arrow-btn" data-move-up="${index}"
                            ${index === 0 ? 'disabled' : ''}
                            aria-label="${t('compare.ranking.moveUp')}" title="${t('compare.ranking.moveUp')}">
                        ${getIcon('chevron-up', { size: 14 })}
                    </button>
                    <button class="ranking-item__arrow-btn" data-move-down="${index}"
                            ${index === this.orderedIds.length - 1 ? 'disabled' : ''}
                            aria-label="${t('compare.ranking.moveDown')}" title="${t('compare.ranking.moveDown')}">
                        ${getIcon('chevron-down', { size: 14 })}
                    </button>
                </div>
            </div>
            ${tierSeparator}
        `;
    }

    onMount() {
        // Back button
        const cancelBtn = this.$('#rankingCancel');
        if (cancelBtn) {
            this.addEventListener(cancelBtn, 'click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.onCancel) {
                    this.onCancel();
                }
            });
        }

        // Tier toggle buttons
        this.$$('.ranking-tier-toggle').forEach(btn => {
            this.addEventListener(btn, 'click', (e) => {
                e.preventDefault();
                const index = parseInt(btn.dataset.toggleIndex);
                this.toggleTie(index);
            });
        });

        // Arrow move buttons
        this.$$('[data-move-up]').forEach(btn => {
            this.addEventListener(btn, 'click', (e) => {
                e.preventDefault();
                const index = parseInt(btn.dataset.moveUp);
                this.moveItem(index, index - 1);
            });
        });

        this.$$('[data-move-down]').forEach(btn => {
            this.addEventListener(btn, 'click', (e) => {
                e.preventDefault();
                const index = parseInt(btn.dataset.moveDown);
                this.moveItem(index, index + 1);
            });
        });

        // Drag grips - pointer events for desktop + mobile
        this.$$('.ranking-item__grip').forEach(grip => {
            this.addEventListener(grip, 'pointerdown', (e) => {
                e.preventDefault();
                const index = parseInt(grip.dataset.gripIndex);
                this.startDrag(index, e);
            });
        });

        // Keyboard support on grips
        this.$$('.ranking-item__grip').forEach(grip => {
            this.addEventListener(grip, 'keydown', (e) => {
                const index = parseInt(grip.dataset.gripIndex);
                if (e.key === 'ArrowUp' && index > 0) {
                    e.preventDefault();
                    this.moveItem(index, index - 1);
                } else if (e.key === 'ArrowDown' && index < this.orderedIds.length - 1) {
                    e.preventDefault();
                    this.moveItem(index, index + 1);
                }
            });
        });
    }

    toggleTie(index) {
        if (index >= 0 && index < this.tieWithNext.length) {
            this.tieWithNext[index] = !this.tieWithNext[index];
            this.rerender();
            this.notifyChange();
        }
    }

    moveItem(fromIndex, toIndex) {
        if (toIndex < 0 || toIndex >= this.orderedIds.length) return;

        // Save adjacency pairs and their tie status before moving
        const oldAdjacency = new Map();
        for (let i = 0; i < this.tieWithNext.length; i++) {
            const pairKey = this.orderedIds[i] + '|' + this.orderedIds[i + 1];
            oldAdjacency.set(pairKey, this.tieWithNext[i]);
        }
        const movedId = this.orderedIds[fromIndex];

        // Move the player ID
        const [removed] = this.orderedIds.splice(fromIndex, 1);
        this.orderedIds.splice(toIndex, 0, removed);

        // Rebuild tie markers preserving ties between non-moved items that remain adjacent
        this.rebuildTiesAfterMove(oldAdjacency, movedId);
        this.rerender();
        this.notifyChange();
    }

    rebuildTiesAfterMove(oldAdjacency, movedId) {
        const newTies = new Array(this.tieWithNext.length).fill(false);

        for (let i = 0; i < newTies.length; i++) {
            const a = this.orderedIds[i];
            const b = this.orderedIds[i + 1];

            const pairKey = a + '|' + b;
            const reversePairKey = b + '|' + a;

            if (a === movedId || b === movedId) {
                // For pairs involving the moved player, check both directions
                // so that swapping two tied adjacent players preserves the tie
                if (oldAdjacency.has(pairKey)) {
                    newTies[i] = oldAdjacency.get(pairKey);
                } else if (oldAdjacency.has(reversePairKey)) {
                    newTies[i] = oldAdjacency.get(reversePairKey);
                }
            } else {
                // Non-moved pairs: preserve tie if they were adjacent before
                if (oldAdjacency.has(pairKey)) {
                    newTies[i] = oldAdjacency.get(pairKey);
                }
            }
        }

        this.tieWithNext = newTies;
    }

    notifyChange() {
        if (this.onChange) {
            this.onChange(this.getTiers());
        }
    }

    startDrag(index, event) {
        const listEl = this.$('#rankingList');
        if (!listEl) return;

        const items = this.$$('.ranking-item');
        const draggedEl = items[index];
        if (!draggedEl) return;

        const rect = draggedEl.getBoundingClientRect();
        const listRect = listEl.getBoundingClientRect();

        this.dragState = {
            dragIndex: index,
            currentIndex: index,
            startY: event.clientY,
            offsetY: event.clientY - rect.top,
            itemHeight: rect.height + this.getSeparatorHeight(),
            listTop: listRect.top,
            listEl
        };

        draggedEl.classList.add('ranking-item--dragging');
        listEl.classList.add('ranking-list--dragging');
        draggedEl.setPointerCapture(event.pointerId);

        document.addEventListener('pointermove', this.boundPointerMove);
        document.addEventListener('pointerup', this.boundPointerUp);
    }

    getSeparatorHeight() {
        const sep = this.$('.ranking-tier-separator');
        return sep ? sep.getBoundingClientRect().height : 8;
    }

    handlePointerMove(event) {
        if (!this.dragState) return;

        const { dragIndex, itemHeight, listTop, listEl } = this.dragState;
        const items = this.$$('.ranking-item');
        const relativeY = event.clientY - listTop;
        const newIndex = Math.max(0, Math.min(this.orderedIds.length - 1,
            Math.floor(relativeY / itemHeight)));

        if (newIndex !== this.dragState.currentIndex) {
            this.dragState.currentIndex = newIndex;
            // Visual feedback: add placeholder class
            items.forEach((item, i) => {
                item.classList.remove('ranking-item--drop-above', 'ranking-item--drop-below');
                if (i === newIndex && newIndex !== dragIndex) {
                    item.classList.add(newIndex < dragIndex ? 'ranking-item--drop-above' : 'ranking-item--drop-below');
                }
            });
        }
    }

    handlePointerUp(event) {
        document.removeEventListener('pointermove', this.boundPointerMove);
        document.removeEventListener('pointerup', this.boundPointerUp);

        if (!this.dragState) return;

        const { dragIndex, currentIndex } = this.dragState;
        this.dragState = null;

        if (dragIndex !== currentIndex) {
            this.moveItem(dragIndex, currentIndex);
        } else {
            this.rerender();
        }
    }

    rerender() {
        if (!this.isMounted) return;
        // Clean up old listeners then re-render
        this.eventUnsubscribers.forEach(unsub => unsub());
        this.eventUnsubscribers = [];

        const html = this.render();
        if (typeof html === 'string') {
            this.container.innerHTML = html;
        }
        this.onMount();
    }

    onDestroy() {
        document.removeEventListener('pointermove', this.boundPointerMove);
        document.removeEventListener('pointerup', this.boundPointerUp);
    }
}

export default DragDropRanking;
