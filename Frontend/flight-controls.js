/**
 * Flight Control Buttons Handler with Takeoff Modal
 * Frontend Only (Backend/WebSocket removed)
 */

class FlightControlButtons {
    constructor() {
        this.takeoffBtn      = null;
        this.landBtn         = null;
        this.rtlBtn          = null;
        this.modal           = null;
        this.progressSection = null;

        this.isExecuting    = false;
        this.currentCommand = null;

        this.takeoffSettings = {
            altitude: 10,
            speed: 2
        };

        this.callbacks = {
            onTakeoff: null,
            onLand: null,
            onRTL: null
        };

        this.initialize();
    }

    initialize() {
        this.takeoffBtn      = document.getElementById('takeoffBtn');
        this.landBtn         = document.getElementById('landBtn');
        this.rtlBtn          = document.getElementById('rtlBtn');
        this.modal           = document.getElementById('takeoffModal');
        this.progressSection = document.getElementById('progressSection');

        if (!this.takeoffBtn || !this.landBtn || !this.rtlBtn) {
            console.error('❌ Flight control buttons not found in DOM');
            return;
        }

        if (!this.modal) {
            console.error('❌ Takeoff modal not found in DOM');
            return;
        }

        this.attachEventListeners();
        this.attachModalListeners();
        console.log('✅ Flight Control Buttons initialized');
    }

    attachEventListeners() {
        this.takeoffBtn.addEventListener('click', () => {
            if (!this.isExecuting) this.showTakeoffModal();
        });

        this.landBtn.addEventListener('click', () => {
            if (!this.isExecuting) this.executeLand();
        });

        this.rtlBtn.addEventListener('click', () => {
            if (!this.isExecuting) this.executeRTL();
        });
    }

    attachModalListeners() {
        const closeBtn       = document.getElementById('modalCloseBtn');
        const cancelBtn      = document.getElementById('modalCancelBtn');
        const confirmBtn     = document.getElementById('modalConfirmBtn');
        const altitudeSlider = document.getElementById('altitudeSlider');
        const speedSlider    = document.getElementById('speedSlider');
        const altitudeValue  = document.getElementById('altitudeValue');
        const speedValue     = document.getElementById('speedValue');

        if (!closeBtn || !cancelBtn || !confirmBtn) {
            console.error('❌ Modal buttons not found');
            return;
        }

        closeBtn.addEventListener('click',   () => this.hideTakeoffModal());
        cancelBtn.addEventListener('click',  () => this.hideTakeoffModal());
        confirmBtn.addEventListener('click', () => this.confirmTakeoff());

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.hideTakeoffModal();
        });

        if (altitudeSlider) {
            altitudeSlider.addEventListener('input', (e) => {
                this.takeoffSettings.altitude = parseFloat(e.target.value);
                if (altitudeValue) altitudeValue.textContent = `${this.takeoffSettings.altitude} m`;
            });
        }

        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                this.takeoffSettings.speed = parseFloat(e.target.value);
                if (speedValue) speedValue.textContent = `${this.takeoffSettings.speed.toFixed(1)} m/s`;
            });
        }
    }

    showTakeoffModal() {
        this.modal.classList.add('active');
        this.progressSection.classList.remove('active');
        document.getElementById('modalActions').style.display = 'flex';

        const altitudeSlider = document.getElementById('altitudeSlider');
        const speedSlider    = document.getElementById('speedSlider');
        const altitudeValue  = document.getElementById('altitudeValue');
        const speedValue     = document.getElementById('speedValue');

        if (altitudeSlider) {
            altitudeSlider.value = this.takeoffSettings.altitude;
            if (altitudeValue) altitudeValue.textContent = `${this.takeoffSettings.altitude} m`;
        }

        if (speedSlider) {
            speedSlider.value = this.takeoffSettings.speed;
            if (speedValue) speedValue.textContent = `${this.takeoffSettings.speed.toFixed(1)} m/s`;
        }
    }

    hideTakeoffModal() {
        if (!this.isExecuting) this.modal.classList.remove('active');
    }

    confirmTakeoff() {
        document.getElementById('modalActions').style.display = 'none';
        this.progressSection.classList.add('active');
        this.setExecutingState(this.takeoffBtn, 'TAKEOFF');
        this.simulateTakeoffProgress();
        if (this.callbacks.onTakeoff) this.callbacks.onTakeoff(this.takeoffSettings);
    }

    simulateTakeoffProgress() {
        const progressFill       = document.getElementById('progressBarFill');
        const progressPercentage = document.getElementById('progressPercentage');
        const progressStatus     = document.getElementById('progressStatus');

        const duration  = (this.takeoffSettings.altitude / this.takeoffSettings.speed) * 1000;
        const startTime = Date.now();

        const statusMessages = [
            'Initiating takeoff sequence...',
            'Motors armed - lifting off...',
            'Climbing to target altitude...',
            'Approaching target altitude...',
            'Stabilizing at target altitude...',
            'Takeoff complete!'
        ];

        const updateProgress = () => {
            const elapsed  = Date.now() - startTime;
            const progress = Math.min((elapsed / duration) * 100, 100);

            progressFill.style.width       = progress + '%';
            progressPercentage.textContent = Math.round(progress) + '%';

            const idx = Math.min(
                Math.floor((progress / 100) * statusMessages.length),
                statusMessages.length - 1
            );
            progressStatus.textContent = statusMessages[idx];

            if (progress < 100) {
                requestAnimationFrame(updateProgress);
            } else {
                setTimeout(() => this.completeTakeoff(), 1000);
            }
        };

        updateProgress();
    }

    completeTakeoff() {
        this.clearExecutingState();
        setTimeout(() => {
            this.hideTakeoffModal();
            this.resetProgressBar();
        }, 1500);
    }

    resetProgressBar() {
        document.getElementById('progressBarFill').style.width    = '0%';
        document.getElementById('progressPercentage').textContent = '0%';
        document.getElementById('progressStatus').textContent     = 'Initiating takeoff...';
    }

    executeLand() {
        this.setExecutingState(this.landBtn, 'LAND');
        if (this.callbacks.onLand) this.callbacks.onLand();
        setTimeout(() => this.clearExecutingState(), 3000);
    }

    executeRTL() {
        this.setExecutingState(this.rtlBtn, 'RTL');
        if (this.callbacks.onRTL) this.callbacks.onRTL();
        setTimeout(() => this.clearExecutingState(), 3000);
    }

    setExecutingState(button, command) {
        this.isExecuting    = true;
        this.currentCommand = command;
        button.classList.add('executing');
        this.disableAllButtons();
    }

    clearExecutingState() {
        this.isExecuting    = false;
        this.currentCommand = null;
        this.takeoffBtn.classList.remove('executing');
        this.landBtn.classList.remove('executing');
        this.rtlBtn.classList.remove('executing');
        this.enableAllButtons();
    }

    disableAllButtons() {
        this.takeoffBtn.disabled = true;
        this.landBtn.disabled    = true;
        this.rtlBtn.disabled     = true;
    }

    enableAllButtons() {
        this.takeoffBtn.disabled = false;
        this.landBtn.disabled    = false;
        this.rtlBtn.disabled     = false;
    }

    onTakeoff(callback) { this.callbacks.onTakeoff = callback; }
    onLand(callback)    { this.callbacks.onLand    = callback; }
    onRTL(callback)     { this.callbacks.onRTL     = callback; }

    completeCommand() {
        if (this.isExecuting) this.clearExecutingState();
    }

    show() {
        const c = document.querySelector('.flight-controls-strip');
        if (c) c.style.display = 'flex';
    }

    hide() {
        const c = document.querySelector('.flight-controls-strip');
        if (c) c.style.display = 'none';
    }

    isCommandExecuting() { return this.isExecuting; }
    getCurrentCommand()  { return this.currentCommand; }
    getTakeoffSettings() { return { ...this.takeoffSettings }; }
}

