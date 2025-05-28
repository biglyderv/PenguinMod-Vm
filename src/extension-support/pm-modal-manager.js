class Modal {
    constructor (modalManager, id, config = {}) {
        /**
         * @type {ModalManager}
         */
        this.modalManager = modalManager;
        this.id = id;

        /** @private */
        this._config = config;

        this.disposed = false;
    }

    update () {
        this.modalManager.updateModals();
    }
    dispose () {
        // id will not be in this.modals if being ran from deleteModal
        this.modalManager.deleteModal(this.id);
        this.modalManager.updateModals();
        this.disposed = true;
    }

    cancel () {
        this.onModalCancel("button");
    }

    // update modal
    // NOTE: Updating hasButtonRow after creation shouldn't be supported.
    setTitle (newTitle) {
        this._config.title = newTitle;
        this.update();
    }
    setDebugText (newDebugText) {
        this._config.debugText = newDebugText;
        this.update();
    }
    setModalMountCallback (callback) {
        this.onModalMount = callback;
        this.update();
    }
    setModalButtonsMountCallback (callback) {
        this.onModalButtonsMount = callback;
        this.update();
    }
    setModalUnmountCallback (callback) {
        this.onModalUnmount = callback;
        this.update();
    }
    setModalCancelCallback (callback) {
        this.onModalCancel = callback;
        this.update();
    }

    // need to be overridden with another function
    /**
     * When ran, the container element can be added to in order to display custom elements on the modal.
     * @param {HTMLDivElement} container
     */
    onModalMount (container) {
        // no-op until override
    }
    /**
     * Only runs when hasButtonRow is true. The container element is located within the Box that is styled for a modal's bottom button row.
     * @param {HTMLDivElement} container
     */
    onModalButtonsMount (container) {
        // no-op until override
    }
    /**
     * Used to clean up custom elements when the modal is closed. containerButtons may not exist if hasButtonRow is false.
     * @param {HTMLDivElement} container
     * @param {HTMLDivElement?} containerButtons 
     */
    onModalUnmount (container, containerButtons) {
        // no-op until override
    }
    /**
     * Runs when the modal is requested to close. Note that the "button" closeReason is intended for manually calling this function.
     * @param {"popstate"|"exit"|"button"} closeReason "popstate" -> Back button in browser, "exit" -> X button on modal, "button" -> Close button
     */
    onModalCancel (closeReason) {
        // to be overridden by user
        this.dispose();
    }
}

class ModalManager {
    constructor (runtime) {
        this.runtime = runtime;

        /** @private */
        this._modals = {};
    }

    // overridden by GUI
    updateModals () {
        console.log("ModalManager: updateModals not overridden");
    }
    modalsAvailable () {
        return false; // overridden by GUI
    }
    /** @private */
    _guiGetClassNames() {
        console.log("ModalManager: _guiGetClassNames not overridden");
        return {};
    }

    createModal (id, config) {
        if (id in this._modals) {
            return this._modals[id];
        }

        const modal = new Modal(this, id, config);
        this._modals[id] = modal;
        this.updateModals();
        return modal;
    }
    deleteModal (id) {
        if (id in this._modals) {
            const modal = this._modals[id];
            delete this._modals[id];

            if (!modal.disposed) {
                modal.dispose();
            }
            this.updateModals();
        }
    }
    modalExists (id) {
        return (id in this._modals);
    }
    
    getButtonOkStyle () {
        const classNames = this._guiGetClassNames();
        return classNames.okButton;
    }
    getButtonCancelStyle() {
        const classNames = this._guiGetClassNames();
        return classNames.cancelButton;
    }
    getInputTextStyle() {
        const classNames = this._guiGetClassNames();
        return classNames.textInput;
    }
}

module.exports = ModalManager;