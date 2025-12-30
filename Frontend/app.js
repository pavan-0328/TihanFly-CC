/**
 * Main Application Script - app.js
 * Integrates map, compass, video, flight controls, message console, and weather dashboard
 */

console.log('🚀 TiHANFly GCS Application Starting...');

// ============================================================================
// GLOBAL VARIABLES
// ============================================================================

let tmap = null;
let compass = null;
let videoStream = null;
let flightControls = null;
let messageConsole = null;
let weatherDashboard = null;

// ============================================================================
// INITIALIZATION
// ============================================================================

function initializeApplication() {
    console.log('⚙️ Initializing application components...');
    
    // 1. Initialize Map
    initializeMap();
    
    // 2. Initialize Compass
    initializeCompass();
    
    // 3. Initialize Video Stream (if available)
    initializeVideo();
    
    // 4. Wait for all components to load, then integrate
    setTimeout(() => {
        integrateComponents();
    }, 1000);
}

// ============================================================================
// MAP INITIALIZATION
// ============================================================================

function initializeMap() {
    console.log('🗺️ Initializing map...');
    
    try {
        // Default center: Hyderabad, India
        const defaultLat = 17.4435;
        const defaultLng = 78.3772;
        const defaultZoom = 15;
        
        // Create TMap instance
        tmap = new TMap('map', [defaultLat, defaultLng], defaultZoom, false);
        window.tmap = tmap; // Make globally accessible
        
        console.log('✅ Map initialized');
        
    } catch (error) {
        console.error('❌ Error initializing map:', error);
    }
}

// ============================================================================
// COMPASS INITIALIZATION
// ============================================================================

function initializeCompass() {
    console.log('🧭 Initializing compass...');
    
    try {
        compass = new CompassEnhanced('map');
        window.compass = compass;
        
        // Set initial telemetry data
        compass.updateTelemetry({
            latitude: 17.4435,
            longitude: 78.3772,
            altitude: 0,
            speed: 0,
            distance: 0,
            satellites: 12
        });
        
        console.log('✅ Compass initialized');
        
    } catch (error) {
        console.error('❌ Error initializing compass:', error);
    }
}

// ============================================================================
// VIDEO STREAM INITIALIZATION
// ============================================================================

function initializeVideo() {
    console.log('📹 Initializing video stream...');
    
    try {
        // Video stream initialization (if VideoStream class exists)
        if (typeof VideoStream !== 'undefined') {
            videoStream = new VideoStream('videoStream');
            window.videoStream = videoStream;
            console.log('✅ Video stream initialized');
        } else {
            console.log('ℹ️ VideoStream class not found, skipping video initialization');
        }
        
    } catch (error) {
        console.error('❌ Error initializing video:', error);
    }
}

// ============================================================================
// COMPONENT INTEGRATION
// ============================================================================

function integrateComponents() {
    console.log('🔗 Integrating components...');
    
    // Get references to existing components
    flightControls = window.flightControls;
    messageConsole = window.minimalConsole || window.MsgConsole;
    weatherDashboard = window.weatherDashboard;
    
    // Integrate Weather Dashboard with Map
    integrateWeatherDashboard();
    
    // Integrate Flight Controls with Message Console
    integrateFlightControls();
    
    // Set up demo data updates
    startDemoUpdates();
    
    console.log('✅ All components integrated');
    
    // Show welcome message
    if (window.MsgConsole) {
        window.MsgConsole.success('🚁 TiHANFly GCS Ready');
        window.MsgConsole.info('Click map to load weather data');
    }
}

// ============================================================================
// WEATHER DASHBOARD INTEGRATION
// ============================================================================

function integrateWeatherDashboard() {
    console.log('🌤️ Integrating Weather Dashboard with map...');
    
    if (!tmap) {
        console.error('❌ Map not found, cannot integrate weather dashboard');
        return;
    }
    
    if (!weatherDashboard) {
        console.error('❌ Weather Dashboard not found');
        return;
    }
    
    // Enable map clicking
    tmap.enableClick();
    console.log('✅ Map click enabled');
    
    // Set up click handler for weather
    tmap.onClick((lat, lng) => {
        console.log(`🌍 Map clicked: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        
        // Fetch weather for this location
        weatherDashboard.onMapClick(lat, lng);
        
        // Log to message console
        if (window.MsgConsole) {
            window.MsgConsole.info(`Weather requested: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }
    });
    
    console.log('✅ Weather Dashboard integrated with map');
    console.log('👆 Click anywhere on the map to load weather data');
}

