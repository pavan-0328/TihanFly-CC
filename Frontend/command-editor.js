/**
 * Command Editor Panel Handler
 * Manages tab switching and form interactions
 */

class CommandEditor {
    constructor() {
        console.log('📝 CommandEditor constructor called');
        
        this.panel = null;
        this.currentTab = 'mission';
        
        this.initialize();
    }

    initialize() {
        console.log('📝 Initializing Command Editor...');
        
        // Get panel element
        this.panel = document.getElementById('commandEditorPanel');
        
        if (!this.panel) {
            console.error('❌ Command editor panel not found');
            return;
        }
        
        console.log('✅ Command editor panel found');
        
        // Hide panel initially
        this.hide();
        
        // Attach event listeners
        this.attachTabListeners();
        this.attachFormListeners();
        
        console.log('✅ Command Editor initialized');
    }

    // ========================================================================
    // SHOW/HIDE METHODS
    // ========================================================================
    
    show() {
        if (!this.panel) {
            console.error('❌ Cannot show - panel not found');
            return;
        }
        
        this.panel.style.display = 'flex';
        console.log('✅ Command editor shown');
    }
    
    hide() {
        if (!this.panel) {
            console.error('❌ Cannot hide - panel not found');
            return;
        }
        
        this.panel.style.display = 'none';
        console.log('✅ Command editor hidden');
    }
    
    isVisible() {
        if (!this.panel) return false;
        return this.panel.style.display === 'flex';
    }

    // ========================================================================
    // TAB SWITCHING
    // ========================================================================
    
    attachTabListeners() {
        if (!this.panel) return;
        
        const tabs = this.panel.querySelectorAll('.editor-tab');
        console.log(`Found ${tabs.length} editor tabs`);
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                console.log(`Tab clicked: ${tabName}`);
                this.switchTab(tabName);
            });
        });
        
        console.log('✅ Tab listeners attached');
    }
    
    switchTab(tabName) {
        if (!this.panel) return;
        
        console.log(`Switching to tab: ${tabName}`);
        
        // Update current tab
        this.currentTab = tabName;
        
        // Remove active class from all tabs and panels
        this.panel.querySelectorAll('.editor-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        this.panel.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        // Add active class to selected tab and panel
        const selectedTab = this.panel.querySelector(`[data-tab="${tabName}"]`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        const selectedPanel = document.getElementById(`${tabName}Panel`);
        if (selectedPanel) {
            selectedPanel.classList.add('active');
        }
        
        console.log(`✅ Switched to ${tabName} tab`);
    }

    // ========================================================================
    // FORM INTERACTIONS
    // ========================================================================
    
    attachFormListeners() {
        if (!this.panel) return;
        
        // Listen for changes on all form controls
        const formControls = this.panel.querySelectorAll('.form-control');
        console.log(`Found ${formControls.length} form controls`);
        
        formControls.forEach(control => {
            control.addEventListener('change', (e) => {
                this.handleFormChange(e.target);
            });
        });
        
        // Listen for checkbox changes
        const checkboxes = this.panel.querySelectorAll('input[type="checkbox"]');
        console.log(`Found ${checkboxes.length} checkboxes`);
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleCheckboxChange(e.target);
            });
        });
        
        console.log('✅ Form listeners attached');
    }
    
    handleFormChange(control) {
        const label = control.previousElementSibling?.textContent || 'Unknown';
        const value = control.value;
        
        console.log(`Form changed: ${label} = ${value}`);
        
        if (window.MsgConsole) {
            window.MsgConsole.info(`${label}: ${value}`);
        }
        
        // Add your custom logic here
        // For example, update mission parameters, validate values, etc.
    }
    
    handleCheckboxChange(checkbox) {
        const label = checkbox.parentElement?.textContent.trim() || 'Unknown';
        const checked = checkbox.checked;
        
        console.log(`Checkbox changed: ${label} = ${checked}`);
        
        if (window.MsgConsole) {
            window.MsgConsole.info(`${label}: ${checked ? 'Enabled' : 'Disabled'}`);
        }
        
        // Add your custom logic here
    }

    // ========================================================================
    // DATA GETTERS
    // ========================================================================
    
    getMissionData() {
        const missionPanel = document.getElementById('missionPanel');
        if (!missionPanel) return null;
        
        const controls = missionPanel.querySelectorAll('.form-control');
        const checkboxes = missionPanel.querySelectorAll('input[type="checkbox"]');
        
        const data = {
            altitudeMode: controls[0]?.value || 'Relative To Launch',
            initialAltitude: parseFloat(controls[1]?.value) || 50.0,
            defaultSpeed: parseFloat(controls[2]?.value) || 10.0,
            loiterRadius: parseFloat(controls[3]?.value) || 50.0,
            autoRTL: checkboxes[0]?.checked || false
        };
        
        console.log('Mission data:', data);
        return data;
    }
    
    getFenceData() {
        const fencePanel = document.getElementById('fencePanel');
        if (!fencePanel) return null;
        
        const controls = fencePanel.querySelectorAll('.form-control');
        
        const data = {
            fenceType: controls[0]?.value || 'Inclusion Fence',
            maxAltitude: parseFloat(controls[1]?.value) || 100.0
        };
        
        console.log('Fence data:', data);
        return data;
    }
    
    getRallyData() {
        const rallyPanel = document.getElementById('rallyPanel');
        if (!rallyPanel) return null;
        
        const controls = rallyPanel.querySelectorAll('.form-control');
        
        const data = {
            rallyAltitude: parseFloat(controls[0]?.value) || 50.0,
            landAltitude: parseFloat(controls[1]?.value) || 10.0
        };
        
        console.log('Rally data:', data);
        return data;
    }
    
    getAllData() {
        return {
            currentTab: this.currentTab,
            mission: this.getMissionData(),
            fence: this.getFenceData(),
            rally: this.getRallyData()
        };
    }

    // ========================================================================
    // DATA SETTERS
    // ========================================================================
    
    setMissionData(data) {
        const missionPanel = document.getElementById('missionPanel');
        if (!missionPanel || !data) return;
        
        const controls = missionPanel.querySelectorAll('.form-control');
        const checkboxes = missionPanel.querySelectorAll('input[type="checkbox"]');
        
        if (data.altitudeMode && controls[0]) controls[0].value = data.altitudeMode;
        if (data.initialAltitude !== undefined && controls[1]) controls[1].value = data.initialAltitude;
        if (data.defaultSpeed !== undefined && controls[2]) controls[2].value = data.defaultSpeed;
        if (data.loiterRadius !== undefined && controls[3]) controls[3].value = data.loiterRadius;
        if (data.autoRTL !== undefined && checkboxes[0]) checkboxes[0].checked = data.autoRTL;
        
        console.log('✅ Mission data set');
    }
    
    setFenceData(data) {
        const fencePanel = document.getElementById('fencePanel');
        if (!fencePanel || !data) return;
        
        const controls = fencePanel.querySelectorAll('.form-control');
        
        if (data.fenceType && controls[0]) controls[0].value = data.fenceType;
        if (data.maxAltitude !== undefined && controls[1]) controls[1].value = data.maxAltitude;
        
        console.log('✅ Fence data set');
    }
    
    setRallyData(data) {
        const rallyPanel = document.getElementById('rallyPanel');
        if (!rallyPanel || !data) return;
        
        const controls = rallyPanel.querySelectorAll('.form-control');
        
        if (data.rallyAltitude !== undefined && controls[0]) controls[0].value = data.rallyAltitude;
        if (data.landAltitude !== undefined && controls[1]) controls[1].value = data.landAltitude;
        
        console.log('✅ Rally data set');
    }

    // ========================================================================
    // RESET METHODS
    // ========================================================================
    
    resetMissionPanel() {
        this.setMissionData({
            altitudeMode: 'Relative To Launch',
            initialAltitude: 50.0,
            defaultSpeed: 10.0,
            loiterRadius: 50.0,
            autoRTL: true
        });
        console.log('✅ Mission panel reset to defaults');
    }
    
    resetFencePanel() {
        this.setFenceData({
            fenceType: 'Inclusion Fence',
            maxAltitude: 100.0
        });
        console.log('✅ Fence panel reset to defaults');
    }
    
    resetRallyPanel() {
        this.setRallyData({
            rallyAltitude: 50.0,
            landAltitude: 10.0
        });
        console.log('✅ Rally panel reset to defaults');
    }
    
    resetAll() {
        this.resetMissionPanel();
        this.resetFencePanel();
        this.resetRallyPanel();
        this.switchTab('mission');
        console.log('✅ All panels reset to defaults');
    }
}

