/**
 * Plan Flight Mode Handler - COMPLETE VERSION
 * With clean exit button and organized mission stats
 */

class PlanFlightMode {
    constructor() {
        console.log('🔧 PlanFlightMode constructor called');
        
        this.isActive = false;
        
        // DOM elements
        this.headerBar = null;
        this.headerLeft = null;
        this.headerCenter = null;
        this.statusBadge = null;
        this.messageConsole = null;
        this.weatherDashboard = null;
        this.tihanLogo = null;
        this.stripContainer = null;
        this.flightControlsStrip = null;
        this.planMenuStrip = null;
        
        this.initialize();
    }

    initialize() {
        console.log('🗺️ Initializing Plan Flight Mode...');
        
        // Get DOM elements with detailed logging
        this.headerBar = document.querySelector('.header-bar');
        console.log('headerBar found:', !!this.headerBar);
        
        this.headerLeft = document.querySelector('.header-left');
        console.log('headerLeft found:', !!this.headerLeft);
        
        this.headerCenter = document.querySelector('.header-center');
        console.log('headerCenter found:', !!this.headerCenter);
        
        this.statusBadge = document.querySelector('.status-badge');
        console.log('statusBadge found:', !!this.statusBadge);
        
        this.messageConsole = document.querySelector('.minimal-console-container');
        console.log('messageConsole found:', !!this.messageConsole);
        
        this.weatherDashboard = document.getElementById('weatherDashboard');
        console.log('weatherDashboard found:', !!this.weatherDashboard);
        
        this.tihanLogo = document.getElementById('tihanLogo');
        console.log('tihanLogo found:', !!this.tihanLogo);
        
        this.stripContainer = document.getElementById('dropdownMenuStrip');
        console.log('stripContainer found:', !!this.stripContainer);
        
        this.flightControlsStrip = document.getElementById('flightControlsStrip');
        console.log('flightControlsStrip found:', !!this.flightControlsStrip);
        
        this.planMenuStrip = document.getElementById('planFlightMenuStrip');
        console.log('planMenuStrip found:', !!this.planMenuStrip);
        
        // Hide plan menu strip initially
        if (this.planMenuStrip) {
            this.planMenuStrip.style.display = 'none';
            console.log('✅ Plan menu strip hidden initially');
        } else {
            console.error('❌ CRITICAL: planFlightMenuStrip element NOT FOUND in DOM!');
            console.log('💡 Make sure you have added the HTML to MainWindow.html');
        }
        
        console.log('✅ Plan Flight Mode initialized');
    }

    // ========================================================================
    // ENTER PLAN FLIGHT MODE
    // ========================================================================
    
    enter() {
        console.log('🗺️ Entering Plan Flight Mode');
        console.log('Current isActive:', this.isActive);
        
        this.isActive = true;
        
        // Add body class for styling
        document.body.classList.add('plan-mode-active');
        
        // Hide elements
        console.log('Step 1: Hiding elements...');
        this.hideElements();
        
        // Transform header
        console.log('Step 2: Transforming header...');
        this.transformHeaderForPlanMode();
        
        // Show plan menu strip
        console.log('Step 3: Showing plan menu strip...');
        this.showPlanMenuStrip();
        
        // Move weather to bottom left
        console.log('Step 4: Moving weather...');
        this.moveWeatherToBottomLeft();
        
        // Create command editor
        console.log('Step 5: Creating command editor...');
        this.createCommandEditor();
        
        // Attach menu event listeners
        console.log('Step 6: Attaching menu listeners...');
        this.attachMenuEventListeners();
        
        // Show success message
        if (window.MsgConsole) {
            window.MsgConsole.success('Plan Flight Mode activated');
        }
        
        console.log('✅ Plan Flight Mode active - isActive:', this.isActive);
    }

    // ========================================================================
    // EXIT PLAN FLIGHT MODE
    // ========================================================================
    
