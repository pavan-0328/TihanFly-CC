/**
 * calib-compass.js
 * TiHANFly GCS — Compass Calibration Panel
 * MNC Enterprise Grade — Aerospace Dark Theme
 */
(function () {
    'use strict';

    const ARROW_UP   = `<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 5 22 19 2 19"/></svg>`;
    const ARROW_DOWN = `<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 19 2 5 22 5"/></svg>`;

    const compassRows = [
        { priority: 1, devId: '97539',  busType: 'UAVCAN', bus: 0, address: 125, devType: 'SENSOR_ID#1', missing: false, external: true,  orientation: 'None' },
        { priority: 2, devId: '131874', busType: 'SPI',    bus: 4, address: 3,   devType: 'LSM303D',     missing: true,  external: false, orientation: ''     },
        { priority: 3, devId: '263178', busType: 'SPI',    bus: 1, address: 4,   devType: 'AK8963',      missing: false, external: false, orientation: 'None' },
        { priority: 4, devId: '97283',  busType: 'UAVCAN', bus: 0, address: 124, devType: 'SENSOR_ID#1', missing: false, external: false, orientation: ''     },
        { priority: 5, devId: '97795',  busType: 'UAVCAN', bus: 0, address: 126, devType: 'SENSOR_ID#1', missing: false, external: false, orientation: ''     },
        { priority: 6, devId: '98051',  busType: 'UAVCAN', bus: 0, address: 127, devType: 'SENSOR_ID#1', missing: false, external: false, orientation: ''     },
    ];

    const ORIENTATIONS = ['', 'None', 'YAW_45', 'YAW_90', 'YAW_135', 'YAW_180', 'ROLL_180', 'PITCH_180'];

    function buildTableRows() {
        return compassRows.map((r, i) => `
      <tr class="compass-row${i === 0 ? ' selected' : ''}" data-idx="${i}">
        <td>${r.priority}</td>
        <td>${r.devId}</td>
        <td>${r.busType}</td>
        <td>${r.bus}</td>
        <td>${r.address}</td>
        <td>${r.devType}</td>
        <td class="cell-center"><input type="checkbox" class="gcs-checkbox"${r.missing ? ' checked' : ''}></td>
        <td class="cell-center"><input type="checkbox" class="gcs-checkbox"${r.external ? ' checked' : ''}></td>
        <td>
          <select class="gcs-select orient-select">
            ${ORIENTATIONS.map(o => `<option${o === r.orientation ? ' selected' : ''}>${o}</option>`).join('')}
          </select>
        </td>
        <td class="cell-center"><button class="arrow-btn" data-dir="up" data-idx="${i}" title="Move Up">${ARROW_UP}</button></td>
        <td class="cell-center"><button class="arrow-btn" data-dir="dn" data-idx="${i}" title="Move Down">${ARROW_DOWN}</button></td>
      </tr>`).join('');
    }

    function render() {
        return `
<div class="gcs-panel-title">Compass Priority</div>

<div class="gcs-section">
  <div class="gcs-hint">Set the Compass Priority by reordering the compasses in the table below — highest priority at the top</div>
  <div class="table-wrapper">
    <table class="compass-priority-table" id="compassPriorityTable">
      <thead>
        <tr>
          <th>Priority</th><th>DevID</th><th>BusType</th><th>Bus</th>
          <th>Address</th><th>DevType</th><th>Missing</th><th>External</th>
          <th>Orientation</th><th>Up</th><th>Down</th>
        </tr>
      </thead>
      <tbody>${buildTableRows()}</tbody>
    </table>
  </div>
</div>

<div class="gcs-section">
  <span class="gcs-question">Disable any of the first 3 compasses?</span>
  <div class="gcs-checkbox-row">
    <label class="gcs-check-label"><input type="checkbox" class="gcs-checkbox" checked> Use Compass 1</label>
    <label class="gcs-check-label"><input type="checkbox" class="gcs-checkbox" checked> Use Compass 2</label>
    <label class="gcs-check-label"><input type="checkbox" class="gcs-checkbox" checked> Use Compass 3</label>
    <button class="gcs-btn gcs-btn-green remove-missing-btn">Remove Missing</button>
    <label class="gcs-check-label"><input type="checkbox" class="gcs-checkbox"> Automatically learn offsets</label>
  </div>
  <div class="gcs-hint-small">A reboot is required to adjust the ordering.</div>
  <button class="gcs-btn" id="rebootBtn" style="margin-top:6px">⟳ &nbsp;Reboot</button>
</div>

<div class="gcs-fieldset-section">
  <div class="gcs-warn-text" style="margin-bottom:10px">A mag calibration is required to remap the above changes.</div>

  <fieldset class="gcs-fieldset">
    <legend>Onboard Mag Calibration</legend>

    <div class="mag-calib-layout">
      <div class="mag-calib-left">

        <div class="mag-calib-actions">
          <button class="gcs-btn gcs-btn-green" id="compassStartBtn">▶ &nbsp;Start</button>
          <button class="gcs-btn gcs-btn-green" id="compassAcceptBtn" disabled>✓ &nbsp;Accept</button>
          <button class="gcs-btn" id="compassCancelBtn" disabled style="color:#ff7070;border-color:rgba(255,82,82,0.35);background:rgba(255,82,82,0.08)">✕ &nbsp;Cancel</button>
        </div>

        <div class="mag-bars">
          <div class="mag-bar-row">
            <span class="mag-label">Mag 1</span>
            <div class="mag-track"><div class="mag-fill" id="magBar1" style="width:0%"></div></div>
            <span class="mag-pct" id="magPct1"></span>
          </div>
          <div class="mag-bar-row">
            <span class="mag-label">Mag 2</span>
            <div class="mag-track"><div class="mag-fill" id="magBar2" style="width:0%"></div></div>
            <span class="mag-pct" id="magPct2"></span>
          </div>
          <div class="mag-bar-row">
            <span class="mag-label">Mag 3</span>
            <div class="mag-track"><div class="mag-fill" id="magBar3" style="width:0%"></div></div>
            <span class="mag-pct" id="magPct3"></span>
          </div>
        </div>

        <div class="mag-fitness-row">
          <span class="mag-label">Fitness</span>
          <select class="gcs-select fitness-select">
            <option selected>Default</option>
            <option>Relaxed</option>
            <option>3DR Solo</option>
            <option>Pixhawk</option>
          </select>
          <label class="gcs-check-label"><input type="checkbox" class="gcs-checkbox"> Relax fitness if calibration fails</label>
        </div>

      </div>

      <div class="mag-calib-right">
        <div class="mag-sphere-canvas">
          <canvas id="compassCanvas"></canvas>
        </div>
      </div>
    </div>
  </fieldset>
</div>

<div class="gcs-footer-btns">
  <button class="gcs-btn gcs-btn-green">⟳ &nbsp;Large Vehicle MagCal</button>
</div>`;
    }

    /* ── Premium Canvas ── */
    function syncCanvasSize(canvas) {
        const wrap = canvas.parentElement;
        if (!wrap) return;
        const w = wrap.clientWidth  || 400;
        const h = wrap.clientHeight || 300;
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width  = w;
            canvas.height = h;
        }
    }

    function drawBase(ctx, W, H) {
        const cx = W / 2, cy = H / 2;
        const maxR = Math.min(W, H) * 0.42;

        // Dark background
        ctx.fillStyle = '#0d0f14';
        ctx.fillRect(0, 0, W, H);

        // Subtle radial background glow
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 1.2);
        grad.addColorStop(0, 'rgba(0,212,255,0.04)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // Grid circles
        for (let i = 1; i <= 4; i++) {
            const r = maxR * i / 4;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = i === 4
                ? 'rgba(0,212,255,0.12)'
                : 'rgba(255,255,255,0.04)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Cross-hair lines
        ctx.strokeStyle = 'rgba(0,212,255,0.08)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.beginPath(); ctx.moveTo(cx - maxR, cy); ctx.lineTo(cx + maxR, cy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, cy - maxR); ctx.lineTo(cx, cy + maxR); ctx.stroke();
        ctx.setLineDash([]);

        // Diagonal guides
        ctx.strokeStyle = 'rgba(255,255,255,0.025)';
        ctx.setLineDash([3, 8]);
        ctx.beginPath(); ctx.moveTo(cx - maxR * 0.7, cy - maxR * 0.7); ctx.lineTo(cx + maxR * 0.7, cy + maxR * 0.7); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + maxR * 0.7, cy - maxR * 0.7); ctx.lineTo(cx - maxR * 0.7, cy + maxR * 0.7); ctx.stroke();
        ctx.setLineDash([]);

        // Axis labels
        ctx.font = '500 9px "IBM Plex Mono", monospace';
        ctx.fillStyle = 'rgba(0,212,255,0.35)';
        ctx.textAlign = 'center';
        ctx.fillText('N', cx, cy - maxR - 6);
        ctx.fillText('S', cx, cy + maxR + 14);
        ctx.textAlign = 'left';
        ctx.fillText('E', cx + maxR + 5, cy + 4);
        ctx.textAlign = 'right';
        ctx.fillText('W', cx - maxR - 5, cy + 4);
        ctx.textAlign = 'left';

        return { cx, cy, maxR };
    }

    function initCanvas() {
        const canvas = document.getElementById('compassCanvas');
        if (!canvas) return null;
        syncCanvasSize(canvas);
        const ctx = canvas.getContext('2d');
        const { cx, cy, maxR } = drawBase(ctx, canvas.width, canvas.height);
        return { canvas, ctx, dots: [], cx, cy, maxR };
    }

    function addDot(cv, pct) {
        if (!cv) return;
        syncCanvasSize(cv.canvas);
        const W = cv.canvas.width, H = cv.canvas.height;
        const { cx, cy, maxR } = drawBase(cv.ctx, W, H);
        cv.cx = cx; cv.cy = cy; cv.maxR = maxR;

        const t = pct * Math.PI * 12;
        const r = maxR * 0.15 + pct * maxR * 0.82;
        const x = cx + r * Math.cos(t);
        const y = cy + r * Math.sin(t * 0.6);
        cv.dots.push({ x, y, pct });

        // Draw dots with glow
        cv.dots.forEach((d, i) => {
            const alpha = 0.3 + d.pct * 0.7;
            const size  = 1.5 + d.pct * 1.8;
            const age   = i / cv.dots.length; // newer dots brighter

            // Glow
            const glowGrad = cv.ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, size * 3.5);
            glowGrad.addColorStop(0, `rgba(0,230,118,${alpha * 0.4 * age})`);
            glowGrad.addColorStop(1, 'transparent');
            cv.ctx.fillStyle = glowGrad;
            cv.ctx.beginPath();
            cv.ctx.arc(d.x, d.y, size * 3.5, 0, Math.PI * 2);
            cv.ctx.fill();

            // Core dot
            cv.ctx.beginPath();
            cv.ctx.arc(d.x, d.y, size, 0, Math.PI * 2);
            const dotColor = age > 0.8
                ? `rgba(105,255,180,${alpha})`
                : `rgba(0,230,118,${alpha})`;
            cv.ctx.fillStyle = dotColor;
            cv.ctx.fill();
        });

        // Center crosshair dot
        cv.ctx.beginPath();
        cv.ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        cv.ctx.fillStyle = 'rgba(0,212,255,0.5)';
        cv.ctx.fill();
        cv.ctx.beginPath();
        cv.ctx.arc(cx, cy, 1.5, 0, Math.PI * 2);
        cv.ctx.fillStyle = 'rgba(0,212,255,0.9)';
        cv.ctx.fill();
    }

    /* ── Table reorder ── */
    function reIndexTable(tbody) {
        [...tbody.querySelectorAll('tr')].forEach((row, i) => {
            row.querySelector('td:first-child').textContent = i + 1;
            row.querySelectorAll('.arrow-btn').forEach(btn => btn.dataset.idx = i);
        });
    }

    /* ── Premium Toast ── */
    function showToast(msg, type = 'info') {
        const colors = {
            info:    { bg: '#131720', border: '#00d4ff', text: '#00d4ff', glow: 'rgba(0,212,255,0.2)' },
            success: { bg: '#0d1a10', border: '#00e676', text: '#00e676', glow: 'rgba(0,230,118,0.2)' },
            warn:    { bg: '#1a1200', border: '#ffab40', text: '#ffab40', glow: 'rgba(255,171,64,0.2)' },
        };
        const c = colors[type] || colors.info;
        const t = document.createElement('div');
        t.innerHTML = msg;
        Object.assign(t.style, {
            position:      'fixed',
            bottom:        '24px',
            right:         '24px',
            background:    c.bg,
            color:         c.text,
            padding:       '10px 18px',
            border:        `1px solid ${c.border}`,
            borderRadius:  '6px',
            fontFamily:    '"IBM Plex Sans","Segoe UI",sans-serif',
            fontSize:      '12px',
            fontWeight:    '500',
            letterSpacing: '0.03em',
            zIndex:        '9999',
            boxShadow:     `0 4px 20px ${c.glow}, 0 0 0 1px rgba(255,255,255,0.04)`,
            transform:     'translateY(8px)',
            opacity:       '0',
            transition:    'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        });
        document.body.appendChild(t);
        requestAnimationFrame(() => {
            t.style.transform = 'translateY(0)';
            t.style.opacity   = '1';
        });
        setTimeout(() => {
            t.style.transform = 'translateY(8px)';
            t.style.opacity   = '0';
            setTimeout(() => t.remove(), 300);
        }, 3200);
    }

    function init() {
        const host = document.getElementById('panel-calib-compass');
        if (!host) return;
        host.innerHTML = render();

        // Arrow reorder
        host.addEventListener('click', e => {
            const btn = e.target.closest('.arrow-btn');
            if (!btn) return;
            const tbody = document.querySelector('#compassPriorityTable tbody');
            const rows  = [...tbody.querySelectorAll('tr')];
            const idx   = parseInt(btn.dataset.idx);
            const dir   = btn.dataset.dir;
            if (dir === 'up' && idx > 0) {
                tbody.insertBefore(rows[idx], rows[idx - 1]);
                reIndexTable(tbody);
            } else if (dir === 'dn' && idx < rows.length - 1) {
                tbody.insertBefore(rows[idx + 1], rows[idx]);
                reIndexTable(tbody);
            }
        });

        // Row selection
        host.addEventListener('click', e => {
            const row = e.target.closest('.compass-row');
            if (!row) return;
            host.querySelectorAll('.compass-row').forEach(r => r.classList.remove('selected'));
            row.classList.add('selected');
        });

        // Calibration
        let timers = [null, null, null];
        let counts = [0, 0, 0];
        let cv = null;

        const startBtn  = document.getElementById('compassStartBtn');
        const acceptBtn = document.getElementById('compassAcceptBtn');
        const cancelBtn = document.getElementById('compassCancelBtn');

        function resetBars() {
            [1, 2, 3].forEach(i => {
                const bar = document.getElementById(`magBar${i}`);
                const pct = document.getElementById(`magPct${i}`);
                if (bar) bar.style.width = '0%';
                if (pct) pct.textContent = '';
            });
        }

        startBtn?.addEventListener('click', () => {
            counts = [0, 0, 0];
            timers.forEach(clearInterval);
            resetBars();
            cv = initCanvas();

            startBtn.disabled  = true;
            acceptBtn.disabled = true;
            cancelBtn.disabled = false;

            showToast('Calibration started — rotate the vehicle in all axes', 'info');

            [0, 1, 2].forEach(i => {
                setTimeout(() => {
                    timers[i] = setInterval(() => {
                        counts[i] = Math.min(counts[i] + Math.floor(Math.random() * 4) + 1, 100);
                        const bar = document.getElementById(`magBar${i + 1}`);
                        const pct = document.getElementById(`magPct${i + 1}`);
                        if (bar) bar.style.width = counts[i] + '%';
                        if (pct) pct.textContent = counts[i] + '%';
                        if (i === 0) addDot(cv, counts[0] / 100);
                        if (counts[i] >= 100) clearInterval(timers[i]);
                        if (counts.every(c => c >= 100)) {
                            acceptBtn.disabled = false;
                            showToast('Data collection complete — click Accept to write offsets', 'success');
                        }
                    }, 120);
                }, i * 80);
            });
        });

        acceptBtn?.addEventListener('click', () => {
            startBtn.disabled  = false;
            acceptBtn.disabled = true;
            cancelBtn.disabled = true;
            showToast('✓ Compass offsets written to flight controller', 'success');
        });

        cancelBtn?.addEventListener('click', () => {
            timers.forEach(clearInterval);
            counts = [0, 0, 0];
            resetBars();
            cv = initCanvas();
            startBtn.disabled  = false;
            acceptBtn.disabled = true;
            cancelBtn.disabled = true;
            showToast('Calibration cancelled', 'warn');
        });

        document.getElementById('rebootBtn')?.addEventListener('click', () => {
            showToast('Reboot command sent to flight controller', 'warn');
        });

        // Resize observer
        const canvasWrap = host.querySelector('.mag-sphere-canvas');
        if (canvasWrap && window.ResizeObserver) {
            new ResizeObserver(() => {
                const canvas = document.getElementById('compassCanvas');
                if (canvas) { syncCanvasSize(canvas); if (cv) drawBase(cv.ctx, canvas.width, canvas.height); }
            }).observe(canvasWrap);
        }
    }

    window.CalibCompass = { init };
    console.log('✅ CalibCompass module ready');
})();