/**
 * Flight Control Buttons Handler with Takeoff Modal
 * FIX: Modal close/cancel/X buttons now work correctly.
 *      Root cause was progressSection being null causing a crash
 *      that silently broke ALL subsequent modal code.
 */

class FlightControlButtons {
    constructor() {
        this.takeoffBtn = null;
        this.landBtn = null;
        this.rtlBtn = null;
        this.modal = null;
        this.progressSection = null;

        this.isExecuting = false;
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
        // FIXED: progressSection may not exist in DOM — store null safely, never crash
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
        const closeBtn   = document.getElementById('modalCloseBtn');
        const cancelBtn  = document.getElementById('modalCancelBtn');
        const confirmBtn = document.getElementById('modalConfirmBtn');
        const altSlider  = document.getElementById('altitudeSlider');
        const spdSlider  = document.getElementById('speedSlider');
        const altValue   = document.getElementById('altitudeValue');
        const spdValue   = document.getElementById('speedValue');

        // ── X (close) button ──────────────────────────────────────────────────
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.hideTakeoffModal();
            });
        }

        // ── Cancel button ─────────────────────────────────────────────────────
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.hideTakeoffModal();
            });
        }

        // ── Confirm Takeoff button ────────────────────────────────────────────
        if (confirmBtn) {
            confirmBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.confirmTakeoff();
            });
        }

        // ── Click dark backdrop to close ──────────────────────────────────────
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideTakeoffModal();
            }
        });

        // ── Altitude slider ───────────────────────────────────────────────────
        if (altSlider) {
            altSlider.addEventListener('input', (e) => {
                this.takeoffSettings.altitude = parseFloat(e.target.value);
                if (altValue) altValue.textContent = `${this.takeoffSettings.altitude} m`;
            });
        }

        // ── Speed slider ──────────────────────────────────────────────────────
        if (spdSlider) {
            spdSlider.addEventListener('input', (e) => {
                this.takeoffSettings.speed = parseFloat(e.target.value);
                if (spdValue) spdValue.textContent = `${this.takeoffSettings.speed.toFixed(1)} m/s`;
            });
        }
    }

    // ── Open modal ────────────────────────────────────────────────────────────
    showTakeoffModal() {
        console.log('📋 Opening takeoff modal');

        // FIXED: always guard optional elements with null checks
        if (this.progressSection) {
            this.progressSection.classList.remove('active');
        }

        const modalActions = document.getElementById('modalActions');
        if (modalActions) modalActions.style.display = 'flex';

        // Sync sliders to remembered settings
        const altSlider = document.getElementById('altitudeSlider');
        const spdSlider = document.getElementById('speedSlider');
        const altValue  = document.getElementById('altitudeValue');
        const spdValue  = document.getElementById('speedValue');

        if (altSlider) {
            altSlider.value = this.takeoffSettings.altitude;
            if (altValue) altValue.textContent = `${this.takeoffSettings.altitude} m`;
        }
        if (spdSlider) {
            spdSlider.value = this.takeoffSettings.speed;
            if (spdValue) spdValue.textContent = `${this.takeoffSettings.speed.toFixed(1)} m/s`;
        }

        // Add active LAST — so nothing crashes before the modal actually opens
        this.modal.classList.add('active');
    }

    // ── Close modal ───────────────────────────────────────────────────────────
    hideTakeoffModal() {
        if (this.isExecuting) {
            console.log('⚠️ Cannot close modal while a command is executing');
            return;
        }
        console.log('📋 Closing takeoff modal');
        this.modal.classList.remove('active');

        // Reset UI back to initial state so next open looks clean
        const modalActions = document.getElementById('modalActions');
        if (modalActions) modalActions.style.display = 'flex';

        if (this.progressSection) {
            this.progressSection.classList.remove('active');
        }
    }

    // ── Confirm takeoff ───────────────────────────────────────────────────────
    confirmTakeoff() {
    console.log(`🚁 TAKEOFF — Alt: ${this.takeoffSettings.altitude}m  Speed: ${this.takeoffSettings.speed}m/s`);

    // Immediately close modal since we removed progress UI
    this.hideTakeoffModal();

    if (this.callbacks.onTakeoff) {
        this.callbacks.onTakeoff(this.takeoffSettings);
    } else {
        console.log("🧪 Simulated takeoff command sent");
    }
}

    completeTakeoff() {
        console.log('✅ TAKEOFF completed');
        this.clearExecutingState();
        setTimeout(() => {
            this.hideTakeoffModal();
            this.resetProgressBar();
        }, 1500);
    }

    resetProgressBar() {
        const fill   = document.getElementById('progressBarFill');
        const pct    = document.getElementById('progressPercentage');
        const status = document.getElementById('progressStatus');
        if (fill)   fill.style.width   = '0%';
        if (pct)    pct.textContent    = '0%';
        if (status) status.textContent = 'Initiating takeoff...';
    }

    executeLand() {
        console.log('🛬 LAND command');
        this.setExecutingState(this.landBtn, 'LAND');
        if (this.callbacks.onLand) {
            this.callbacks.onLand();
        } else {
            this.simulateCommand('LAND');
        }
    }

    executeRTL() {
        console.log('🏠 RTL command');
        this.setExecutingState(this.rtlBtn, 'RTL');
        if (this.callbacks.onRTL) {
            this.callbacks.onRTL();
        } else {
            this.simulateCommand('RTL');
        }
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

    simulateCommand(command) {
        console.log(`🧪 Simulating ${command}...`);
        setTimeout(() => {
            console.log(`✅ ${command} simulation done`);
            this.clearExecutingState();
            if (command === 'TAKEOFF') {
                this.hideTakeoffModal();
                this.resetProgressBar();
            }
        }, 3000);
    }

    onTakeoff(cb) { this.callbacks.onTakeoff = cb; }
    onLand(cb)    { this.callbacks.onLand    = cb; }
    onRTL(cb)     { this.callbacks.onRTL     = cb; }

    completeCommand() {
        if (this.isExecuting) this.clearExecutingState();
    }

    failCommand(msg) {
        if (this.isExecuting) {
            this.clearExecutingState();
            alert(`${this.currentCommand} failed: ${msg}`);
        }
    }

    isCommandExecuting() { return this.isExecuting; }
    getCurrentCommand()  { return this.currentCommand; }
    getTakeoffSettings() { return { ...this.takeoffSettings }; }
}

document.addEventListener('DOMContentLoaded', () => {
    window.flightControls = new FlightControlButtons();
});