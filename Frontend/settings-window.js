/**
 * settings-window.js
 * TiHANFly GCS — Vehicle Configuration Window
 * Sidebar routing only. Each panel is in its own file:
 *   calib-accel.js / calib-accel.css
 *   calib-compass.js / calib-compass.css
 *   calib-radio.js / calib-radio.css
 *   calib-esc.js / calib-esc.css
 *   param-user.js / param-user.css
 *   param-full.js / param-full.css
 *
 * Usage: SettingsWindow.open()  /  SettingsWindow.close()
 */
(function () {
    'use strict';

    // ── Shell template (sidebar + empty panel slots) ───────────────────────────
    function buildShellHTML() {
        return `
<div class="settings-overlay" id="settingsOverlay">
  <div class="settings-window">

    <!-- HEADER -->
    <div class="settings-header">
      <div class="settings-header-left">
        <div class="settings-header-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </div>
        <div>
          <div class="settings-header-title">Vehicle Configuration</div>
          <div class="settings-header-subtitle">TiHANFly Ground Control Station</div>
        </div>
      </div>
      <button class="settings-close-btn" id="settingsCloseBtn">×</button>
    </div>

    <!-- BODY -->
    <div class="settings-body">

      <!-- SIDEBAR -->
      <div class="settings-sidebar">
        <div class="settings-sidebar-label">Calibration</div>

        <button class="settings-nav-btn active" data-panel="calib-accel">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Accelerometer
        </button>

        <button class="settings-nav-btn" data-panel="calib-compass">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
          </svg>
          Compass
        </button>

        <button class="settings-nav-btn" data-panel="calib-radio">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 6l11 6 11-6M1 12l11 6 11-6" stroke-linecap="round"/>
          </svg>
          Radio
        </button>

        <button class="settings-nav-btn" data-panel="calib-esc">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
          </svg>
          ESC
        </button>

        <div class="settings-sidebar-label">Parameters</div>

        <button class="settings-nav-btn" data-panel="param-user">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          User Params
        </button>

        <button class="settings-nav-btn" data-panel="param-full">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="8"  y1="6"  x2="21" y2="6"/>
            <line x1="8"  y1="12" x2="21" y2="12"/>
            <line x1="8"  y1="18" x2="21" y2="18"/>
            <line x1="3"  y1="6"  x2="3.01" y2="6"  stroke-linecap="round"/>
            <line x1="3"  y1="12" x2="3.01" y2="12" stroke-linecap="round"/>
            <line x1="3"  y1="18" x2="3.01" y2="18" stroke-linecap="round"/>
          </svg>
          Full Params
        </button>
      </div>

      <!-- PANEL HOST — each panel module renders into here -->
      <div class="settings-content" id="settingsContent">
        <div class="settings-panel active" id="panel-calib-accel"></div>
        <div class="settings-panel"        id="panel-calib-compass"></div>
        <div class="settings-panel"        id="panel-calib-radio"></div>
        <div class="settings-panel"        id="panel-calib-esc"></div>
        <div class="settings-panel"        id="panel-param-user"></div>
        <div class="settings-panel"        id="panel-param-full"></div>
      </div>

    </div><!-- /settings-body -->

    <!-- FOOTER -->
    <div class="settings-footer">
      <button class="settings-btn settings-btn-cancel" id="sw-cancelBtn">Close</button>
    </div>

  </div>
</div>
<div class="settings-toast" id="settingsToast"></div>`;
    }

    // ── Helpers (shared globally so panel modules can use them) ───────────────
    window.SwUtil = {
        q:  s => document.querySelector(s),
        qa: s => document.querySelectorAll(s),

        setStatus(id, text, cls) {
            const el = document.getElementById(id);
            if (el) { el.textContent = text; el.className = 'calib-status-value ' + cls; }
        },

        toast(msg, err) {
            const t = document.getElementById('settingsToast');
            if (!t) return;
            t.textContent = (err ? '✕  ' : '✓  ') + msg;
            t.className   = 'settings-toast ' + (err ? 'error' : 'success');
            t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 2600);
        }
    };

    // ── Open / Close ──────────────────────────────────────────────────────────
    function open() {
        if (!document.getElementById('settingsOverlay')) {
            const wrap = document.createElement('div');
            wrap.innerHTML = buildShellHTML();
            while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
            bindSidebar();
            initPanels();          // ask each module to render into its slot
        }
        const overlay = document.getElementById('settingsOverlay');
        overlay.style.display = 'flex';
        overlay.classList.remove('closing');
        console.log('⚙️ Vehicle Config window opened');
    }

    function close() {
        const overlay = document.getElementById('settingsOverlay');
        if (!overlay) return;
        overlay.classList.add('closing');
        setTimeout(() => { overlay.style.display = 'none'; overlay.classList.remove('closing'); }, 160);
    }

    // ── Sidebar routing ───────────────────────────────────────────────────────
    function bindSidebar() {
        const { q, qa } = window.SwUtil;

        q('#settingsCloseBtn')?.addEventListener('click', close);
        q('#sw-cancelBtn')?.addEventListener('click', close);

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                const o = document.getElementById('settingsOverlay');
                if (o && o.style.display !== 'none') close();
            }
        });

        qa('.settings-nav-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                qa('.settings-nav-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                qa('.settings-panel').forEach(p => p.classList.remove('active'));
                const target = document.getElementById('panel-' + this.dataset.panel);
                if (target) target.classList.add('active');
            });
        });
    }

    // ── Ask each panel module to initialise itself ────────────────────────────
    function initPanels() {
        [
            window.CalibAccel,
            window.CalibCompass,
            window.CalibRadio,
            window.CalibESC,
            window.ParamUser,
            window.ParamFull,
        ].forEach(mod => {
            if (mod && typeof mod.init === 'function') mod.init();
            else console.warn('SettingsWindow: panel module not loaded', mod);
        });
    }

    // ── Public API ────────────────────────────────────────────────────────────
    window.SettingsWindow = { open, close };
    console.log('✅ SettingsWindow shell ready');

})();