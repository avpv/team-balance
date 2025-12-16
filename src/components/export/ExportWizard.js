import Component from '../base/Component.js';
import ExportFormatPicker from './ExportFormatPicker.js';
import ExportContent from './ExportContent.js';
import { t } from '../../core/I18nManager.js';

/**
 * Export Wizard - Orchestrates the multi-step export process
 * Step 1: Format selection (picker)
 * Step 2: Content preview with Download/Copy buttons
 */
export default class ExportWizard extends Component {
    constructor(options = {}) {
        super();
        this.currentStep = 'picker'; // 'picker', 'text', 'csv', 'json'
        this.currentComponent = null;

        // Callbacks for generating export content
        this.generateTextExport = options.generateTextExport;
        this.generateCsvExport = options.generateCsvExport;
        this.generateJsonExport = options.generateJsonExport;

        // Callback when export is complete
        this.onExportComplete = options.onExportComplete;

        // Callback when step changes (for modal to show/hide Download button)
        this.onStepChange = options.onStepChange;
    }

    /**
     * Handle format selection from picker
     */
    handleFormatSelect(formatId) {
        this.currentStep = formatId;
        this.renderCurrentStep();
    }

    /**
     * Handle back to picker
     */
    handleBack() {
        this.currentStep = 'picker';
        this.renderCurrentStep();
    }

    /**
     * Get export content for the selected format
     */
    getExportContent(format) {
        switch (format) {
            case 'text':
                return this.generateTextExport ? this.generateTextExport() : '';
            case 'csv':
                return this.generateCsvExport ? this.generateCsvExport() : '';
            case 'json':
                return this.generateJsonExport ? this.generateJsonExport() : '';
            default:
                return '';
        }
    }

    /**
     * Get format info (title, filename, mime type)
     */
    getFormatInfo(format) {
        const date = new Date().toISOString().split('T')[0];

        switch (format) {
            case 'text':
                return {
                    title: t('teams.export.formatText'),
                    filename: `teams-${date}.txt`,
                    mimeType: 'text/plain'
                };
            case 'csv':
                return {
                    title: t('teams.export.formatCsv'),
                    filename: `teams-${date}.csv`,
                    mimeType: 'text/csv'
                };
            case 'json':
                return {
                    title: t('teams.export.formatJson'),
                    filename: `teams-${date}.json`,
                    mimeType: 'application/json'
                };
            default:
                return { title: '', filename: '', mimeType: '' };
        }
    }

    /**
     * Render current step
     */
    renderCurrentStep() {
        if (!this.element) return;

        // Clean up current component
        if (this.currentComponent) {
            this.currentComponent.unmount();
            this.currentComponent = null;
        }

        let component;

        if (this.currentStep === 'picker') {
            component = new ExportFormatPicker(
                (formatId) => this.handleFormatSelect(formatId)
            );
        } else {
            // Show export content view
            const content = this.getExportContent(this.currentStep);
            const formatInfo = this.getFormatInfo(this.currentStep);

            component = new ExportContent({
                format: this.currentStep,
                title: formatInfo.title,
                content: content,
                filename: formatInfo.filename,
                mimeType: formatInfo.mimeType,
                onBack: () => this.handleBack(),
                onExportComplete: this.onExportComplete
            });
        }

        this.currentComponent = component;
        component.mount(this.element);

        // Notify about step change
        if (this.onStepChange) {
            this.onStepChange(this.currentStep, this.currentStep !== 'picker');
        }
    }

    /**
     * Reset wizard to initial state
     */
    reset() {
        this.currentStep = 'picker';
        this.renderCurrentStep();
    }

    /**
     * Trigger download from current content component
     * Called from Modal confirm button
     */
    triggerDownload() {
        if (this.currentComponent && typeof this.currentComponent.handleDownload === 'function') {
            this.currentComponent.handleDownload();
        }
    }

    /**
     * Check if currently on content step (not picker)
     */
    isOnContentStep() {
        return this.currentStep !== 'picker';
    }

    render() {
        return `<div class="export-wizard-container"></div>`;
    }

    mount(container) {
        super.mount(container);
        this.renderCurrentStep();
    }

    unmount() {
        if (this.currentComponent) {
            this.currentComponent.unmount();
            this.currentComponent = null;
        }
        super.unmount();
    }
}
