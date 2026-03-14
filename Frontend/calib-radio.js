/**
 * calib-radio.js
 * TiHANFly GCS — Radio Calibration Panel
 * Full-size Mission Planner-style layout.
 *
 * REQUIREMENT: #panel-calib-radio must have these styles applied by the shell:
 *   display: flex; flex-direction: column; flex: 1; overflow: hidden;
 */
(function () {
    'use strict';

    /* ── Templates ── */

    function hbar(id, label, pct) {
        const pwm = Math.round(1000 + pct * 10);
        return `
        <div class="mp-hbar-wrap">
          <div class="mp-hbar-outer">
            <div class="mp-hbar-fill" id="hbar-fill-${id}" style="width:${pct}%"></div>
            <span class="mp-hbar-label">${label}</span>
            <span class="mp-hbar-val"  id="hbar-val-${id}">${pwm}</span>
          </div>
          <label class="mp-reverse-label">
            <input type="checkbox" class="mp-reverse-cb"> Reverse
          </label>
        </div>`;
    }

    function vStick(id, label, pct) {
        const pwm = Math.round(1000 + pct * 10);
        return `
        <div class="mp-stick-wrap">
          <div class="mp-stick-outer" id="stick-outer-${id}">
            <div class="mp-stick-fill" id="stick-fill-${id}" style="height:${pct}%"></div>
            <div class="mp-stick-label">${label}</div>
            <div class="mp-stick-val"  id="stick-val-${id}">${pwm}</div>
          </div>
          <div class="mp-stick-meta">
            <label class="mp-reverse-label">
              <input type="checkbox" class="mp-reverse-cb"> Reverse
            </label>
          </div>
        </div>`;
    }

    function radioBox(ch, value, pct) {
        return `
        <div class="mp-radio-box" id="rbox-${ch}">
          <div class="mp-radio-bar" id="rbar-${ch}" style="width:${pct}%"></div>
          <span class="mp-radio-label">Radio ${ch}</span>
          <span class="mp-radio-val"  id="rval-${ch}">${value}</span>
        </div>`;
    }

    function render() {
        const L = [[5,1518,51.8],[6,964,19.4],[7,1998,99.8],[8,0,0],[9,0,0]];
        const R = [[10,0,0],[11,0,0],[12,0,0],[13,0,0],[14,0,0]];

        return `
<div class="mp-radio-root">

  <!-- ROW 1: Roll -->
  <div class="mp-top-row">
    ${hbar('roll', 'Roll', 50.0)}
  </div>

  <!-- ROW 2: Sticks + Radio boxes -->
  <div class="mp-main-row">

    <div class="mp-sticks-section">
      ${vStick('pitch',    'Pitch',    32)}
      ${vStick('throttle', 'Throttle', 69)}
    </div>

    <div class="mp-boxes-section">
      <div class="mp-boxes-grid">
        <div class="mp-boxes-col">${L.map(([n,v,p]) => radioBox(n,v,p)).join('')}</div>
        <div class="mp-boxes-col">${R.map(([n,v,p]) => radioBox(n,v,p)).join('')}</div>
      </div>
      <div class="mp-calib-row">
        <button class="mp-calib-btn" id="radioStartBtn">Calibrate Radio</button>
      </div>
      <div class="mp-bind-group">
        <span class="mp-bind-legend">Spektrum Bind</span>
        <div class="mp-bind-btns">
          <button class="mp-bind-btn">Bind DSM2</button>
          <button class="mp-bind-btn">Bind DSMX</button>
          <button class="mp-bind-btn">Bind DSM8</button>
        </div>
      </div>
    </div>

  </div>

  <!-- ROW 3: Yaw -->
  <div class="mp-bottom-row">
    ${hbar('yaw', 'Yaw', 51.3)}
  </div>

</div>`;
    }

    /* ── Logic ── */

    function init() {
        const host = document.getElementById('panel-calib-radio');
        if (!host) return;
        host.innerHTML = render();

        const { toast } = window.SwUtil || {};
        let timer = null, running = false;
        const btn = document.getElementById('radioStartBtn');

        btn?.addEventListener('click', () => {
            if (running) {
                clearInterval(timer);
                running = false;
                btn.textContent = 'Calibrate Radio';
                btn.classList.remove('running');
                return;
            }
            running = true;
            btn.textContent = 'Complete';
            btn.classList.add('running');
            toast?.('Move all sticks and switches to full extents');

            timer = setInterval(() => {
                ['pitch', 'throttle'].forEach(id => {
                    const pct  = Math.random() * 100;
                    const fill = document.getElementById(`stick-fill-${id}`);
                    const val  = document.getElementById(`stick-val-${id}`);
                    if (fill) fill.style.height = pct.toFixed(1) + '%';
                    if (val)  val.textContent   = Math.round(1000 + pct * 10);
                });
                ['roll', 'yaw'].forEach(id => {
                    const pct  = Math.random() * 100;
                    const fill = document.getElementById(`hbar-fill-${id}`);
                    const val  = document.getElementById(`hbar-val-${id}`);
                    if (fill) fill.style.width = pct.toFixed(1) + '%';
                    if (val)  val.textContent  = Math.round(1000 + pct * 10);
                });
                for (let ch = 5; ch <= 14; ch++) {
                    const active = ch <= 9 && Math.random() > 0.25;
                    const pct    = active ? Math.random() * 100 : 0;
                    const pwm    = active ? Math.round(1000 + pct * 10) : 0;
                    const bar = document.getElementById(`rbar-${ch}`);
                    const lbl = document.getElementById(`rval-${ch}`);
                    if (bar) bar.style.width = pct.toFixed(1) + '%';
                    if (lbl) lbl.textContent = pwm;
                }
            }, 80);
        });
    }

    window.CalibRadio = { init };
    console.log('✅ CalibRadio module ready');
})();