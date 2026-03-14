/**
 * param-user.js
 * TiHANFly GCS — User Parameters Panel — Professional Redesign
 * Renders into #panel-param-user. Requires param-user.css.
 */
(function () {
  'use strict';

  /* ─── Parameter metadata ─────────────────────── */
  const USER_PARAMS = [
    { name:'WPNAV_SPEED',    description:'Waypoint cruise speed',                  value:500,   type:'int',   min:20,   max:2000,  units:'cm/s'  },
    { name:'WPNAV_ACCEL',    description:'Waypoint acceleration',                  value:250,   type:'float', min:10,   max:980,   units:'cm/s²' },
    { name:'WPNAV_RADIUS',   description:'Waypoint acceptance radius',             value:200,   type:'int',   min:5,    max:3000,  units:'cm'    },
    { name:'PILOT_SPEED_UP', description:'Max climb speed',                        value:250,   type:'int',   min:10,   max:500,   units:'cm/s'  },
    { name:'PILOT_SPEED_DN', description:'Max descent speed',                      value:150,   type:'int',   min:10,   max:500,   units:'cm/s'  },
    { name:'RTL_ALT',        description:'RTL altitude',                           value:1500,  type:'int',   min:200,  max:30000, units:'cm'    },
    { name:'RTL_SPEED',      description:'RTL return speed (0 = use WPNAV_SPEED)', value:0,     type:'int',   min:0,    max:2000,  units:'cm/s'  },
    { name:'MOT_THST_HOVER', description:'Motor hover thrust',                     value:0.35,  type:'float', min:0.2,  max:0.8,   units:''      },
    { name:'MOT_SPIN_ARM',   description:'Motor spin when armed',                  value:0.1,   type:'float', min:0,    max:0.3,   units:''      },
    { name:'FENCE_ENABLE',   description:'Enable geofence',                        value:0,     type:'bool',  units:''      },
    { name:'FENCE_ALT_MAX',  description:'Geofence max altitude',                  value:100,   type:'int',   min:10,   max:1000,  units:'m'     },
    { name:'BATT_LOW_VOLT',  description:'Low battery voltage',                    value:10.5,  type:'float', min:0,    max:100,   units:'V'     },
    { name:'BATT_CRT_VOLT',  description:'Critical battery voltage',               value:9.8,   type:'float', min:0,    max:100,   units:'V'     },
    { name:'ARMING_CHECK',   description:'Arming check options',                   value:1,     type:'enum',  units:'',
      options:{ 0:'Disabled', 1:'All checks', 2:'Barometer', 4:'Compass', 8:'GPS lock', 16:'INS', 32:'RC channels' } },
    { name:'RC6_OPTION',     description:'RC channel 6 option',                    value:0,     type:'enum',  units:'',
      options:{ 0:'Do Nothing', 7:'Save Waypoint', 9:'Camera Trigger', 28:'Relay On/Off', 58:'Clear waypoints', 90:'Motor Estop' } },
    { name:'RC7_OPTION',     description:'RC channel 7 option',                    value:0,     type:'enum',  units:'',
      options:{ 0:'Do Nothing', 7:'Save Waypoint', 9:'Camera Trigger', 28:'Relay On/Off', 58:'Clear waypoints', 90:'Motor Estop' } },
    { name:'SCHED_LOOP_RATE',description:'Scheduler loop rate',                    value:400,   type:'enum',  units:'Hz',
      options:{ 50:'50 Hz', 100:'100 Hz', 200:'200 Hz', 250:'250 Hz', 300:'300 Hz', 400:'400 Hz' } },
  ];

  /* ─── State ──────────────────────────────────── */
  const defaults = USER_PARAMS.map(p => ({ ...p }));
  const state = {
    params: USER_PARAMS.map(p => ({ ...p })),
    dirty: new Set(),
    filter: '',
    showDirtyOnly: false,
  };

  /* ─── Read / Write stubs ─────────────────────── */
  function readParamsFromFC() {
    console.info('[ParamUser] readParamsFromFC()');
    state.dirty.clear();
    rebuildRows();
    window.SwUtil?.toast('Parameters read from flight controller');
  }

  function writeParamsToFC(modified) {
    if (!modified.length) { window.SwUtil?.toast('No changes to write'); return; }
    console.info('[ParamUser] writeParamsToFC() →', modified);
    modified.forEach(p => {
      const def = defaults.find(d => d.name === p.name);
      if (def) def.value = p.value;
    });
    state.dirty.clear();
    rebuildRows();
    window.SwUtil?.toast(`${modified.length} parameter(s) written to FC`);
  }

  /* ─── Input renderers ────────────────────────── */
  function renderInput(p) {
    const dirty = state.dirty.has(p.name) ? ' dirty' : '';
    switch (p.type) {
      case 'bool':
        return `<label class="pu-toggle">
          <input type="checkbox" class="pu-bool-input" data-name="${p.name}" ${p.value ? 'checked' : ''}>
          <span class="pu-toggle-track"><span class="pu-toggle-thumb"></span></span>
          <span class="pu-toggle-label">${p.value ? 'ON' : 'OFF'}</span>
        </label>`;

      case 'enum':
        const opts = Object.entries(p.options || {})
          .map(([k, v]) => `<option value="${k}"${String(p.value)===k?' selected':''}>${v}</option>`)
          .join('');
        return `<select class="pu-select${dirty}" data-name="${p.name}">${opts}</select>`;

      case 'float':
        return `<input class="pu-num-input${dirty}" type="number" data-name="${p.name}"
                  value="${p.value}" step="0.01"
                  ${p.min!=null?`min="${p.min}"`:''}
                  ${p.max!=null?`max="${p.max}"`:''}> `;

      default: // int
        return `<input class="pu-num-input${dirty}" type="number" data-name="${p.name}"
                  value="${p.value}" step="1"
                  ${p.min!=null?`min="${p.min}"`:''}
                  ${p.max!=null?`max="${p.max}"`:''}> `;
    }
  }

  /* ─── Build rows via DocumentFragment ───────── */
  function buildFragment(params) {
    const frag = document.createDocumentFragment();
    params.forEach(p => {
      const def = defaults.find(d => d.name === p.name);
      const isDirty = state.dirty.has(p.name);
      const tr = document.createElement('tr');
      tr.className = 'pu-row' + (isDirty ? ' pu-row--dirty' : '');
      tr.dataset.name = p.name;
      tr.innerHTML = `
        <td class="col-name">
          <div class="pu-name-cell">
            <span class="pu-dot"></span>
            <span class="pu-param-name">${p.name}</span>
          </div>
        </td>
        <td class="col-desc">
          <div class="pu-desc-cell">
            <span class="pu-param-desc">${p.description}</span>
            ${p.units ? `<span class="pu-units">${p.units}</span>` : ''}
          </div>
        </td>
        <td class="col-val">${renderInput(p)}</td>
        <td class="col-default">
          <span class="pu-default-val">${def ? def.value : '—'}</span>
        </td>`;
      frag.appendChild(tr);
    });
    return frag;
  }

  /* ─── Rebuild table ──────────────────────────── */
  function rebuildRows() {
    const tbody = document.getElementById('puTbody');
    const noResults = document.getElementById('puNoResults');
    if (!tbody) return;

    const q = state.filter.toLowerCase();
    let visible = state.params.filter(p =>
      (!q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) &&
      (!state.showDirtyOnly || state.dirty.has(p.name))
    );

    tbody.innerHTML = '';
    tbody.appendChild(buildFragment(visible));

    if (noResults) noResults.style.display = !visible.length ? 'block' : 'none';
    updateStats();
    updateWriteBtn();
  }

  /* ─── Stats badge in header ──────────────────── */
  function updateStats() {
    const totalEl = document.getElementById('puStatTotal');
    const dirtyEl = document.getElementById('puStatDirty');
    if (totalEl) totalEl.textContent = state.params.length;
    if (dirtyEl) dirtyEl.textContent = state.dirty.size;
  }

  function updateWriteBtn() {
    const btn = document.getElementById('puWriteBtn');
    if (!btn) return;
    const n = state.dirty.size;
    let badge = btn.querySelector('.pu-dirty-count');
    if (n > 0) {
      if (!badge) { badge = document.createElement('span'); badge.className = 'pu-dirty-count'; btn.appendChild(badge); }
      badge.textContent = n;
    } else if (badge) badge.remove();
  }

  /* ─── Change handler (delegated) ────────────── */
  function onParamChange(e) {
    const el = e.target;
    const name = el.dataset.name;
    if (!name) return;

    const paramState = state.params.find(p => p.name === name);
    const paramDef   = defaults.find(p => p.name === name);
    if (!paramState) return;

    let newVal;
    if (el.type === 'checkbox') {
      newVal = el.checked ? 1 : 0;
      const lbl = el.closest('.pu-toggle')?.querySelector('.pu-toggle-label');
      if (lbl) lbl.textContent = el.checked ? 'ON' : 'OFF';
    } else {
      newVal = el.type === 'number' ? parseFloat(el.value) : el.value;
    }

    paramState.value = newVal;
    const isDirty = String(newVal) !== String(paramDef?.value);
    if (isDirty) state.dirty.add(name); else state.dirty.delete(name);

    const tr = document.querySelector(`#puTbody tr[data-name="${name}"]`);
    if (tr) {
      tr.classList.toggle('pu-row--dirty', isDirty);
      el.classList.toggle('dirty', isDirty && el.type !== 'checkbox');
    }

    updateStats();
    updateWriteBtn();
  }

  /* ─── Shell HTML ─────────────────────────────── */
  function renderShell() {
    return `
<div class="pu-card">
  <div class="pu-header">
    <div class="pu-header-icon">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    </div>
    <div class="pu-header-text">
      <h4>Commonly Edited Parameters</h4>
      <p>Most frequently tuned flight parameters. Click any value to edit inline, then Write to FC to apply.</p>
    </div>
    <div class="pu-header-stats">
      <div class="pu-stat">
        <span class="pu-stat-val" id="puStatTotal">0</span>
        <span class="pu-stat-label">Total</span>
      </div>
      <div class="pu-stat">
        <span class="pu-stat-val accent" id="puStatDirty">0</span>
        <span class="pu-stat-label">Modified</span>
      </div>
    </div>
  </div>

  <div class="pu-toolbar">
    <div class="pu-search-wrap">
      <svg class="pu-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input id="puSearch" class="pu-search-input" type="text" placeholder="Search parameters by name or description…" autocomplete="off">
      <button id="puSearchClear" class="pu-search-clear" title="Clear">✕</button>
    </div>
    <button class="pu-filter-tag" id="puDirtyFilter">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="4"/>
      </svg>
      Modified only
    </button>
  </div>

  <div class="pu-table-wrap">
    <table class="pu-table">
      <thead>
        <tr>
          <th class="col-name">Parameter</th>
          <th class="col-desc">Description</th>
          <th class="col-val">Value</th>
          <th class="col-default">Default</th>
        </tr>
      </thead>
      <tbody id="puTbody"></tbody>
    </table>
    <div id="puNoResults" class="pu-no-results">No parameters match your search.</div>
  </div>

  <div class="pu-footer">
    <button class="pu-btn pu-btn-primary" id="puWriteBtn">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
      Write to FC
    </button>
    <button class="pu-btn pu-btn-secondary" id="puReadBtn">Read from FC</button>
    <button class="pu-btn pu-btn-danger" id="puResetBtn">Reset Defaults</button>
    <span class="pu-footer-info" id="puFooterInfo"></span>
  </div>
</div>`;
  }

  /* ─── Init ───────────────────────────────────── */
  function init() {
    const host = document.getElementById('panel-param-user');
    if (!host) return;

    host.innerHTML = renderShell();
    rebuildRows();

    // Search
    const searchEl = document.getElementById('puSearch');
    const clearBtn  = document.getElementById('puSearchClear');
    const noResults = document.getElementById('puNoResults');

    searchEl?.addEventListener('input', () => {
      state.filter = searchEl.value.trim();
      clearBtn.style.display = state.filter ? 'block' : 'none';
      rebuildRows();
    });

    clearBtn?.addEventListener('click', () => {
      searchEl.value = ''; state.filter = '';
      clearBtn.style.display = 'none';
      rebuildRows();
    });

    // Dirty-only filter toggle
    document.getElementById('puDirtyFilter')?.addEventListener('click', function () {
      state.showDirtyOnly = !state.showDirtyOnly;
      this.classList.toggle('active', state.showDirtyOnly);
      rebuildRows();
    });

    // Change delegation
    document.getElementById('puTbody')?.addEventListener('change', onParamChange);

    // Write
    document.getElementById('puWriteBtn')?.addEventListener('click', () => {
      writeParamsToFC(state.params.filter(p => state.dirty.has(p.name)));
    });

    // Read
    document.getElementById('puReadBtn')?.addEventListener('click', readParamsFromFC);

    // Reset
    document.getElementById('puResetBtn')?.addEventListener('click', () => {
      if (!confirm('Reset all user parameters to ArduPilot defaults?')) return;
      defaults.forEach(def => {
        const p = state.params.find(p => p.name === def.name);
        if (p) p.value = def.value;
      });
      state.dirty.clear();
      rebuildRows();
      window.SwUtil?.toast('User parameters reset to defaults');
    });
  }

  window.ParamUser = { init };
  console.log('✅ ParamUser module ready (redesign v3)');
})();