/* ============================================================================
   FLIGHT MODE SELECTOR
   Opens panel to the RIGHT of the strip so it never covers console messages
   ============================================================================ */

class FlightModeSelector {
    constructor() {
        this.currentMode = 'Stabilize';
        this.panel       = null;
        this.btn         = null;
        this.badge       = null;
        this.isOpen      = false;
        this.init();
    }

    init() {
        this.btn   = document.getElementById('flightModeBtn');
        this.panel = document.getElementById('flightModePanel');
        this.badge = document.getElementById('activeModeDisplay');

        if (!this.btn || !this.panel) {
            console.error('❌ FlightModeSelector: elements not found');
            return;
        }

        // Toggle panel on MODE button click
        this.btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.isOpen ? this.close() : this.open();
        });

        // Handle mode selection
        this.panel.querySelectorAll('.mode-item').forEach(item => {
            item.addEventListener('click', () => {
                this.select(item.dataset.mode, item);
            });
        });

        // Close when clicking anywhere outside
        document.addEventListener('click', (e) => {
            if (!this.btn.contains(e.target) && !this.panel.contains(e.target)) {
                this.close();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
        });

        console.log('✅ FlightModeSelector initialized');
    }

open() {
    const rect        = this.btn.getBoundingClientRect();
    const panelHeight = this.panel.offsetHeight || 380;

    // Place panel to the RIGHT of the strip
    this.panel.style.left = (rect.right + 8) + 'px';

    // Open UPWARD - bottom of panel aligns with bottom of MODE button
    let topPos = rect.bottom - panelHeight;

    // Clamp so it doesn't go above the viewport
    if (topPos < 10) topPos = 10;

    this.panel.style.top = topPos + 'px';
    this.panel.classList.add('open');
    this.isOpen = true;
}

    close() {
        this.panel.classList.remove('open');
        this.isOpen = false;
    }

    select(mode, el) {
        this.currentMode = mode;

        // Update active highlight on rows
        this.panel.querySelectorAll('.mode-item').forEach(i => i.classList.remove('active-mode'));
        el.classList.add('active-mode');

        // Update the badge text
        if (this.badge) this.badge.textContent = mode.toUpperCase();

        console.log('✈️ Flight Mode changed to:', mode);

        // Fire event so websocket / other modules can react
        window.dispatchEvent(new CustomEvent('flightModeChanged', {
            detail: { mode }
        }));

        // Short delay so user sees highlight before panel closes
        setTimeout(() => this.close(), 180);
    }

    setMode(mode) {
        const item = this.panel.querySelector(`[data-mode="${mode}"]`);
        if (item) this.select(mode, item);
    }

    getCurrentMode() { return this.currentMode; }
}

/* ============================================================================
   INIT ON DOM READY
   ============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Flight Controls...');
    window.flightControls     = new FlightControlButtons();
    window.flightModeSelector = new FlightModeSelector();
});

console.log('%c🚁 Flight Control System Ready', 'color: #22c55e; font-size: 14px; font-weight: bold;');