    exit() {
        console.log('👋 Exiting Plan Flight Mode');
        
        this.isActive = false;
        
        // Remove body class
        document.body.classList.remove('plan-mode-active');
        
        // Restore header
        console.log('Step 1: Restoring header...');
        this.restoreHeader();
        
        // Restore weather position
        console.log('Step 2: Restoring weather...');
        this.restoreWeatherPosition();
        
        // Remove UI elements
        console.log('Step 3: Removing command editor...');
        this.removeCommandEditor();
        
        console.log('Step 4: Hiding plan menu strip...');
        this.hidePlanMenuStrip();
        
        // Show hidden elements
        console.log('Step 5: Showing hidden elements...');
        this.showElements();
        
        console.log('✅ Plan Flight Mode exited');
    }

    // ========================================================================
    // SHOW/HIDE PLAN MENU STRIP
    // ========================================================================
    
    showPlanMenuStrip() {
        console.log('🎯 showPlanMenuStrip called');
        console.log('planMenuStrip exists:', !!this.planMenuStrip);
        
        if (this.planMenuStrip) {
            console.log('Before: display =', this.planMenuStrip.style.display);
            this.planMenuStrip.style.display = 'flex';
            console.log('After: display =', this.planMenuStrip.style.display);
            
            // Verify visibility
            const rect = this.planMenuStrip.getBoundingClientRect();
            console.log('Menu position:', {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height
            });
            
            console.log('✅ Plan menu strip shown');
        } else {
            console.error('❌ Plan menu strip not found!');
            console.log('💡 Check if HTML is added to MainWindow.html');
        }
    }
    
    hidePlanMenuStrip() {
        console.log('🎯 hidePlanMenuStrip called');
        if (this.planMenuStrip) {
            this.planMenuStrip.style.display = 'none';
            console.log('✅ Plan menu strip hidden');
        }
    }

    // ========================================================================
    // HIDE/SHOW ELEMENTS
    // ========================================================================
    
    hideElements() {
        // Hide dropdown menu strip
        if (this.stripContainer) {
            this.stripContainer.style.display = 'none';
            console.log('✅ Dropdown menu strip hidden');
        }
        
        // Hide flight controls strip
        if (this.flightControlsStrip) {
            this.flightControlsStrip.style.display = 'none';
            console.log('✅ Flight controls strip hidden');
        }
        
        // Hide message console
        if (this.messageConsole) {
            this.messageConsole.style.display = 'none';
            console.log('✅ Message console hidden');
        }
    }
    
    showElements() {
        // Show message console
        if (this.messageConsole) {
            this.messageConsole.style.display = 'flex';
            console.log('✅ Message console shown');
        }
        
        // Show flight controls
        if (this.flightControlsStrip) {
            this.flightControlsStrip.style.display = 'flex';
            console.log('✅ Flight controls shown');
        }
        
        // Show dropdown menu strip
        if (this.stripContainer) {
            this.stripContainer.style.display = 'flex';
            console.log('✅ Dropdown menu strip shown');
        }
    }

    // ========================================================================
    // HEADER TRANSFORMATION
    // ========================================================================
    
    transformHeaderForPlanMode() {
        if (!this.headerBar) {
            console.error('❌ headerBar not found');
            return;
        }
        
        // Hide logo and status badge
        if (this.tihanLogo) {
            this.tihanLogo.style.display = 'none';
            console.log('✅ Logo hidden');
        }
        
        if (this.statusBadge) {
            this.statusBadge.style.display = 'none';
            console.log('✅ Status badge hidden');
        }
        
        // Create and insert Exit Plan button
        const exitBtn = this.createExitButton();
        if (this.headerLeft) {
            this.headerLeft.insertBefore(exitBtn, this.headerLeft.firstChild);
            console.log('✅ Exit button added');
        }
        
        // Update header center with mission stats
        this.updateHeaderCenterWithStats();
    }

    createExitButton() {
        const exitBtn = document.createElement('button');
        exitBtn.id = 'exitPlanBtn';
        exitBtn.className = 'exit-plan-btn';
        exitBtn.innerHTML = `
            <svg class="exit-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Exit Plan</span>
        `;
        
        exitBtn.addEventListener('click', () => {
            console.log('🖱️ Exit button clicked');
            this.exit();
        });
        
        console.log('✅ Exit button created');
        return exitBtn;
    }

