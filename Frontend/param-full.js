/**
 * param-full.js
 * TiHANFly GCS — Full Parameter List Panel
 */
(function () {
    'use strict';

    const FULL_PARAMS = [
        { n: 'ARMING_CHECK',      d: 'Arming check bitmask',             v: '1'     },
        { n: 'ARMING_MIN_VOLT',   d: 'Min battery voltage to arm (V)',   v: '10.5'  },
        { n: 'BATT_CAPACITY',     d: 'Battery capacity (mAh)',            v: '5200'  },
        { n: 'BATT_LOW_VOLT',     d: 'Low battery voltage (V)',           v: '10.5'  },
        { n: 'BATT_CRT_VOLT',     d: 'Critical battery voltage (V)',      v: '9.8'   },
        { n: 'COMPASS_OFFSETS_X', d: 'Compass X offset',                  v: '12.3'  },
        { n: 'COMPASS_OFFSETS_Y', d: 'Compass Y offset',                  v: '-8.7'  },
        { n: 'COMPASS_OFFSETS_Z', d: 'Compass Z offset',                  v: '4.1'   },
        { n: 'EK3_ENABLE',        d: 'Enable EKF3',                       v: '1'     },
        { n: 'EK3_GPS_TYPE',      d: 'EKF3 GPS mode',                     v: '0'     },
        { n: 'FENCE_ENABLE',      d: 'Fence enable',                      v: '0'     },
        { n: 'FENCE_TYPE',        d: 'Fence type bitmask',                v: '7'     },
        { n: 'FENCE_ALT_MAX',     d: 'Fence max altitude (m)',            v: '100'   },
        { n: 'FS_BATT_ENABLE',    d: 'Battery failsafe enable',           v: '2'     },
        { n: 'FS_GCS_ENABLE',     d: 'GCS failsafe enable',               v: '1'     },
        { n: 'FS_THR_ENABLE',     d: 'Throttle failsafe enable',          v: '1'     },
        { n: 'FS_THR_VALUE',      d: 'Throttle failsafe PWM value',       v: '975'   },
        { n: 'GPS_TYPE',          d: 'GPS type',                          v: '1'     },
        { n: 'GPS_HDOP_GOOD',     d: 'GPS HDOP good threshold',           v: '1.4'   },
        { n: 'INS_ACCEL_FILTER',  d: 'Accel low-pass filter (Hz)',        v: '20'    },
        { n: 'INS_GYRO_FILTER',   d: 'Gyro low-pass filter (Hz)',         v: '20'    },
        { n: 'LOG_BITMASK',       d: 'Log bitmask',                       v: '65535' },
        { n: 'MOT_SPIN_ARM',      d: 'Motor spin when armed',             v: '0.1'   },
        { n: 'MOT_SPIN_MIN',      d: 'Motor spin minimum',                v: '0.15'  },
        { n: 'MOT_SPIN_MAX',      d: 'Motor spin maximum',                v: '0.95'  },
        { n: 'MOT_THST_HOVER',    d: 'Motor hover thrust',                v: '0.35'  },
        { n: 'PILOT_SPEED_UP',    d: 'Max climb speed (cm/s)',            v: '250'   },
        { n: 'PILOT_SPEED_DN',    d: 'Max descent speed (cm/s)',          v: '150'   },
        { n: 'RC_SPEED',          d: 'ESC update speed (Hz)',              v: '490'   },
        { n: 'RTL_ALT',           d: 'RTL return altitude (cm)',           v: '1500'  },
        { n: 'RTL_SPEED',         d: 'RTL return speed (cm/s)',            v: '0'     },
        { n: 'SCHED_LOOP_RATE',   d: 'Scheduler loop rate (Hz)',          v: '400'   },
        { n: 'WPNAV_SPEED',       d: 'Waypoint cruise speed (cm/s)',      v: '500'   },
        { n: 'WPNAV_ACCEL',       d: 'Waypoint acceleration (cm/s²)',     v: '250'   },
        { n: 'WPNAV_RADIUS',      d: 'Waypoint acceptance radius (cm)',   v: '200'   },
    ];

    function buildRows(params) {
        return params.map(p =>
            `<tr>
               <td>${p.n}</td>
               <td>${p.d}</td>
               <td><input class="param-val-input" value="${p.v}" readonly></td>
             </tr>`
        ).join('');
    }

    function render() {
        return `
<div class="settings-panel-title">Full Parameter List</div>
<div class="calib-card param-full-card">

  <div class="param-toolbar">
    <input type="text" class="param-search-bar" id="fullParamSearch"
           placeholder="Search parameters by name or description…">
    <button class="calib-btn calib-btn-secondary" id="fullRefreshBtn" style="white-space:nowrap">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="23 4 23 10 17 10"/>
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
      </svg>
      Refresh
    </button>
  </div>

  <div class="param-table-wrap">
    <table class="param-table">
      <thead>
        <tr>
          <th class="col-param">Parameter</th>
          <th class="col-desc">Description</th>
          <th class="col-val">Value</th>
        </tr>
      </thead>
      <tbody id="fullParamBody">
        ${buildRows(FULL_PARAMS)}
      </tbody>
    </table>
  </div>

  <div class="param-table-footer">
    <span id="fullParamCount">${FULL_PARAMS.length} parameters loaded</span>
    <div class="calib-actions" style="margin:0;display:flex;gap:8px;flex-wrap:wrap">
      <button class="calib-btn calib-btn-primary"   style="padding:8px 16px;font-size:12px" id="fullWriteBtn">Write Changed</button>
      <button class="calib-btn calib-btn-secondary" style="padding:8px 14px;font-size:12px" id="fullSaveBtn">Save to File</button>
      <button class="calib-btn calib-btn-secondary" style="padding:8px 14px;font-size:12px" id="fullLoadBtn">Load from File</button>
    </div>
  </div>

</div>`;
    }

    function init() {
        const host = document.getElementById('panel-param-full');
        if (!host) return;

        host.innerHTML = render();

        const { toast } = window.SwUtil;

        document.getElementById('fullParamSearch')?.addEventListener('input', function () {
            const qv   = this.value.toLowerCase();
            const rows = document.querySelectorAll('#fullParamBody tr');
            let vis    = 0;
            rows.forEach(r => {
                const match = r.textContent.toLowerCase().includes(qv);
                r.style.display = match ? '' : 'none';
                if (match) vis++;
            });
            const cnt = document.getElementById('fullParamCount');
            if (cnt) cnt.textContent = vis + ' parameters' + (qv ? ' (filtered)' : ' loaded');
        });

        document.getElementById('fullWriteBtn')?.addEventListener('click', () =>
            toast('Changed parameters written to flight controller'));

        document.getElementById('fullRefreshBtn')?.addEventListener('click', () =>
            toast('Parameter list refreshed'));

        document.getElementById('fullSaveBtn')?.addEventListener('click', () =>
            toast('Parameters saved to file'));

        document.getElementById('fullLoadBtn')?.addEventListener('click', () =>
            toast('Parameters loaded from file'));
    }

    window.ParamFull = { init };
    console.log('✅ ParamFull module ready');
})();