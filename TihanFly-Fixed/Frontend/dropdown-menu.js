/**
 * Dropdown Menu Strip Handler
 *
 * Navigation (3 layers, all controlled by inline display styles only):
 *
 *  Layer 1 — flightControlsStrip   : TAKEOFF / LAND / RTL          (default visible)
 *  Layer 2 — dropdownMenuStrip     : PLAN / ANALYZE / CONFIG / SETTINGS  (logo click)
 *  Layer 3 — analyzePanel          : Analyze sidebar with 5 tools   (click ANALYZE)
 *  Layer 4 — atw-* full screen     : individual tool windows        (click tool item)
 *
 *  Forward:  Logo → L2 → ANALYZE → L3 → item → L4
 *  Backward: L4 Back → L3 → L3 Back → L2 → L2 Back → L1
 *
 *  Rule: only ONE layer visible at a time. All hide/show uses
 *        style.setProperty / style.removeProperty — NO classList.hidden fighting.
 */

/* ─── helpers ─── */
function showEl(el)  { if (el) el.style.removeProperty('display'); }
function hideEl(el)  { if (el) el.style.setProperty('display', 'none', 'important'); }
function forceEl(el, val) { if (el) el.style.setProperty('display', val, 'important'); }

class DropdownMenuStrip {
    constructor() {
        this.strip  = null;   // dropdownMenuStrip  (Layer 2)
        this.flight = null;   // flightControlsStrip (Layer 1)
        this.logo   = null;   // tihanLogo
        this.initialize();
    }

    initialize() {
        this.strip  = document.getElementById('dropdownMenuStrip');
        this.flight = document.getElementById('flightControlsStrip');
        this.logo   = document.getElementById('tihanLogo');

        if (!this.strip) { console.error('❌ dropdownMenuStrip not found'); return; }

        /* ── starting state: Layer 1 visible, Layer 2 hidden ── */
        hideEl(this.strip);
        showEl(this.flight);

        /* ── inject a Back button at the top of the PLAN strip ── */
        this._injectPlanBackBtn();

        /* ── event listeners ── */
        this._attachLogoClick();
        this._attachStripButtons();
        this._attachOutsideClick();

        if (this.logo) this.logo.style.cursor = 'pointer';
        console.log('✅ DropdownMenuStrip initialized');
    }

