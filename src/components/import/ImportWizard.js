import Component from '../base/Component.js';
import ImportDataSourcePicker from './ImportDataSourcePicker.js';
import TextImport from './TextImport.js';
import FileImport from './FileImport.js';
import ApiImport from './ApiImport.js';

/**
 * Import Wizard - Orchestrates the multi-step import process
 * Step 1: Data source selection
 * Step 2: Data input (based on selected source)
 * Step 3: Preview and confirmation (handled by parent)
 */
export default class ImportWizard extends Component {
    constructor(positions = []) {
        super();
        this.positions = positions;
        this.currentStep = 'picker'; // 'picker', 'text', 'csv', 'json', 'api'
        this.currentData = '';
        this.currentDelimiter = ','; // Default delimiter
        this.currentComponent = null;
        this.onDataChangeCallback = null;
    }

    /**
     * Set data change callback
     */
    setDataChangeCallback(callback) {
        this.onDataChangeCallback = callback;
    }

    /**
     * Handle data source selection
     */
    handleSourceSelect(sourceId) {
        this.currentStep = sourceId;
        this.currentData = '';
        this.renderCurrentStep();
    }

    /**
     * Handle back to picker
     */
    handleBack() {
        this.currentStep = 'picker';
        this.currentData = '';
        this.renderCurrentStep();

        // Clear preview when going back
        if (this.onDataChangeCallback) {
            this.onDataChangeCallback('');
        }
    }

    /**
     * Handle data change from import method
     */
    handleDataChange(data, delimiter = ',') {
        this.currentData = data;
        this.currentDelimiter = delimiter;

        // Notify parent component
        if (this.onDataChangeCallback) {
            this.onDataChangeCallback(data, delimiter);
        }
    }

    /**
     * Get current delimiter
     */
    getDelimiter() {
        return this.currentDelimiter;
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

        // Create and mount new component based on current step
        let component;

        switch (this.currentStep) {
            case 'picker':
                component = new ImportDataSourcePicker(
                    (sourceId) => this.handleSourceSelect(sourceId)
                );
                break;

            case 'text':
                component = new TextImport(
                    (data) => this.handleDataChange(data),
                    () => this.handleBack(),
                    this.positions
                );
                break;

            case 'csv':
                component = new FileImport(
                    'csv',
                    (data) => this.handleDataChange(data),
                    () => this.handleBack(),
                    this.positions
                );
                break;

            case 'json':
                component = new FileImport(
                    'json',
                    (data) => this.handleDataChange(data),
                    () => this.handleBack(),
                    this.positions
                );
                break;

            case 'api':
                component = new ApiImport(
                    (data) => this.handleDataChange(data),
                    () => this.handleBack(),
                    this.positions
                );
                break;

            default:
                return;
        }

        this.currentComponent = component;
        component.mount(this.element);
    }

    /**
     * Update preview in current component
     */
    updatePreview(previewHTML) {
        if (this.currentComponent && typeof this.currentComponent.updatePreview === 'function') {
            this.currentComponent.updatePreview(previewHTML);
        }
    }

    /**
     * Get current data
     */
    async getData() {
        if (this.currentComponent && typeof this.currentComponent.getData === 'function') {
            return await this.currentComponent.getData();
        }
        return this.currentData;
    }

    /**
     * Reset wizard to initial state
     */
    reset() {
        this.currentStep = 'picker';
        this.currentData = '';
        this.renderCurrentStep();
    }

    render() {
        return `<div class="import-wizard-container"></div>`;
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
