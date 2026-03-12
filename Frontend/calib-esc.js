/**
 * calib-esc.js
 * TiHANFly GCS — ESC Calibration Panel
 * Premium aerospace UI — Orbitron + IBM Plex typography
 */
(function () {
    'use strict';

    function render() {
        return `
<div class="mp-esc-panel">

  <!-- Title bar -->
  <div class="mp-esc-title">
    <span class="mp-esc-title-text">ESC Calibration</span>
    <span class="mp-esc-title-badge">AC 3.3+</span>
  </div>

  <!-- Top: button + instructions -->
  <div class="mp-esc-top">
    <div class="mp-esc-top-left">
      <button class="mp-btn-calibrate" id="escCalibrateBtn">
        <span class="btn-icon">⚡</span>
        Calibrate ESCs
      </button>
    </div>
    <div class="mp-esc-instructions">
      <span class="warning-tag">Remove Props Before Proceeding</span>
      <ol>
        <li>Press Calibrate, then disconnect USB and battery</li>
        <li>Reconnect battery — wait for LED flash sequence</li>
        <li>Push Safety Switch if present</li>
        <li>ESCs will beep on calibration confirmation</li>
        <li>Restart flight controller normally when complete</li>
      </ol>
    </div>
  </div>

  <div class="mp-esc-divider"></div>

  <!-- Section label -->
  <div class="mp-section-header">
    <span class="mp-section-header-text">Motor Output Parameters</span>
  </div>

  <!-- Form fields -->
  <div class="mp-esc-form">

    <div class="mp-field-row">
      <label class="mp-field-label">ESC Protocol</label>
      <div class="mp-field-control">
        <select class="mp-select" id="escType">
          <option>Normal</option>
          <option>Oneshot125</option>
          <option>Oneshot42</option>
          <option>Multishot</option>
          <option>DShot150</option>
          <option>DShot300</option>
          <option>DShot600</option>
        </select>
      </div>
      <span class="mp-field-hint"></span>
    </div>

    <div class="mp-field-row">
      <label class="mp-field-label">PWM Out Min</label>
      <div class="mp-field-control">
        <input type="number" class="mp-spinbox" id="pwmMin" value="0" min="0" max="2000" step="1">
      </div>
      <span class="mp-field-hint">// 0 → use RX input range</span>
    </div>

    <div class="mp-field-row">
      <label class="mp-field-label">PWM Out Max</label>
      <div class="mp-field-control">
        <input type="number" class="mp-spinbox" id="pwmMax" value="0" min="0" max="2000" step="1">
      </div>
      <span class="mp-field-hint">// 0 → use RX input range</span>
    </div>

    <div class="mp-field-row">
      <label class="mp-field-label">Spin When Armed</label>
      <div class="mp-field-control">
        <input type="number" class="mp-spinbox" id="spinArmed" value="0.100" min="0" max="1" step="0.001">
      </div>
      <span class="mp-field-hint">// speed at zero throttle while armed</span>
    </div>

    <div class="mp-field-row">
      <label class="mp-field-label">Spin Minimum</label>
      <div class="mp-field-control">
        <input type="number" class="mp-spinbox" id="spinMin" value="0.150" min="0" max="1" step="0.001">
      </div>
      <span class="mp-field-hint">// min in-flight RPM (> spin when armed)</span>
    </div>

    <div class="mp-field-row">
      <label class="mp-field-label">Spin Maximum</label>
      <div class="mp-field-control">
        <input type="number" class="mp-spinbox" id="spinMax" value="0.950" min="0" max="1" step="0.001">
      </div>
      <span class="mp-field-hint">// max in-flight RPM ceiling</span>
    </div>

  </div>

  <!-- Status bar -->
  <div class="mp-esc-statusbar" id="escStatusBar">
    <div class="mp-status-dot"></div>
    <span id="escStatusMsg">System ready</span>
    <span class="mp-status-brand">TiHANFly GCS</span>
  </div>

</div>`;
    }

    function setStatus(msg, busy) {
        const bar = document.getElementById('escStatusBar');
        const txt = document.getElementById('escStatusMsg');
        if (txt) txt.textContent = msg;
        if (bar) {
            busy ? bar.classList.add('busy') : bar.classList.remove('busy');
        }
    }

    function init() {
        const host = document.getElementById('panel-calib-esc');
        if (!host) return;
        host.innerHTML = render();

        document.getElementById('escCalibrateBtn')?.addEventListener('click', () => {
            const btn = document.getElementById('escCalibrateBtn');
            if (!btn || btn.disabled) return;

            setStatus('Calibrating — follow the step sequence carefully...', true);
            btn.innerHTML = `<span class="btn-icon">⏳</span>Calibrating...`;
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = `<span class="btn-icon">⚡</span>Calibrate ESCs`;
                btn.disabled = false;
                setStatus('Calibration complete — restart flight controller normally', false);
            }, 5000);

            if (window.SwUtil?.toast) {
                window.SwUtil.toast('ESC calibration initiated — follow the step sequence carefully');
            }
        });
    }

    window.CalibESC = { init };
    console.log('✅ CalibESC module ready');
})();