    updateHeaderCenterWithStats() {
        if (!this.headerCenter) {
            console.error('❌ headerCenter not found');
            return;
        }
        
        // Store original content for restoration
        if (!this.headerCenter.dataset.originalContent) {
            this.headerCenter.dataset.originalContent = this.headerCenter.innerHTML;
            console.log('✅ Original header content stored');
        }
        
        // Clear and add mission stats
        this.headerCenter.innerHTML = '';
        
        const missionStats = this.createMissionStats();
        const totalMission = this.createTotalMission();
        
        this.headerCenter.appendChild(missionStats);
        this.headerCenter.appendChild(totalMission);
        
        console.log('✅ Header center updated with mission stats');
    }

    createMissionStats() {
        const missionStats = document.createElement('div');
        missionStats.className = 'plan-mission-stats';
        missionStats.innerHTML = `
            <div class="stat-group">
                <span class="stat-label">Waypoint</span>
                <span class="stat-value">Alt: <strong>0.0 m</strong></span>
            </div>
            <div class="stat-group">
                <span class="stat-label">Azimuth</span>
                <span class="stat-value"><strong>0°</strong></span>
            </div>
            <div class="stat-group">
                <span class="stat-label">Distance</span>
                <span class="stat-value"><strong>0.0 m</strong></span>
            </div>
            <div class="stat-group">
                <span class="stat-label">Gradient</span>
                <span class="stat-value"><strong>--</strong></span>
            </div>
            <div class="stat-group">
                <span class="stat-label">Heading</span>
                <span class="stat-value"><strong>--</strong></span>
            </div>
        `;
        return missionStats;
    }

    createTotalMission() {
        const totalMission = document.createElement('div');
        totalMission.className = 'plan-total-mission';
        totalMission.innerHTML = `
            <div class="stat-group">
                <span class="stat-label">Mission</span>
                <span class="stat-value"><strong>0 m</strong></span>
            </div>
            <div class="stat-group">
                <span class="stat-label">Time</span>
                <span class="stat-value"><strong>00:00:00</strong></span>
            </div>
            <div class="stat-group">
                <span class="stat-label">Max Dist</span>
                <span class="stat-value"><strong>0 m</strong></span>
            </div>
        `;
        return totalMission;
    }

    restoreHeader() {
        // Remove exit button
        const exitBtn = document.getElementById('exitPlanBtn');
        if (exitBtn) {
            exitBtn.remove();
            console.log('✅ Exit button removed');
        }
        
        // Show logo
        if (this.tihanLogo) {
            this.tihanLogo.style.display = 'block';
            console.log('✅ Logo shown');
        }
        
        // Show status badge
        if (this.statusBadge) {
            this.statusBadge.style.display = 'flex';
            console.log('✅ Status badge shown');
        }
        
        // Restore header center
        if (this.headerCenter && this.headerCenter.dataset.originalContent) {
            this.headerCenter.innerHTML = this.headerCenter.dataset.originalContent;
            console.log('✅ Header center restored');
        }
    }

    // ========================================================================
    // MENU EVENT LISTENERS
    // ========================================================================
    