    /* ════════════════════════════════════════════════
       Inject a "← Back" button into the PLAN strip
       so clicking it returns to Layer 1
    ════════════════════════════════════════════════ */
    _injectPlanBackBtn() {
        if (document.getElementById('planStripBackBtn')) return;

        const btn = document.createElement('button');
        btn.id = 'planStripBackBtn';
        btn.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" style="width:13px;height:13px;flex-shrink:0">' +
                '<path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
            '</svg> Back';

        /* match the style of the existing strip buttons but smaller */
        Object.assign(btn.style, {
            display        : 'flex',
            alignItems     : 'center',
            gap            : '5px',
            background     : 'none',
            border         : '1px solid rgba(41,182,246,.35)',
            color          : '#29b6f6',
            fontSize       : '11px',
            fontWeight     : '600',
            cursor         : 'pointer',
            padding        : '5px 12px',
            borderRadius   : '6px',
            margin         : '6px 8px 4px',
            transition     : 'background .15s',
            width          : 'calc(100% - 16px)',
            boxSizing      : 'border-box',
            justifyContent : 'center',
        });
        btn.addEventListener('mouseenter', () => { btn.style.background = 'rgba(41,182,246,.12)'; });
        btn.addEventListener('mouseleave', () => { btn.style.background = 'none'; });

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showLayer1();   /* Layer 2 Back → Layer 1 */
        });

        /* insert as first child of the strip */
        if (this.strip.firstChild) {
            this.strip.insertBefore(btn, this.strip.firstChild);
        } else {
            this.strip.appendChild(btn);
        }
    }

    /* ════════════════════════════════════════════════
       Layer transitions
    ════════════════════════════════════════════════ */

    /** Show Layer 1 (TAKEOFF/LAND/RTL), hide everything else */
    showLayer1() {
        console.log('▶ Layer 1: TAKEOFF/LAND/RTL');

        /* show TAKEOFF strip */
        if (this.flight) {
            this.flight.style.removeProperty('display');
        }

        /* hide PLAN strip */
        if (this.strip) {
            this.strip.style.setProperty('display', 'none', 'important');
        }

        /* hide analyze sidebar */
        const ap = document.getElementById('analyzePanel');
        if (ap) ap.style.setProperty('display', 'none', 'important');

        if (this.logo) this.logo.classList.remove('menu-active');
    }

    /** Show Layer 2 (PLAN/ANALYZE strip), hide Layer 1 + 3 */
    showLayer2() {
        console.log('▶ Layer 2: PLAN/ANALYZE/CONFIG/SETTINGS');

        /* suppress outside-click listener for this tick so the click
           that triggered showLayer2 doesn't immediately collapse the strip */
        this._suppressOutsideClick = true;
        setTimeout(() => { this._suppressOutsideClick = false; }, 0);

        /* force PLAN strip visible — inline style beats everything */
        if (this.strip) {
            this.strip.style.removeProperty('display');
            this.strip.style.setProperty('display', 'flex', 'important');
        }

        /* hide TAKEOFF/LAND/RTL */
        if (this.flight) {
            this.flight.style.setProperty('display', 'none', 'important');
        }

        /* hide analyze sidebar if open */
        const ap = document.getElementById('analyzePanel');
        if (ap) ap.style.setProperty('display', 'none', 'important');

        if (this.logo) this.logo.classList.add('menu-active');
    }

    /** Show Layer 3 (Analyze sidebar), hide Layer 1 + 2 */
    showLayer3() {
        console.log('▶ Layer 3: Analyze sidebar');

        /* hide PLAN strip */
        if (this.strip) {
            this.strip.style.setProperty('display', 'none', 'important');
        }

        /* hide TAKEOFF strip */
        if (this.flight) {
            this.flight.style.setProperty('display', 'none', 'important');
        }

        if (this.logo) this.logo.classList.remove('menu-active');

        /* show analyze sidebar */
        if (window.AnalyzeToolsPanel && window.AnalyzeToolsPanel.showAnalyzePanel) {
            window.AnalyzeToolsPanel.showAnalyzePanel();
        } else {
            console.error('❌ AnalyzeToolsPanel not loaded!');
        }
    }

    /* ════════════════════════════════════════════════
       Logo click: toggle Layer1 ↔ Layer2
    ════════════════════════════════════════════════ */
    _attachLogoClick() {
        if (!this.logo) return;
        this.logo.addEventListener('click', (e) => {
            e.stopPropagation();
            const stripVisible = this.strip.style.display !== 'none' &&
                                 this.strip.style.display !== '';
            /* getComputedStyle fallback */
            const cs = getComputedStyle(this.strip).display;
            if (cs === 'none') {
                this.showLayer2();
            } else {
                this.showLayer1();
            }
        });
    }

    /* ════════════════════════════════════════════════
       Buttons inside PLAN strip
    ════════════════════════════════════════════════ */
    _attachStripButtons() {
        const planBtn    = document.getElementById('planFlightBtn');
        const analyzeBtn = document.getElementById('analyzeBtn');
        const configBtn  = document.getElementById('vehicleConfigBtn');
        const settBtn    = document.getElementById('appSettingsBtn');

        if (planBtn) {
            planBtn.addEventListener('click', () => {
                this.showLayer1();
                if (window.PlanFlight) window.PlanFlight.enter();
                else console.warn('⚠️ PlanFlight not loaded');
            });
        }

        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => {
                this.showLayer3();
            });
        }

        if (configBtn) {
            configBtn.addEventListener('click', () => {
                alert('Vehicle Configuration\n\nFeature coming soon!');
                this.showLayer1();
            });
        }

        if (settBtn) {
            settBtn.addEventListener('click', () => {
                alert('Application Settings\n\nFeature coming soon!');
                this.showLayer1();
            });
        }
    }

    /* ════════════════════════════════════════════════
       Outside click closes Layer 2 back to Layer 1
       — suppressed for one tick after showLayer2()
         so the Back-btn click in analyzePanel doesn't
         immediately collapse the strip it just opened
    ════════════════════════════════════════════════ */
    _attachOutsideClick() {
        document.addEventListener('click', (e) => {
            /* if showLayer2 was just called, skip this tick */
            if (this._suppressOutsideClick) return;

            const cs = getComputedStyle(this.strip).display;
            if (cs === 'none') return;

            const inside = this.strip.contains(e.target);
            const onLogo = this.logo && this.logo.contains(e.target);
            if (!inside && !onLogo) {
                this.showLayer1();
            }
        });
    }

    /* ── public aliases used by DropdownStrip global object ── */
    show()         { this.showLayer2(); }
    hide()         { this.showLayer1(); }
    showPlanStrip(){ this.showLayer2(); }  /* called from Analyze sidebar Back btn */
    showFlight()   { this.showLayer1(); }
}

/* ═══════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════ */
let dropdownMenuStrip = null;

function initializeDropdownMenuStrip() {
    if (!dropdownMenuStrip) dropdownMenuStrip = new DropdownMenuStrip();
    return dropdownMenuStrip;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDropdownMenuStrip);
} else {
    initializeDropdownMenuStrip();
}

/* global API used by other modules */
window.DropdownStrip = {
    show:             () => { if (dropdownMenuStrip) dropdownMenuStrip.showLayer2(); },
    hide:             () => { if (dropdownMenuStrip) dropdownMenuStrip.showLayer1(); },
    showPlanStrip:    () => { if (dropdownMenuStrip) dropdownMenuStrip.showLayer2(); },
    showFlightControls: () => { if (dropdownMenuStrip) dropdownMenuStrip.showLayer1(); },
};

console.log('✅ dropdown-menu.js ready');