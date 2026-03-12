/**
 * calib-accel.js
 * TiHANFly GCS — Accelerometer Calibration Panel
 * Renders into #panel-calib-accel and wires its own logic.
 */
(function () {
    'use strict';

    const PLAY = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
    const NEXT = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`;
    const WARN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
    const CHECK = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>`;

    const FACE_IMG = {
        'level'   : 'resources/calibration/accel_down.png',
        'left'    : 'resources/calibration/accel_left.png',
        'right'   : 'resources/calibration/accel_right.png',
        'nose-up' : 'resources/calibration/accel_back.png',
        'nose-dn' : 'resources/calibration/accel_front.png',
        'back'    : 'resources/calibration/accel_up.png',
    };

    const FACES = [
        { key: 'level',   label: 'Level'   },
        { key: 'left',    label: 'Left'    },
        { key: 'right',   label: 'Right'   },
        { key: 'nose-up', label: 'Nose Up' },
        { key: 'nose-dn', label: 'Nose Dn' },
        { key: 'back',    label: 'Back'    },
    ];

    function buildCubeGrid() {
        return FACES.map(f => `
        <div class="calib-cube-face" data-face="${f.key}">
            <img src="${FACE_IMG[f.key]}" alt="${f.label}" class="calib-face-img" draggable="false"/>
            <span class="calib-face-label">${f.label}</span>
            <span class="calib-face-tick">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            </span>
        </div>`).join('');
    }

    function buildModal() {
        return `
        <div class="calib-modal-overlay" id="accelModal">
            <div class="calib-modal-box">
                <div class="calib-modal-icon">${CHECK}</div>
                <h3 class="calib-modal-title">Calibration Complete</h3>
                <p class="calib-modal-body">
                    All 6 accelerometer positions have been successfully captured.<br>
                    The vehicle's accelerometer is now calibrated and ready.
                </p>
                <div class="calib-modal-stats">
                    <div class="calib-modal-stat">
                        <span class="calib-modal-stat-val">6 / 6</span>
                        <span class="calib-modal-stat-lbl">Positions</span>
                    </div>
                    <div class="calib-modal-stat">
                        <span class="calib-modal-stat-val">✓</span>
                        <span class="calib-modal-stat-lbl">3-Axis Data</span>
                    </div>
                    <div class="calib-modal-stat">
                        <span class="calib-modal-stat-val">OK</span>
                        <span class="calib-modal-stat-lbl">Status</span>
                    </div>
                </div>
                <div class="calib-modal-actions">
                    <button class="calib-btn calib-btn-primary" id="accelModalOkBtn">OK</button>
                    <button class="calib-btn calib-btn-secondary" id="accelModalRecalBtn">Recalibrate</button>
                </div>
            </div>
        </div>`;
    }

    function render() {
        return `
<div class="settings-panel-title">Accelerometer Calibration</div>

<div class="calib-warning">
  ${WARN}
  Place the drone on a firm, level surface before starting. Keep the vehicle
  <strong style="color:#ffa000">completely still</strong> during each position capture. Do not arm the drone.
</div>

<div class="calib-card">
  <div class="calib-visual">
    <div class="calib-icon-wrap">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    </div>
    <div class="calib-meta">
      <h4>6-Position Calibration</h4>
      <p>Click <strong>Start</strong>, hold the drone in the highlighted position, then click <strong>Next</strong> to capture and advance.</p>
    </div>
  </div>

  <div class="calib-status-row">
    <span class="calib-status-label">Status</span>
    <span class="calib-status-value idle" id="accelStatus">NOT STARTED</span>
  </div>

  <div class="calib-progress-wrap">
    <div class="calib-progress-label">
      <span>Positions captured</span>
      <span id="accelPct">0 / 6</span>
    </div>
    <div class="calib-progress-bar">
      <div class="calib-progress-fill" id="accelBar"></div>
    </div>
  </div>

  <div class="calib-step-hint" id="accelStepHint"></div>

  <div class="calib-cube-grid">
    ${buildCubeGrid()}
  </div>

  <div class="calib-actions">
    <button class="calib-btn calib-btn-primary"   id="accelStartBtn">${PLAY} Start Calibration</button>
    <button class="calib-btn calib-btn-primary"   id="accelNextBtn"  style="display:none">${NEXT} Next Position</button>
    <button class="calib-btn calib-btn-success"   id="accelOkBtn"    style="display:none">✓ OK</button>
    <button class="calib-btn calib-btn-secondary" id="accelResetBtn">Reset</button>
  </div>
</div>

${buildModal()}`;
    }

    function init() {
        const host = document.getElementById('panel-calib-accel');
        if (!host) return;
        host.innerHTML = render();

        const { setStatus, toast } = window.SwUtil;

        let currentStep = -1;
        let capturing   = false;

        function getFaceEl(key) {
            return host.querySelector(`.calib-cube-face[data-face="${key}"]`);
        }

        function refresh(done) {
            const bar = document.getElementById('accelBar');
            const pct = document.getElementById('accelPct');
            if (bar) bar.style.width = (done / 6 * 100) + '%';
            if (pct) pct.textContent  = done + ' / 6';
        }

        function updateHint(text) {
            const hint = document.getElementById('accelStepHint');
            if (hint) {
                hint.textContent = text;
                hint.style.display = text ? 'block' : 'none';
            }
        }

        function highlightStep(stepIndex) {
            host.querySelectorAll('.calib-cube-face').forEach(f => f.classList.remove('active'));
            if (stepIndex >= 0 && stepIndex < FACES.length) {
                const face = getFaceEl(FACES[stepIndex].key);
                if (face) face.classList.add('active');
                updateHint(`Position ${stepIndex + 1} of 6 — Hold drone in the "${FACES[stepIndex].label}" orientation`);
            }
        }

        function showModal() {
            const modal = document.getElementById('accelModal');
            if (modal) {
                modal.classList.add('visible');
            }
        }

        function hideModal() {
            const modal = document.getElementById('accelModal');
            if (modal) modal.classList.remove('visible');
        }

        function captureStep(stepIndex) {
            if (capturing) return;
            capturing = true;

            const face = getFaceEl(FACES[stepIndex].key);
            if (face) {
                setTimeout(() => {
                    face.classList.remove('active');
                    face.classList.add('done');
                    capturing = false;

                    const done = stepIndex + 1;
                    refresh(done);

                    if (done === 6) {
                        currentStep = 6;
                        // Hide Next, show OK
                        document.getElementById('accelNextBtn').style.display = 'none';
                        document.getElementById('accelOkBtn').style.display   = 'inline-flex';
                        updateHint('');
                        setStatus('accelStatus', 'COMPLETE', 'good');
                        toast('All 6 positions captured! Click OK to finish.');
                    } else {
                        currentStep = done;
                        highlightStep(currentStep);
                        setStatus('accelStatus', `POSITION ${currentStep + 1} / 6`, 'warn');
                    }
                }, 850);
            }
        }

        /* ── Start ── */
        document.getElementById('accelStartBtn')?.addEventListener('click', () => {
            host.querySelectorAll('.calib-cube-face').forEach(f => f.classList.remove('done', 'active'));
            refresh(0);
            currentStep = 0;
            capturing   = false;

            document.getElementById('accelStartBtn').style.display = 'none';
            document.getElementById('accelNextBtn').style.display  = 'inline-flex';
            document.getElementById('accelOkBtn').style.display    = 'none';

            highlightStep(0);
            setStatus('accelStatus', 'POSITION 1 / 6', 'warn');
            toast('Hold drone in the "Level" position, then click Next');
        });

        /* ── Next ── */
        document.getElementById('accelNextBtn')?.addEventListener('click', () => {
            if (capturing || currentStep < 0 || currentStep >= 6) return;
            captureStep(currentStep);
        });

        /* ── OK button → show modal ── */
        document.getElementById('accelOkBtn')?.addEventListener('click', () => {
            showModal();
        });

        /* ── Modal OK → close modal ── */
        document.getElementById('accelModalOkBtn')?.addEventListener('click', () => {
            hideModal();
        });

        /* ── Modal Recalibrate → reset everything ── */
        document.getElementById('accelModalRecalBtn')?.addEventListener('click', () => {
            hideModal();
            host.querySelectorAll('.calib-cube-face').forEach(f => f.classList.remove('done', 'active'));
            refresh(0);
            currentStep = -1;
            capturing   = false;
            document.getElementById('accelStartBtn').style.display = 'inline-flex';
            document.getElementById('accelNextBtn').style.display  = 'none';
            document.getElementById('accelOkBtn').style.display    = 'none';
            updateHint('');
            setStatus('accelStatus', 'NOT STARTED', 'idle');
        });

        /* ── Click overlay to close ── */
        document.getElementById('accelModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'accelModal') hideModal();
        });

        /* ── Reset ── */
        document.getElementById('accelResetBtn')?.addEventListener('click', () => {
            host.querySelectorAll('.calib-cube-face').forEach(f => f.classList.remove('done', 'active'));
            refresh(0);
            currentStep = -1;
            capturing   = false;
            document.getElementById('accelStartBtn').style.display = 'inline-flex';
            document.getElementById('accelNextBtn').style.display  = 'none';
            document.getElementById('accelOkBtn').style.display    = 'none';
            updateHint('');
            setStatus('accelStatus', 'NOT STARTED', 'idle');
            hideModal();
        });
    }

    window.CalibAccel = { init };
    console.log('✅ CalibAccel module ready');
})();