/**
 * ANALYZE TOOLS  — 5 individual full-screen windows
 * Back button navigation:
 *   Image4 (full-screen tool)  → Back → Image3 (analyze sidebar panel)
 *   Image3 Back button         → Image2 (PLAN/ANALYZE/CONFIG/SETTINGS strip)
 *   Image2 logo click          → Image1 (TAKEOFF/LAND/RTL strip)
 */
(function () {
    'use strict';

    var CSS = `
/* ── full-screen tool windows ── */
.atw {
    position : fixed !important;
    top      : 0 !important;
    left     : 0 !important;
    width    : 100vw !important;
    height   : 100vh !important;
    z-index  : 9999999 !important;
    background: #0d0f16;
    flex-direction: column;
    font-family: 'Segoe UI', system-ui, sans-serif;
    overflow: hidden;
    display : none !important;
}
.atw.atw-on { display : flex !important; }
.atw-bar {
    display: flex; align-items: center; gap: 12px;
    height: 56px; padding: 0 22px;
    background: #111420; border-bottom: 2px solid #1c1f2e;
    flex-shrink: 0;
}
.atw-back {
    display: flex; align-items: center; gap: 6px;
    background: none; border: 1px solid rgba(41,182,246,.3);
    color: #29b6f6; font-size: 13px; font-weight: 600;
    cursor: pointer; padding: 7px 14px; border-radius: 7px;
    transition: background .15s;
}
.atw-back:hover { background: rgba(41,182,246,.12); }
.atw-back svg { width:15px; height:15px; flex-shrink:0; }
.atw-bar-sep { width:1px; height:24px; background:#1e2230; }
.atw-bar-ico {
    width:34px; height:34px; border-radius:9px;
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
}
.atw-bar-title { font-size:16px; font-weight:700; color:#e0e4f2; }
.atw-bar-desc  { font-size:12px; color:#363c58; margin-left:4px; }
.atw-body { flex:1; overflow:hidden; display:flex; flex-direction:column; padding:20px 26px; gap:14px; }

/* ── Analyze sidebar panel (matches Image 3) ── */
#analyzePanel {
    position: fixed !important;
    top: 60px !important;
    left: 0 !important;
    width: 265px !important;
    background: rgba(11,13,20,0.97) !important;
    border-right: 1px solid #181c2a !important;
    border-bottom-right-radius: 10px !important;
    z-index: 999998 !important;
    font-family: 'Segoe UI', system-ui, sans-serif !important;
    display: none;
    flex-direction: column !important;
}
#analyzePanel.ap-on { display: flex; }

.ap-header {
    display: flex;
    align-items: center;
    padding: 12px 14px 10px;
    border-bottom: 1px solid #181c2a;
    gap: 8px;
}
.ap-title-wrap { display:flex; align-items:center; gap:7px; flex:1; }
.ap-title-wrap svg { width:14px; height:14px; stroke:#ffa726; fill:none; flex-shrink:0; }
.ap-title-text { color:#ffa726; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.8px; }

.ap-back-btn {
    display: flex; align-items: center; gap: 4px;
    background: none;
    border: 1px solid rgba(41,182,246,.35);
    color: #29b6f6;
    font-size: 11px; font-weight: 600;
    cursor: pointer; padding: 5px 11px; border-radius: 6px;
    transition: background .15s; white-space: nowrap;
}
.ap-back-btn:hover { background: rgba(41,182,246,.12); }
.ap-back-btn svg { width:11px; height:11px; flex-shrink:0; }

.ap-list { display:flex; flex-direction:column; }

.ap-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px;
    cursor: pointer;
    transition: background .12s;
    border-bottom: 1px solid #10131e;
}
.ap-item:last-child { border-bottom: none; }
.ap-item:hover { background: rgba(255,255,255,.035); }

.ap-item-ico {
    width:28px; height:28px; border-radius:7px;
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
}
.ap-item-ico svg { width:14px; height:14px; fill:none; }
.ap-item-body { flex:1; min-width:0; }
.ap-item-label { display:block; color:#c8cedf; font-weight:600; font-size:13px; }
.ap-item-desc  { display:block; color:#2e3450; font-size:11px; margin-top:1px; }
.ap-item-chev  { flex-shrink:0; }
.ap-item-chev svg { width:13px; height:13px; stroke:#1e2234; fill:none; }

/* ── shared toolbar/table/etc ── */
.atw-tb { display:flex; align-items:center; gap:9px; flex-shrink:0; flex-wrap:wrap; }
.atw-btn {
    display:inline-flex; align-items:center; gap:6px;
    padding:7px 15px; border-radius:6px;
    border:1px solid #22273c; background:#161924;
    color:#8890aa; font-size:12px; font-weight:600;
    cursor:pointer; transition:all .15s; white-space:nowrap;
}
.atw-btn svg { width:13px; height:13px; flex-shrink:0; }
.atw-btn:hover { background:#1d2234; color:#d0d5ea; border-color:#2e3550; }
.atw-btn.p { background:rgba(41,182,246,.09); border-color:rgba(41,182,246,.3); color:#29b6f6; }
.atw-btn.p:hover { background:rgba(41,182,246,.18); border-color:#29b6f6; }
.atw-btn.d { background:rgba(244,67,54,.08); border-color:rgba(244,67,54,.25); color:#f44336; }
.atw-btn.d:hover { background:rgba(244,67,54,.16); border-color:#f44336; }
.atw-btn.sm { padding:5px 11px; font-size:11px; }
.atw-btn.full { width:100%; justify-content:center; margin-top:18px; }
.atw-sp { flex:1; }
.atw-pill { padding:3px 12px; border-radius:20px; font-size:11px; font-weight:600; white-space:nowrap; }
.atw-pill.off    { background:#131620; color:#2e3448; border:1px solid #1c2030; }
.atw-pill.green  { background:rgba(76,175,80,.1);  color:#4caf50; border:1px solid rgba(76,175,80,.22); }
.atw-pill.yellow { background:rgba(255,152,0,.1);  color:#ff9800; border:1px solid rgba(255,152,0,.22); }
.atw-pill.red    { background:rgba(244,67,54,.1);  color:#f44336; border:1px solid rgba(244,67,54,.22); }
.atw-pill.blue   { background:rgba(41,182,246,.1); color:#29b6f6; border:1px solid rgba(41,182,246,.22); }
.atw-twrap { flex:1; overflow-y:auto; border:1px solid #181c28; border-radius:8px; background:#0a0c14; min-height:0; }
.atw-tbl { width:100%; border-collapse:collapse; font-size:12.5px; }
.atw-tbl thead tr { background:#10131f; position:sticky; top:0; z-index:1; }
.atw-tbl th { padding:10px 14px; color:#2c3248; font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.7px; border-bottom:1px solid #181c28; text-align:left; white-space:nowrap; }
.atw-tbl td { padding:10px 14px; color:#7880a0; border-bottom:1px solid #10131f; }
.atw-tbl tbody tr:hover { background:#10141e; }
.atw-tbl tbody tr:last-child td { border-bottom:none; }
.atw-empty td { padding:50px 14px !important; }
.atw-empty-box { display:flex; flex-direction:column; align-items:center; gap:12px; color:#1c2030; font-size:12px; }
.atw-empty-box svg { width:40px; height:40px; stroke:#1c2030; fill:none; }
.atw-bot { display:flex; align-items:center; gap:12px; padding:8px 0; color:#28304a; font-size:11.5px; flex-shrink:0; }
.atw-prog-wrap { display:flex; align-items:center; gap:8px; flex:1; }
.atw-prog-bar  { flex:1; height:4px; background:#181c28; border-radius:2px; overflow:hidden; }
.atw-prog-fill { height:100%; background:#29b6f6; border-radius:2px; transition:width .2s; }
.atw-actbtn { padding:5px 12px; background:#141820; border:1px solid #1e2432; border-radius:5px; color:#363c58; font-size:11px; cursor:pointer; transition:all .15s; }
.atw-actbtn:hover { background:#1a2032; color:#aaa; border-color:#303a58; }
.atw-2col { flex:1; display:grid; grid-template-columns:1fr 1fr; gap:22px; overflow:hidden; min-height:0; }
.atw-col  { display:flex; flex-direction:column; gap:12px; overflow-y:auto; }
.atw-col-h { color:#2c3248; font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.8px; padding-bottom:9px; border-bottom:1px solid #181c28; }
.atw-field { display:flex; flex-direction:column; gap:5px; }
.atw-field label { color:#404a70; font-size:11.5px; font-weight:600; }
.atw-inp { width:100%; padding:8px 12px; background:#14182a; border:1px solid #1e2432; border-radius:6px; color:#7880a0; font-size:12.5px; outline:none; box-sizing:border-box; transition:border-color .15s; }
.atw-inp:focus { border-color:#29b6f6; }
select.atw-inp { cursor:pointer; }
.atw-file-row { display:flex; gap:7px; }
.atw-file-row .atw-inp { flex:1; }
.atw-checks { display:flex; flex-direction:column; gap:8px; }
.atw-checks label { display:flex; align-items:center; gap:8px; color:#404a70; font-size:12px; cursor:pointer; }
.atw-checks input[type=checkbox] { accent-color:#29b6f6; }
.atw-stats { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; flex-shrink:0; }
.atw-stat { background:#14182a; border:1px solid #181c28; border-radius:9px; padding:14px 10px; display:flex; flex-direction:column; align-items:center; gap:5px; }
.atw-stat-n { font-size:26px; font-weight:700; color:#7880a0; }
.atw-stat-n.g { color:#4caf50; }
.atw-stat-n.r { color:#f44336; }
.atw-stat-l { font-size:10px; color:#242d44; text-transform:uppercase; letter-spacing:.5px; }
.atw-logout { flex:1; background:#09090f; border:1px solid #14182a; border-radius:7px; padding:12px 14px; font-family:'Courier New',monospace; font-size:11.5px; overflow-y:auto; display:flex; flex-direction:column; gap:3px; min-height:120px; }
.atw-ll { display:block; }
.atw-ll.m { color:#1c2030; }
.atw-ll.g { color:#4caf50; }
.atw-ll.y { color:#ff9800; }
.atw-ll.r { color:#f44336; }
.atw-console { flex:1; overflow:hidden; display:flex; flex-direction:column; }
.atw-term { flex:1; background:#08090e; padding:16px 18px; font-family:'Courier New',Consolas,monospace; font-size:12.5px; overflow-y:auto; display:flex; flex-direction:column; gap:2px; }
.atw-tl { display:block; color:#7880a0; line-height:1.55; white-space:pre-wrap; word-break:break-all; }
.atw-tl.m { color:#1c2030; } .atw-tl.c { color:#29b6f6; }
.atw-inp-row { display:flex; align-items:center; gap:9px; padding:12px 18px; background:#0d0f18; border-top:1px solid #14182a; flex-shrink:0; }
.atw-prompt { color:#4caf50; font-family:'Courier New',monospace; font-size:13px; font-weight:700; white-space:nowrap; }
.atw-cmd-in { flex:1; background:transparent; border:none; outline:none; color:#c8cedf; font-family:'Courier New',monospace; font-size:13px; caret-color:#29b6f6; }
.atw-qbar { display:flex; align-items:center; gap:7px; padding:9px 18px; background:#0b0c14; border-top:1px solid #14182a; flex-wrap:wrap; flex-shrink:0; }
.atw-ql { color:#1c2030; font-size:11px; margin-right:4px; }
.atw-qb { padding:4px 11px; background:#10131f; border:1px solid #1a1e30; border-radius:4px; color:#303858; font-size:11px; font-family:'Courier New',monospace; cursor:pointer; transition:all .15s; }
.atw-qb:hover { color:#4caf50; border-color:#4caf50; background:#12161e; }
.atw-insp-wrap { flex:1; display:grid; grid-template-columns:1fr 340px; gap:16px; overflow:hidden; min-height:0; }
.atw-insp-left { display:flex; flex-direction:column; overflow:hidden; }
.atw-insp-left .atw-twrap { flex:1; }
.atw-insp-right { background:#0c0e18; border:1px solid #181c28; border-radius:9px; overflow-y:auto; }
.atw-insp-ph { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:14px; }
.atw-insp-ph svg { width:40px; height:40px; stroke:#181c28; fill:none; }
.atw-insp-ph span { font-size:12px; color:#1c2030; }
.atw-insp-d { padding:16px; }
.atw-insp-dt { color:#29b6f6; font-family:monospace; font-size:13px; font-weight:700; margin-bottom:14px; padding-bottom:9px; border-bottom:1px solid #181c28; }
.atw-dot { display:inline-block; width:7px; height:7px; border-radius:50%; }
.atw-dot.g { background:#4caf50; } .atw-dot.y { background:#ff9800; } .atw-dot.b { background:#29b6f6; }
.atw-mn { color:#c8cedf; font-family:monospace; font-size:12px; }
.atw-mf { color:#2e3450; font-size:11.5px; }
.atw-mc { color:#29b6f6; font-family:monospace; font-size:12px; }
.atw-irow { cursor:pointer; }
.atw-irow:hover { background:#10141e !important; }
.atw-fn { font-family:monospace; color:#2e3450; font-size:12px; }
.atw-fv { font-family:monospace; color:#c8cedf; font-size:12px; }
.atw-fu { font-size:11px; color:#1c2030; }
.atw-vib-body { flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:16px; }
.atw-vib-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; flex-shrink:0; }
.atw-vib-card { background:#10131e; border:1px solid #181c28; border-radius:10px; padding:16px; }
.atw-vib-ct { color:#2c3248; font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.6px; margin-bottom:14px; }
.atw-vib-axes { display:flex; flex-direction:column; gap:11px; }
.atw-vib-ax { display:grid; grid-template-columns:52px 1fr 48px; align-items:center; gap:9px; }
.atw-vib-al { color:#2c3248; font-size:11.5px; }
.atw-vib-tr { height:5px; background:#181c28; border-radius:3px; overflow:hidden; }
.atw-vib-fi { height:100%; background:#4caf50; border-radius:3px; transition:width .4s,background .4s; }
.atw-vib-v  { color:#4caf50; font-size:11.5px; font-family:monospace; text-align:right; transition:color .4s; }
.atw-clip-g { display:flex; flex-direction:column; gap:9px; margin-bottom:10px; }
.atw-clip-r { display:flex; align-items:center; justify-content:space-between; }
.atw-clip-l { color:#2c3248; font-size:12px; }
.atw-clip-v { font-family:monospace; font-size:14px; font-weight:700; }
.atw-clip-v.g { color:#4caf50; } .atw-clip-v.r { color:#f44336; }
.atw-clip-n { color:#1c2030; font-size:10.5px; line-height:1.4; }
.atw-vib-rt { color:#2c3248; font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; margin-bottom:9px; }
.atw-muted  { color:#1c2030; font-size:11px; }
`;

    function injectCSS() {
        if (document.getElementById('atw-css')) return;
        var s = document.createElement('style');
        s.id = 'atw-css';
        s.textContent = CSS;
        document.head.appendChild(s);
    }

    var TOOLS = [
        { id:'log-download',      label:'Log Download',      desc:'Flight log files',  color:'#29b6f6', ibg:'rgba(41,182,246,0.13)',  svg:'<path d="M12 15V3M12 15L8 11M12 15L16 11M3 21H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' },
        { id:'geotag-images',     label:'GeoTag Images',     desc:'GPS-tag photos',    color:'#66bb6a', ibg:'rgba(102,187,106,0.13)', svg:'<path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" stroke="currentColor" stroke-width="2"/>' },
        { id:'mavlink-console',   label:'MAVLink Console',   desc:'Vehicle shell',     color:'#4caf50', ibg:'rgba(76,175,80,0.13)',   svg:'<rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M8 21H16M12 17V21M6 8L9 11L6 14M11 14H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' },
        { id:'mavlink-inspector', label:'MAVLink Inspector', desc:'Live messages',      color:'#ffa726', ibg:'rgba(255,167,38,0.13)',  svg:'<path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.134 17 3 13.866 3 10C3 6.134 6.134 3 10 3C13.866 3 17 6.134 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' },
        { id:'vibration',         label:'Vibration',         desc:'IMU sensor data',   color:'#ef5350', ibg:'rgba(239,83,80,0.13)',   svg:'<path d="M2 12H4L7 6L10 18L13 9L16 15L18 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' }
    ];

    /* ── build the analyze sidebar (Image 3) ── */
    function buildAnalyzePanel() {
        if (document.getElementById('analyzePanel')) return;
        var panel = document.createElement('div');
        panel.id = 'analyzePanel';

        /* header */
        panel.innerHTML =
            '<div class="ap-header">' +
                '<div class="ap-title-wrap">' +
                    '<svg viewBox="0 0 24 24"><path d="M22 12H18L15 21L9 3L6 12H2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
                    '<span class="ap-title-text">Analyze Tools</span>' +
                '</div>' +
                '<button class="ap-back-btn" id="apBackBtn">' +
                    '<svg viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
                    'Back' +
                '</button>' +
            '</div>' +
            '<div class="ap-list" id="apList"></div>';

        document.body.appendChild(panel);

        /* tool list items */
        var list = document.getElementById('apList');
        TOOLS.forEach(function (t) {
            var item = document.createElement('div');
            item.className = 'ap-item';
            item.innerHTML =
                '<div class="ap-item-ico" style="background:' + t.ibg + '">' +
                    '<svg viewBox="0 0 24 24" fill="none" style="stroke:' + t.color + ';width:14px;height:14px">' + t.svg + '</svg>' +
                '</div>' +
                '<div class="ap-item-body">' +
                    '<span class="ap-item-label">' + t.label + '</span>' +
                    '<span class="ap-item-desc">' + t.desc + '</span>' +
                '</div>' +
                '<div class="ap-item-chev">' +
                    '<svg viewBox="0 0 24 24"><path d="M9 18L15 12L9 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
                '</div>';
            (function(toolId){ item.addEventListener('click', function () { API.openTool(toolId); }); })(t.id);
            list.appendChild(item);
        });

        /* Back button: sidebar → PLAN/ANALYZE strip (Image 2) */
        document.getElementById('apBackBtn').addEventListener('click', function () {
            console.log('⬅ Analyze sidebar Back clicked → going to PLAN strip');

            /* 1. Hide analyze sidebar */
            API.hideAnalyzePanel();

            /* 2. Show PLAN strip via DropdownStrip API */
            if (window.DropdownStrip && window.DropdownStrip.showPlanStrip) {
                window.DropdownStrip.showPlanStrip();
            } else {
                /* fallback: directly force the strip visible */
                var strip = document.getElementById('dropdownMenuStrip');
                var flight = document.getElementById('flightControlsStrip');
                if (strip)  strip.style.setProperty('display', 'flex', 'important');
                if (flight) flight.style.setProperty('display', 'none', 'important');
                console.warn('⚠ DropdownStrip API not found — used direct fallback');
            }
        });
    }

    /* ── build full-screen tool windows (Image 4) ── */
    var _built = false;
    function buildWindows() {
        if (_built) return;
        _built = true;
        injectCSS();
        buildAnalyzePanel();

        TOOLS.forEach(function (t) {
            var win = document.createElement('div');
            win.className = 'atw';
            win.id = 'atw-' + t.id;
            win.innerHTML =
                '<div class="atw-bar">' +
                    '<button class="atw-back" onclick="window.AnalyzeToolsPanel.goBack()">' +
                        '<svg viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
                        'Back' +
                    '</button>' +
                    '<div class="atw-bar-sep"></div>' +
                    '<div class="atw-bar-ico" style="background:' + t.ibg + '">' +
                        '<svg viewBox="0 0 24 24" fill="none" style="stroke:' + t.color + ';width:18px;height:18px">' + t.svg + '</svg>' +
                    '</div>' +
                    '<span class="atw-bar-title">' + t.label + '</span>' +
                    '<span class="atw-bar-desc">' + t.desc + '</span>' +
                '</div>' +
                '<div class="atw-body">' + buildBody(t.id) + '</div>';
            document.body.appendChild(win);
        });
        console.log('✅ Analyze panel + 5 tool windows built');
    }

    function buildBody(id) {
        if (id === 'log-download')      return bodyLog();
        if (id === 'geotag-images')     return bodyGeo();
        if (id === 'mavlink-console')   return bodyCon();
        if (id === 'mavlink-inspector') return bodyInsp();
        if (id === 'vibration')         return bodyVib();
        return '';
    }

    function B(cls, fn, ico, lbl, id) {
        return '<button class="atw-btn' + (cls ? ' ' + cls : '') + '"' +
            (id ? ' id="' + id + '"' : '') + ' onclick="' + fn + '">' +
            (ico || '') + (ico && lbl ? ' ' : '') + (lbl || '') + '</button>';
    }
    function F(lbl, ctrl) { return '<div class="atw-field"><label>' + lbl + '</label>' + ctrl + '</div>'; }
    function SVG(d) { return '<svg viewBox="0 0 24 24" fill="none" style="width:13px;height:13px;flex-shrink:0"><path d="' + d + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }

    function bodyLog() {
        return '<div class="atw-tb">' +
            B('p','window.AnalyzeToolsPanel._refreshLogs()',SVG('M1 4V10H7M3.51 15a9 9 0 1 0 .49-4.05'),'Refresh') +
            B('', 'window.AnalyzeToolsPanel._downloadSel()',SVG('M12 15V3M12 15L8 11M12 15L16 11M3 21H21'),'Download Selected') +
            B('d','window.AnalyzeToolsPanel._deleteLogs()', SVG('M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6'),'Delete All') +
            '<div class="atw-sp"></div><span class="atw-pill off" id="logConnPill">● Not Connected</span>' +
        '</div>' +
        '<div class="atw-twrap"><table class="atw-tbl">' +
            '<thead><tr><th><input type="checkbox" id="logSelAll" onchange="window.AnalyzeToolsPanel._selAll(this)"></th>' +
            '<th>ID</th><th>Date</th><th>Time</th><th>Size</th><th>Action</th></tr></thead>' +
            '<tbody id="logTbody"><tr class="atw-empty"><td colspan="6"><div class="atw-empty-box">' +
            '<svg viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="1.5"/></svg>' +
            '<span>Connect to vehicle to load logs</span></div></td></tr></tbody></table></div>' +
        '<div class="atw-bot"><span id="logCntLbl">0 logs found</span>' +
            '<div class="atw-prog-wrap" id="logProgWrap" style="display:none">' +
            '<div class="atw-prog-bar"><div class="atw-prog-fill" id="logProgFill"></div></div>' +
            '<span id="logProgLbl">0%</span></div></div>';
    }

    function bodyGeo() {
        return '<div class="atw-2col"><div class="atw-col">' +
            '<div class="atw-col-h">Image &amp; Log Selection</div>' +
            F('Image Directory','<div class="atw-file-row"><input type="text" class="atw-inp" id="geoImgDir" placeholder="/path/to/images" readonly>'+B('','window.AnalyzeToolsPanel._browseImgs()','','Browse')+'</div>') +
            F('Log File','<div class="atw-file-row"><input type="text" class="atw-inp" id="geoLogFile" placeholder="Select .log or .tlog" readonly>'+B('','window.AnalyzeToolsPanel._browseLog()','','Browse')+'</div>') +
            F('Camera Trigger Source','<select class="atw-inp"><option>CAM Message</option><option>Servo Trigger</option><option>Time Interval</option></select>') +
            F('Max Time Offset (ms)','<input type="number" class="atw-inp" value="1000" min="0">') +
            '<div class="atw-checks">' +
                '<label><input type="checkbox" checked> Write tags to EXIF</label>' +
                '<label><input type="checkbox"> Export CSV log</label>' +
                '<label><input type="checkbox"> Overwrite existing tags</label>' +
            '</div>' +
            '<button class="atw-btn p full" onclick="window.AnalyzeToolsPanel._runGeo()">'+SVG('M5 3l14 9-14 9V3z')+' Start GeoTagging</button>' +
        '</div><div class="atw-col"><div class="atw-col-h">Results</div>' +
            '<div class="atw-stats">' +
                '<div class="atw-stat"><span class="atw-stat-n" id="geoTotal">—</span><span class="atw-stat-l">Found</span></div>' +
                '<div class="atw-stat"><span class="atw-stat-n g" id="geoTagged">—</span><span class="atw-stat-l">Tagged</span></div>' +
                '<div class="atw-stat"><span class="atw-stat-n r" id="geoSkipped">—</span><span class="atw-stat-l">Skipped</span></div>' +
            '</div>' +
            '<div class="atw-logout" id="geoLogOut"><span class="atw-ll m">Waiting for operation…</span></div>' +
        '</div></div>';
    }

    function bodyCon() {
        var qcmds = ['top','free','ver all','param show *','dmesg','sensors status'];
        return '<div class="atw-console"><div class="atw-term" id="mavTerm">' +
            '<div class="atw-tl m">MAVLink Console — vehicle shell ready</div>' +
            '<div class="atw-tl m">──────────────────────────────────────</div>' +
        '</div><div class="atw-inp-row">' +
            '<span class="atw-prompt">nsh&gt;</span>' +
            '<input class="atw-cmd-in" id="mavIn" placeholder="Enter command…" onkeydown="if(event.key===\'Enter\')window.AnalyzeToolsPanel._sendCmd()">' +
            B('p','window.AnalyzeToolsPanel._sendCmd()','','Send') +
            B('', 'window.AnalyzeToolsPanel._clrCon()','','Clear') +
        '</div><div class="atw-qbar"><span class="atw-ql">Quick:</span>' +
            qcmds.map(function(c){ return '<button class="atw-qb" onclick="window.AnalyzeToolsPanel._qcmd(\''+c+'\')">'+c+'</button>'; }).join('') +
        '</div></div>';
    }

    function bodyInsp() {
        var msgs=[{n:'HEARTBEAT',f:'1.0 Hz',c:'g'},{n:'SYS_STATUS',f:'1.0 Hz',c:'g'},{n:'ATTITUDE',f:'10.0 Hz',c:'g'},{n:'GLOBAL_POSITION_INT',f:'5.0 Hz',c:'g'},{n:'GPS_RAW_INT',f:'5.0 Hz',c:'g'},{n:'VFR_HUD',f:'10.0 Hz',c:'g'},{n:'RC_CHANNELS',f:'5.0 Hz',c:'y'},{n:'BATTERY_STATUS',f:'1.0 Hz',c:'g'},{n:'SERVO_OUTPUT_RAW',f:'10.0 Hz',c:'y'},{n:'STATUSTEXT',f:'Event',c:'b'},{n:'COMMAND_ACK',f:'Event',c:'b'},{n:'MISSION_CURRENT',f:'1.0 Hz',c:'y'}];
        var rows=msgs.map(function(m){ return '<tr class="atw-irow" onclick="window.AnalyzeToolsPanel._inspMsg(\''+m.n+'\')">'+'<td><span class="atw-dot '+m.c+'"></span></td><td class="atw-mn">'+m.n+'</td><td class="atw-mf">'+m.f+'</td><td class="atw-mc" id="icnt_'+m.n+'">0</td><td><button class="atw-actbtn" onclick="event.stopPropagation();window.AnalyzeToolsPanel._inspMsg(\''+m.n+'\')">Inspect ›</button></td></tr>'; }).join('');
        return '<div class="atw-tb"><span class="atw-pill off" id="inspPill">● Disconnected</span>'+B('sm','window.AnalyzeToolsPanel._togInsp()','','▶ Start','inspTogBtn')+B('sm','window.AnalyzeToolsPanel._clrInsp()','','Clear')+'</div>' +
        '<div class="atw-insp-wrap"><div class="atw-insp-left"><div class="atw-twrap"><table class="atw-tbl"><thead><tr><th></th><th>Message</th><th>Rate</th><th>Count</th><th></th></tr></thead><tbody>'+rows+'</tbody></table></div></div>' +
        '<div class="atw-insp-right" id="inspPane"><div class="atw-insp-ph"><svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5"/><path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><span>Select a message to inspect</span></div></div></div>';
    }

    function bodyVib() {
        function icard(title,pfx){ return '<div class="atw-vib-card"><div class="atw-vib-ct">'+title+'</div><div class="atw-vib-axes">'+['X','Y','Z'].map(function(ax){ var lo=ax.toLowerCase(); return '<div class="atw-vib-ax"><span class="atw-vib-al">Vibe '+ax+'</span><div class="atw-vib-tr"><div class="atw-vib-fi" id="'+pfx+lo+'" style="width:0%"></div></div><span class="atw-vib-v" id="'+pfx+lo+'_v">0.0</span></div>'; }).join('')+'</div></div>'; }
        return '<div class="atw-tb"><span class="atw-pill off" id="vibPill">● Not Connected</span>'+B('','window.AnalyzeToolsPanel._togVib()','','▶ Start Monitoring','vibTogBtn')+B('','window.AnalyzeToolsPanel._rstVib()','','Reset')+'<div class="atw-sp"></div><span class="atw-muted">Updates every 1 s</span></div>' +
        '<div class="atw-vib-body"><div class="atw-vib-grid">'+icard('IMU 0','vib0')+icard('IMU 1','vib1')+'<div class="atw-vib-card"><div class="atw-vib-ct">Clipping</div><div class="atw-clip-g">'+['Acc0','Acc1','Acc2'].map(function(l){ return '<div class="atw-clip-r"><span class="atw-clip-l">'+l+'</span><span class="atw-clip-v g" id="clip_'+l.toLowerCase()+'">0</span></div>'; }).join('')+'</div><div class="atw-clip-n">Values above 0 indicate sensor saturation</div></div></div>' +
        '<div><div class="atw-vib-rt">Raw Vibration Values</div><table class="atw-tbl"><thead><tr><th>IMU</th><th>Vibe X (m/s²)</th><th>Vibe Y (m/s²)</th><th>Vibe Z (m/s²)</th><th>Status</th></tr></thead><tbody><tr><td>IMU 0</td><td id="rv0x">—</td><td id="rv0y">—</td><td id="rv0z">—</td><td><span class="atw-pill" id="rvs0">—</span></td></tr><tr><td>IMU 1</td><td id="rv1x">—</td><td id="rv1y">—</td><td id="rv1z">—</td><td><span class="atw-pill" id="rvs1">—</span></td></tr></tbody></table></div></div>';
    }

    /* ═══════════════════════════════════════════════════
       STATE
    ═══════════════════════════════════════════════════ */
    var _inspOn=false,_inspT=null,_vibOn=false,_vibT=null,_cmds=[],_cidx=-1,_conInit=false,_currentlyOpen=null;

    /* ═══════════════════════════════════════════════════
       PUBLIC API
    ═══════════════════════════════════════════════════ */
    var API = {

        isOpen: function () { return _currentlyOpen !== null; },

        /* Show analyze sidebar panel (Image 3) */
        showAnalyzePanel: function () {
            buildWindows();
            var p = document.getElementById('analyzePanel');
            if (p) {
                p.classList.add('ap-on');
                /* force inline style so it beats any other inline display:none */
                p.style.setProperty('display', 'flex', 'important');
            }
        },

        /* Hide analyze sidebar panel */
        hideAnalyzePanel: function () {
            var p = document.getElementById('analyzePanel');
            if (p) {
                p.classList.remove('ap-on');
                p.style.setProperty('display', 'none', 'important');
            }
        },

        /* Open a full-screen tool window (Image 4) */
        openTool: function (id) {
            id = id || 'log-download';
            buildWindows();
            _currentlyOpen = id;

            /* hide sidebar */
            this.hideAnalyzePanel();

            /* hide all other UI */
            ['flightControlsStrip','dropdownMenuStrip','planFlightMenuStrip',
             'commandEditorPanel','compassContainer','weatherDashboard','videoContainer'].forEach(function(eid){
                var e=document.getElementById(eid); if(e) e.style.setProperty('display','none','important');
            });
            var map=document.getElementById('map');
            if(map) map.style.setProperty('display','none','important');

            /* show requested window */
            TOOLS.forEach(function(t){
                var w=document.getElementById('atw-'+t.id); if(!w) return;
                if(t.id===id) w.classList.add('atw-on'); else w.classList.remove('atw-on');
            });

            if(id==='mavlink-console' && !_conInit){
                _conInit=true;
                setTimeout(function(){ var inp=document.getElementById('mavIn'); if(!inp) return; inp.addEventListener('keydown',function(e){ if(e.key==='ArrowUp'){if(_cidx<_cmds.length-1)_cidx++;inp.value=_cmds[_cidx]||'';e.preventDefault();}if(e.key==='ArrowDown'){if(_cidx>0)_cidx--;inp.value=_cmds[_cidx]||'';e.preventDefault();} }); },100);
            }
            console.log('📊 Tool open:', id);
        },

        /* legacy alias */
        open: function (id) { this.openTool(id); },

        closeAll: function () {
            if(_inspOn){clearInterval(_inspT);_inspOn=false;}
            if(_vibOn){clearInterval(_vibT);_vibOn=false;}
            _currentlyOpen=null;
            this.hideAnalyzePanel();
            TOOLS.forEach(function(t){ var w=document.getElementById('atw-'+t.id); if(w) w.classList.remove('atw-on'); });
            ['flightControlsStrip','compassContainer','videoContainer'].forEach(function(eid){ var e=document.getElementById(eid); if(e) e.style.removeProperty('display'); });
            var map=document.getElementById('map'); if(map) map.style.removeProperty('display');
            console.log('📊 Analyze closed all');
        },

        /**
         * Back in full-screen tool (Image 4) → Analyze sidebar (Image 3)
         */
        goBack: function () {
            console.log('⬅ Back: full-screen tool → analyze sidebar');

            if(_inspOn){clearInterval(_inspT);_inspOn=false;}
            if(_vibOn){clearInterval(_vibT);_vibOn=false;}
            _currentlyOpen=null;

            /* hide tool windows */
            TOOLS.forEach(function(t){ var w=document.getElementById('atw-'+t.id); if(w) w.classList.remove('atw-on'); });

            /* restore map + compass + video (sidebar floats over map) */
            var map=document.getElementById('map'); if(map) map.style.removeProperty('display');
            ['compassContainer','videoContainer'].forEach(function(eid){ var e=document.getElementById(eid); if(e) e.style.removeProperty('display'); });

            /* keep TAKEOFF strip + dropdown strip hidden — sidebar is next layer */
            ['flightControlsStrip','dropdownMenuStrip'].forEach(function(eid){
                var e=document.getElementById(eid); if(e) e.style.setProperty('display','none','important');
            });

            /* show sidebar (Image 3) */
            this.showAnalyzePanel();
        },

        /* ─── LOG DOWNLOAD ─── */
        _refreshLogs: function () {
            var body=document.getElementById('logTbody'),pill=document.getElementById('logConnPill');
            if(!body) return;
            if(pill){pill.textContent='● Scanning…';pill.className='atw-pill yellow';}
            setTimeout(function(){
                var logs=[{id:1,date:'2025-01-12',time:'09:14:22',size:'4.2 MB'},{id:2,date:'2025-01-12',time:'14:03:55',size:'11.8 MB'},{id:3,date:'2025-01-11',time:'08:45:10',size:'2.9 MB'},{id:4,date:'2025-01-10',time:'16:22:31',size:'7.4 MB'},{id:5,date:'2025-01-09',time:'11:05:44',size:'3.1 MB'}];
                body.innerHTML=logs.map(function(l){ return '<tr><td><input type="checkbox" class="lchk"></td><td>'+l.id+'</td><td>'+l.date+'</td><td>'+l.time+'</td><td>'+l.size+'</td><td><button class="atw-actbtn" onclick="window.AnalyzeToolsPanel._dlLog('+l.id+')">⬇ Download</button></td></tr>'; }).join('');
                if(pill){pill.textContent='● Connected';pill.className='atw-pill green';}
                var c=document.getElementById('logCntLbl'); if(c) c.textContent=logs.length+' logs found';
            },800);
        },
        _dlLog: function(){
            var wrap=document.getElementById('logProgWrap'),fill=document.getElementById('logProgFill'),lbl=document.getElementById('logProgLbl');
            if(wrap) wrap.style.display='flex';
            var pct=0,t=setInterval(function(){ pct+=Math.random()*15; if(pct>=100){pct=100;clearInterval(t);setTimeout(function(){if(wrap)wrap.style.display='none';},1500);} if(fill)fill.style.width=pct+'%'; if(lbl)lbl.textContent=Math.round(pct)+'%'; },200);
        },
        _downloadSel: function(){ if(!document.querySelectorAll('.lchk:checked').length){alert('Select at least one log first.');return;} this._dlLog(); },
        _deleteLogs: function(){
            if(!confirm('Delete ALL logs from vehicle?')) return;
            var b=document.getElementById('logTbody'); if(b) b.innerHTML='<tr class="atw-empty"><td colspan="6"><div class="atw-empty-box"><span>All logs deleted.</span></div></td></tr>';
            var c=document.getElementById('logCntLbl'); if(c) c.textContent='0 logs found';
        },
        _selAll: function(cb){ document.querySelectorAll('.lchk').forEach(function(c){c.checked=cb.checked;}); },

        /* ─── GEOTAG ─── */
        _browseImgs: function(){ var e=document.getElementById('geoImgDir'); if(e) e.value='/home/user/flight_images'; },
        _browseLog:  function(){ var e=document.getElementById('geoLogFile'); if(e) e.value='/home/user/logs/flight_001.tlog'; },
        _runGeo: function(){
            var out=document.getElementById('geoLogOut'),tot=document.getElementById('geoTotal'),tgd=document.getElementById('geoTagged'),skp=document.getElementById('geoSkipped');
            if(!out) return;
            out.innerHTML='<span class="atw-ll y">⟳ Scanning images…</span>';
            var lines=['✔ Found 48 images','✔ Loaded log: 2847 GPS records','✔ 001.jpg → 17.3852°N, 78.4867°E','✔ 002.jpg → 17.3854°N, 78.4869°E','⚠ Skipped 004.jpg — no matching timestamp','✔ 005.jpg → 17.3858°N, 78.4873°E','─────────────────────────────','✔ Done: 46 tagged, 2 skipped'];
            var i=0,t=setInterval(function(){ if(i>=lines.length){clearInterval(t);if(tot)tot.textContent='48';if(tgd)tgd.textContent='46';if(skp)skp.textContent='2';return;} var cls=lines[i].startsWith('⚠')?'y':lines[i].startsWith('─')?'m':'g'; out.innerHTML+='<span class="atw-ll '+cls+'">'+lines[i]+'</span>'; out.scrollTop=out.scrollHeight;i++; },280);
        },

        /* ─── CONSOLE ─── */
        _sendCmd: function(){
            var inp=document.getElementById('mavIn'),term=document.getElementById('mavTerm');
            if(!inp||!term) return; var cmd=inp.value.trim(); if(!cmd) return;
            _cmds.unshift(cmd);_cidx=-1;
            term.innerHTML+='<div class="atw-tl c">nsh&gt; '+cmd+'</div>';
            inp.value='';
            var resp=_fakeResp(cmd);
            setTimeout(function(){ resp.split('\n').forEach(function(l){ term.innerHTML+='<div class="atw-tl">'+l+'</div>'; }); term.scrollTop=term.scrollHeight; },180);
        },
        _qcmd: function(cmd){ var i=document.getElementById('mavIn'); if(i) i.value=cmd; this._sendCmd(); },
        _clrCon: function(){ var t=document.getElementById('mavTerm'); if(t) t.innerHTML='<div class="atw-tl m">Console cleared.</div>'; },

        /* ─── INSPECTOR ─── */
        _togInsp: function(){
            var btn=document.getElementById('inspTogBtn'),pill=document.getElementById('inspPill');
            if(_inspOn){ clearInterval(_inspT);_inspOn=false; if(btn)btn.textContent='▶ Start'; if(pill){pill.textContent='● Disconnected';pill.className='atw-pill off';} }
            else{ _inspOn=true; if(btn)btn.textContent='■ Stop'; if(pill){pill.textContent='● Live';pill.className='atw-pill green';} _inspT=setInterval(function(){ ['HEARTBEAT','SYS_STATUS','ATTITUDE','GLOBAL_POSITION_INT','GPS_RAW_INT','VFR_HUD','RC_CHANNELS','BATTERY_STATUS','SERVO_OUTPUT_RAW','STATUSTEXT','COMMAND_ACK','MISSION_CURRENT'].forEach(function(n){ var e=document.getElementById('icnt_'+n); if(e) e.textContent=parseInt(e.textContent||0)+Math.floor(Math.random()*3+1); }); },500); }
        },
        _clrInsp: function(){ document.querySelectorAll('[id^="icnt_"]').forEach(function(e){e.textContent='0';}); },
        _inspMsg: function(msg){
            var pane=document.getElementById('inspPane'); if(!pane) return;
            var fields=_mavFields(msg);
            pane.innerHTML='<div class="atw-insp-d"><div class="atw-insp-dt">'+msg+'</div><table class="atw-tbl"><thead><tr><th>Field</th><th>Value</th><th>Unit</th></tr></thead><tbody>'+fields.map(function(f){ return '<tr><td class="atw-fn">'+f.n+'</td><td class="atw-fv">'+f.v+'</td><td class="atw-fu">'+f.u+'</td></tr>'; }).join('')+'</tbody></table></div>';
        },

        /* ─── VIBRATION ─── */
        _togVib: function(){
            var btn=document.getElementById('vibTogBtn'),pill=document.getElementById('vibPill');
            if(_vibOn){ clearInterval(_vibT);_vibOn=false; if(btn)btn.textContent='▶ Start Monitoring'; if(pill){pill.textContent='● Not Connected';pill.className='atw-pill off';} }
            else{ _vibOn=true; if(btn)btn.textContent='■ Stop Monitoring'; if(pill){pill.textContent='● Monitoring';pill.className='atw-pill green';} _vibT=setInterval(_updateVib,800); }
        },
        _rstVib: function(){
            ['vib0x','vib0y','vib0z','vib1x','vib1y','vib1z'].forEach(function(id){ var b=document.getElementById(id),v=document.getElementById(id+'_v'); if(b)b.style.width='0%'; if(v)v.textContent='0.0'; });
        }
    };

    function _updateVib(){
        [['vib0x','rv0x'],['vib0y','rv0y'],['vib0z','rv0z'],['vib1x','rv1x'],['vib1y','rv1y'],['vib1z','rv1z']].forEach(function(a){
            var v=(Math.random()*30).toFixed(1),pct=Math.min(100,(v/30)*100);
            var col=pct>66?'#f44336':pct>33?'#ff9800':'#4caf50';
            var bar=document.getElementById(a[0]),val=document.getElementById(a[0]+'_v'),raw=document.getElementById(a[1]);
            if(bar){bar.style.width=pct+'%';bar.style.background=col;} if(val){val.textContent=v;val.style.color=col;} if(raw)raw.textContent=v;
        });
        [0,1].forEach(function(i){ var s=document.getElementById('rvs'+i),xEl=document.getElementById('rv'+i+'x'); if(!s||!xEl) return; var x=parseFloat(xEl.textContent); if(isNaN(x)) return; if(x<10){s.textContent='Good';s.className='atw-pill green';}else if(x<20){s.textContent='Warning';s.className='atw-pill yellow';}else{s.textContent='High';s.className='atw-pill red';} });
    }

    function _fakeResp(cmd){
        var r={'top':'Processes: 42 total\nCPU: 23.4%\nMem: 18.2 MB / 256 MB\n\nPID  NAME         CPU\n  1  init         0.0\n  2  rover        8.4\n  3  navigator    5.1','free':'Mem:  Total: 256M  Used: 47M  Free: 209M','ver all':'FW git-hash: abc1234\nFW version: 1.13.3\nOS: NuttX 10.1.0\nHW: Pixhawk 4','dmesg':'[0.000] NuttX initialized\n[0.120] MAVLink started\n[0.650] GPS lock acquired\n[1.200] Ready to fly','sensors status':'Sensor   Status   Rate\nIMU0     OK       400 Hz\nIMU1     OK       400 Hz\nGPS0     OK         5 Hz'};
        return r[cmd]||('Command \''+cmd+'\' executed\nResult: OK');
    }

    function _mavFields(msg){
        var db={'HEARTBEAT':[{n:'type',v:'2 (QUADROTOR)',u:'enum'},{n:'autopilot',v:'3 (APM)',u:'enum'},{n:'base_mode',v:'81',u:'bitmask'},{n:'system_status',v:'4 (ACTIVE)',u:'enum'}],'ATTITUDE':[{n:'time_boot_ms',v:(Date.now()%100000)+'',u:'ms'},{n:'roll',v:(Math.random()*.1).toFixed(4),u:'rad'},{n:'pitch',v:(Math.random()*.1).toFixed(4),u:'rad'},{n:'yaw',v:(Math.random()*6.28).toFixed(4),u:'rad'}],'GPS_RAW_INT':[{n:'fix_type',v:'3 (3D FIX)',u:'enum'},{n:'lat',v:'173852000',u:'degE7'},{n:'lon',v:'784867000',u:'degE7'},{n:'alt',v:'531000',u:'mm'},{n:'satellites_visible',v:'14',u:''}],'BATTERY_STATUS':[{n:'voltage',v:'16.72',u:'V'},{n:'current',v:'8.3',u:'A'},{n:'consumed',v:'1240',u:'mAh'},{n:'remaining',v:'72',u:'%'}]};
        return db[msg]||[{n:'time_boot_ms',v:(Date.now()%100000)+'',u:'ms'},{n:'value_1',v:(Math.random()*100).toFixed(2),u:''}];
    }

    if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',buildWindows); } else { buildWindows(); }

    window.AnalyzeToolsPanel = API;
    console.log('✅ analyze-tools.js loaded');
})();