// ============================================================================
// AUTO-INITIALIZATION
// ============================================================================

let commandEditor = null;

function initializeCommandEditor() {
    console.log('🎯 Creating CommandEditor instance...');
    
    if (!commandEditor) {
        commandEditor = new CommandEditor();
        
        // Expose globally
        window.CommandEditor = {
            show: () => {
                console.log('🎯 window.CommandEditor.show() called');
                if (commandEditor) {
                    commandEditor.show();
                } else {
                    console.error('❌ Command Editor not initialized!');
                }
            },
            hide: () => {
                console.log('🎯 window.CommandEditor.hide() called');
                if (commandEditor) {
                    commandEditor.hide();
                }
            },
            isVisible: () => {
                return commandEditor ? commandEditor.isVisible() : false;
            },
            switchTab: (tabName) => {
                if (commandEditor) {
                    commandEditor.switchTab(tabName);
                }
            },
            getData: () => {
                return commandEditor ? commandEditor.getAllData() : null;
            },
            getMissionData: () => {
                return commandEditor ? commandEditor.getMissionData() : null;
            },
            setMissionData: (data) => {
                if (commandEditor) {
                    commandEditor.setMissionData(data);
                }
            },
            reset: () => {
                if (commandEditor) {
                    commandEditor.resetAll();
                }
            },
            debug: () => {
                console.log('=== COMMAND EDITOR DEBUG INFO ===');
                console.log('Instance exists:', !!commandEditor);
                console.log('Panel element exists:', !!document.getElementById('commandEditorPanel'));
                console.log('Is visible:', commandEditor?.isVisible());
                console.log('Current tab:', commandEditor?.currentTab);
                console.log('All data:', commandEditor?.getAllData());
            }
        };
        
        console.log('✅ window.CommandEditor exposed globally');
        console.log('💡 Use window.CommandEditor.debug() for troubleshooting');
    }
    
    return commandEditor;
}

// Initialize immediately or on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCommandEditor);
} else {
    initializeCommandEditor();
}

console.log('✅ Command Editor Script Loaded');