// ============================================================================
// FLIGHT CONTROLS INTEGRATION
// ============================================================================

function integrateFlightControls() {
    console.log('🎮 Integrating Flight Controls...');
    
    if (!flightControls) {
        console.log('ℹ️ Flight Controls not found, skipping integration');
        return;
    }
    
    // Set up flight control callbacks
    flightControls.onTakeoff((settings) => {
        console.log('🚁 TAKEOFF initiated:', settings);
        if (window.MsgConsole) {
            window.MsgConsole.takeoff(settings.altitude);
        }
    });
    
    flightControls.onLand(() => {
        console.log('🛬 LAND initiated');
        if (window.MsgConsole) {
            window.MsgConsole.land();
        }
    });
    
    flightControls.onRTL(() => {
        console.log('🏠 RTL initiated');
        if (window.MsgConsole) {
            window.MsgConsole.rtl();
        }
    });
    
    console.log('✅ Flight Controls integrated');
}

// ============================================================================
// DEMO DATA UPDATES
// ============================================================================

function startDemoUpdates() {
    console.log('📊 Starting demo data updates...');
    
    // Update compass heading every 2 seconds (simulated rotation)
    let currentHeading = 0;
    setInterval(() => {
        if (compass) {
            currentHeading = (currentHeading + 5) % 360;
            compass.setHeading(currentHeading);
        }
    }, 2000);
    
    // Update telemetry data every 5 seconds
    setInterval(() => {
        if (compass) {
            const randomAlt = (Math.random() * 50).toFixed(1);
            const randomSpeed = (Math.random() * 10).toFixed(1);
            
            compass.updateTelemetry({
                altitude: parseFloat(randomAlt),
                speed: parseFloat(randomSpeed),
                satellites: Math.floor(Math.random() * 5) + 10
            });
        }
    }, 5000);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Test weather dashboard with default location
 */
function testWeather() {
    if (window.weatherDashboard) {
        console.log('🧪 Testing weather with Hyderabad location...');
        window.weatherDashboard.fetchWeather(17.4435, 78.3772);
    } else {
        console.error('❌ Weather Dashboard not found');
    }
}

/**
 * Debug all components
 */
function debugComponents() {
    console.log('🔍 Component Debug Information:');
    console.log('================================');
    console.log('Map (tmap):', !!tmap);
    console.log('Compass:', !!compass);
    console.log('Video Stream:', !!videoStream);
    console.log('Flight Controls:', !!flightControls);
    console.log('Message Console:', !!messageConsole);
    console.log('Weather Dashboard:', !!weatherDashboard);
    console.log('================================');
    
    if (tmap) {
        console.log('Map click enabled:', tmap.clickEnabled);
        console.log('Map has click callback:', !!tmap.clickCallback);
    }
    
    if (weatherDashboard) {
        console.log('Weather visible:', weatherDashboard.isVisible);
        console.log('Weather loading:', weatherDashboard.isLoading);
    }
}

// ============================================================================
// GLOBAL API
// ============================================================================

window.GCS = {
    // Component references
    map: () => tmap,
    compass: () => compass,
    video: () => videoStream,
    flightControls: () => flightControls,
    weather: () => weatherDashboard,
    
    // Utility functions
    testWeather: testWeather,
    debug: debugComponents,
    
    // Quick actions
    showWeather: () => window.Weather?.show(),
    hideWeather: () => window.Weather?.hide(),
    toggleWeather: () => window.Weather?.toggle(),
};

// ============================================================================
// AUTO-START
// ============================================================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApplication);
} else {
    initializeApplication();
}

// Export global reference
window.app = {
    tmap,
    compass,
    videoStream,
    flightControls,
    weatherDashboard
};

console.log('✅ Application script loaded');
console.log('Available commands:');
console.log('  - GCS.testWeather() - Test weather with default location');
console.log('  - GCS.debug() - Show component status');
console.log('  - GCS.showWeather() - Show weather dashboard');
console.log('  - GCS.hideWeather() - Hide weather dashboard');