    attachMenuEventListeners() {
        if (!this.planMenuStrip) {
            console.error('❌ Cannot attach listeners - planMenuStrip not found');
            return;
        }
        
        const menuLinks = this.planMenuStrip.querySelectorAll('.plan-menu-content a');
        console.log(`Found ${menuLinks.length} menu links`);
        
        menuLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const action = link.dataset.action;
                console.log(`Menu link ${index} clicked: ${action}`);
                this.handleMenuAction(action);
            });
        });
        
        console.log('✅ Menu event listeners attached');
    }

    handleMenuAction(action) {
        console.log(`📋 Menu action: ${action}`);
        
        if (window.MsgConsole) {
            window.MsgConsole.info(`Action: ${action.replace(/-/g, ' ')}`);
        }
        
        // Add your action handlers here
        switch(action) {
            case 'new-mission':
                console.log('Creating new mission...');
                break;
            case 'save-mission':
                console.log('Saving mission...');
                break;
            case 'add-waypoint':
                console.log('Adding waypoint...');
                break;
            case 'center-mission':
                console.log('Centering mission...');
                break;
            default:
                console.log(`Action not implemented: ${action}`);
        }
    }

    // ========================================================================
    // COMMAND EDITOR PANEL
    // ========================================================================
    
    createCommandEditor() {
        console.log('🎯 createCommandEditor called');
        
        // Use the existing command editor if window.CommandEditor is available
        if (window.CommandEditor) {
            console.log('✅ Using existing CommandEditor component');
            window.CommandEditor.show();
        } else {
            console.warn('⚠️ window.CommandEditor not found. Make sure command-editor.js is loaded.');
            console.log('💡 Attempting to show panel directly...');
            
            // Fallback: Try to show the panel directly
            const editor = document.getElementById('commandEditorPanel');
            if (editor) {
                editor.style.display = 'flex';
                console.log('✅ Command editor panel shown directly');
            } else {
                console.error('❌ Command editor panel not found in DOM');
                console.log('💡 Make sure command-editor.html is included in MainWindow.html');
            }
        }
    }

    removeCommandEditor() {
        console.log('🎯 removeCommandEditor called');
        
        // Use the existing command editor if window.CommandEditor is available
        if (window.CommandEditor) {
            console.log('✅ Using existing CommandEditor component to hide');
            window.CommandEditor.hide();
        } else {
            // Fallback: Try to hide the panel directly
            const editor = document.getElementById('commandEditorPanel');
            if (editor) {
                editor.style.display = 'none';
                console.log('✅ Command editor panel hidden directly');
            }
        }
    }

    // ========================================================================
    // WEATHER DASHBOARD MOVEMENT
    // ========================================================================
    
    moveWeatherToBottomLeft() {
        if (!this.weatherDashboard) {
            console.error('❌ weatherDashboard not found');
            return;
        }
        
        // Move to bottom left - positioned to not overlap with flight menu
        this.weatherDashboard.style.top = 'auto';
        this.weatherDashboard.style.bottom = '20px';
        this.weatherDashboard.style.right = 'auto';
        this.weatherDashboard.style.left = '110px'; // Positioned right of the menu strip
        this.weatherDashboard.style.maxHeight = 'calc(100vh - 350px)'; // Ensure it doesn't grow too tall
        
        console.log('✅ Weather moved to bottom left');
    }

    restoreWeatherPosition() {
        if (!this.weatherDashboard) {
            console.error('❌ weatherDashboard not found');
            return;
        }
        
        // Restore to top right
        this.weatherDashboard.style.top = '80px';
        this.weatherDashboard.style.bottom = 'auto';
        this.weatherDashboard.style.right = '20px';
        this.weatherDashboard.style.left = 'auto';
        this.weatherDashboard.style.maxHeight = ''; // Remove max height constraint
        
        console.log('✅ Weather restored to top right');
    }

    // ========================================================================
    // UTILITY METHODS
    // ========================================================================
    
    getIsActive() {
        return this.isActive;
    }
}

// ============================================================================
// AUTO-INITIALIZATION
// ============================================================================

let planFlightMode = null;

function initializePlanFlightMode() {
    console.log('🎯 Creating PlanFlightMode instance...');
    
    if (!planFlightMode) {
        planFlightMode = new PlanFlightMode();
        
        // Expose globally
        window.PlanFlight = {
            enter: () => {
                console.log('🎯 window.PlanFlight.enter() called');
                if (planFlightMode) {
                    planFlightMode.enter();
                } else {
                    console.error('❌ Plan Flight mode not initialized!');
                }
            },
            exit: () => {
                console.log('🎯 window.PlanFlight.exit() called');
                if (planFlightMode) {
                    planFlightMode.exit();
                }
            },
            isActive: () => {
                return planFlightMode ? planFlightMode.getIsActive() : false;
            },
            debug: () => {
                console.log('=== PLAN FLIGHT DEBUG INFO ===');
                console.log('Instance exists:', !!planFlightMode);
                console.log('Is active:', planFlightMode?.isActive);
                console.log('Menu element exists:', !!document.getElementById('planFlightMenuStrip'));
                const menu = document.getElementById('planFlightMenuStrip');
                if (menu) {
                    console.log('Menu display:', menu.style.display);
                    console.log('Menu computed display:', getComputedStyle(menu).display);
                }
            }
        };
        
        console.log('✅ window.PlanFlight exposed globally');
        console.log('💡 Use window.PlanFlight.debug() for troubleshooting');
    }
    
    return planFlightMode;
}

// Initialize immediately or on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePlanFlightMode);
} else {
    initializePlanFlightMode();
}

console.log('✅ Plan Flight Mode Script Loaded (Complete Version)');