/**
 * Weather Dashboard Handler
 * Fetches and displays weather data from OpenWeatherMap API
 * Integrates with map click events
 */

class WeatherDashboard {
    constructor() {
        // OpenWeatherMap API key
        this.apiKey = '4d125d1558963834e00131a295a7bc87';
        this.apiBaseUrl = 'https://api.openweathermap.org/data/2.5/weather';
        
        // DOM Elements
        this.dashboard = null;
        this.loading = null;
        this.error = null;
        this.content = null;
        this.closeBtn = null;
        this.retryBtn = null;
        
        // Current location data
        this.currentLat = null;
        this.currentLng = null;
        this.lastUpdate = null;
        
        // State
        this.isVisible = true;
        this.isLoading = false;
        
        this.initialize();
    }

    initialize() {
        this.dashboard = document.getElementById('weatherDashboard');
        this.loading = document.getElementById('weatherLoading');
        this.error = document.getElementById('weatherError');
        this.content = document.getElementById('weatherContent');
        this.closeBtn = document.getElementById('weatherCloseBtn');
        this.retryBtn = document.getElementById('weatherRetryBtn');

        if (!this.dashboard) {
            console.error('❌ Weather Dashboard not found in DOM');
            return;
        }

        this.attachEventListeners();
        this.showInitialState();
        
        console.log('✅ Weather Dashboard initialized');
    }

    attachEventListeners() {
        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                this.hide();
            });
        }

        // Retry button
        if (this.retryBtn) {
            this.retryBtn.addEventListener('click', () => {
                if (this.currentLat && this.currentLng) {
                    this.fetchWeather(this.currentLat, this.currentLng);
                }
            });
        }
    }

    showInitialState() {
        this.loading.style.display = 'none';
        this.error.style.display = 'none';
        this.content.style.display = 'flex';
        
        // Show placeholder text
        document.getElementById('weatherUpdateTime').textContent = 'Click map to load weather';
    }

    /**
     * Validate coordinates
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     * @returns {object} - Validated coordinates or null if invalid
     */
    validateCoordinates(lat, lng) {
        // Normalize longitude to -180 to 180 range
        let normalizedLng = lng;
        while (normalizedLng > 180) normalizedLng -= 360;
        while (normalizedLng < -180) normalizedLng += 360;
        
        // Check if latitude is valid
        if (lat < -90 || lat > 90) {
            console.error(`❌ Invalid latitude: ${lat} (must be between -90 and 90)`);
            return null;
        }
        
        // Longitude is now normalized, so it's always valid
        return {
            lat: lat,
            lng: normalizedLng
        };
    }

    /**
     * Fetch weather data for given coordinates
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     */
    async fetchWeather(lat, lng) {
        if (this.isLoading) {
            console.log('⏳ Weather fetch already in progress');
            return;
        }

        // Validate and normalize coordinates
        const coords = this.validateCoordinates(lat, lng);
        if (!coords) {
            const errorMsg = `Invalid coordinates: Lat ${lat.toFixed(2)}, Lng ${lng.toFixed(2)}`;
            console.error('❌', errorMsg);
            this.showError(errorMsg);
            
            if (window.MsgConsole) {
                window.MsgConsole.error(`Weather error: Invalid coordinates`);
            }
            return;
        }

        // Use validated coordinates
        this.currentLat = coords.lat;
        this.currentLng = coords.lng;
        this.isLoading = true;

        console.log(`🌤️ Fetching weather for: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
        
        // Show info if coordinates were normalized
        if (lng !== coords.lng) {
            console.log(`📍 Longitude normalized: ${lng.toFixed(2)} → ${coords.lng.toFixed(2)}`);
            if (window.MsgConsole) {
                window.MsgConsole.warning(`Longitude adjusted to valid range`);
            }
        }

        // Show loading state
        this.showLoading();

        try {
            const url = `${this.apiBaseUrl}?lat=${coords.lat}&lon=${coords.lng}&appid=${this.apiKey}&units=metric`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Weather data received:', data);

            this.displayWeather(data);
            this.lastUpdate = new Date();
            
        } catch (error) {
            console.error('❌ Error fetching weather:', error);
            this.showError(error.message);
            
            if (window.MsgConsole) {
                window.MsgConsole.error(`Weather fetch failed: ${error.message}`);
            }
        } finally {
            this.isLoading = false;
        }
    }

    showLoading() {
        this.loading.style.display = 'flex';
        this.error.style.display = 'none';
        this.content.style.display = 'none';
    }

    showError(message) {
        this.loading.style.display = 'none';
        this.error.style.display = 'flex';
        this.content.style.display = 'none';
        
        const errorMessage = document.getElementById('weatherErrorMessage');
        if (errorMessage) {
            errorMessage.textContent = message || 'Failed to load weather data';
        }
    }

    displayWeather(data) {
        this.loading.style.display = 'none';
        this.error.style.display = 'none';
        this.content.style.display = 'flex';

        // Location
        const locationName = data.name || 'Unknown Location';
        const country = data.sys?.country || '';
        document.getElementById('locationName').textContent = 
            country ? `${locationName}, ${country}` : locationName;
        
        document.getElementById('locationCoords').textContent = 
            `${this.currentLat.toFixed(4)}, ${this.currentLng.toFixed(4)}`;

        // Main weather
        const temp = Math.round(data.main?.temp ?? 0);
        const description = data.weather?.[0]?.description || 'N/A';
        const iconCode = data.weather?.[0]?.icon || '01d';
        
        document.getElementById('weatherTemp').textContent = `${temp}°C`;
        document.getElementById('weatherDescription').textContent = description;
        document.getElementById('weatherMainIcon').src = 
            `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        // Weather details
        const feelsLike = Math.round(data.main?.feels_like ?? 0);
        const humidity = data.main?.humidity ?? 0;
        const windSpeed = data.wind?.speed?.toFixed(1) ?? 0;
        const pressure = data.main?.pressure ?? 0;
        const visibility = ((data.visibility ?? 0) / 1000).toFixed(1);
        const clouds = data.clouds?.all ?? 0;

        document.getElementById('feelsLike').textContent = `${feelsLike}°C`;
        document.getElementById('humidity').textContent = `${humidity}%`;
        document.getElementById('windSpeed').textContent = `${windSpeed} m/s`;
        document.getElementById('pressure').textContent = `${pressure} hPa`;
        document.getElementById('visibility').textContent = `${visibility} km`;
        document.getElementById('clouds').textContent = `${clouds}%`;

        // Update time
        const updateTime = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('weatherUpdateTime').textContent = 
            `Last updated: ${updateTime}`;

        console.log('✅ Weather data displayed successfully');
    }

    /**
     * Handle map click event
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     */
    onMapClick(lat, lng) {
        console.log(`🗺️ Map clicked at: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        this.show();
        this.fetchWeather(lat, lng);
        
        // Log to message console if available
        if (window.MsgConsole) {
            window.MsgConsole.info(`Weather requested for: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }
    }

    /**
     * Refresh current weather data
     */
    refresh() {
        if (this.currentLat && this.currentLng) {
            console.log('🔄 Refreshing weather data');
            this.fetchWeather(this.currentLat, this.currentLng);
        } else {
            console.log('⚠️ No location set, cannot refresh');
        }
    }

    /**
     * Show weather dashboard
     */
    show() {
        if (this.dashboard) {
            this.dashboard.classList.remove('hidden');
            this.isVisible = true;
            console.log('👁️ Weather Dashboard shown');
        }
    }

    /**
     * Hide weather dashboard
     */
    hide() {
        if (this.dashboard) {
            this.dashboard.classList.add('hidden');
            this.isVisible = false;
            console.log('🙈 Weather Dashboard hidden');
        }
    }

    /**
     * Toggle weather dashboard visibility
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * Check if dashboard is visible
     */
    isShown() {
        return this.isVisible;
    }

    /**
     * Get current weather data
     */
    getCurrentLocation() {
        return {
            lat: this.currentLat,
            lng: this.currentLng,
            lastUpdate: this.lastUpdate
        };
    }

    /**
     * Clear weather data
     */
    clear() {
        this.currentLat = null;
        this.currentLng = null;
        this.lastUpdate = null;
        this.showInitialState();
        console.log('🗑️ Weather data cleared');
    }
}

// ============================================================================
// INTEGRATION WITH MAP
// ============================================================================

/**
 * Initialize weather dashboard and integrate with map
 */
function initializeWeatherDashboard() {
    // Create weather dashboard instance
    window.weatherDashboard = new WeatherDashboard();
    
    console.log('🔍 Looking for map instance...');
    
    // Wait for map to be ready, then integrate
    const checkMapInterval = setInterval(() => {
        if (window.tmap) {
            console.log('🗺️ Map found, integrating weather dashboard');
            
            // Enable map click
            window.tmap.enableClick();
            console.log('✅ Map click enabled');
            
            // Set up click handler
            window.tmap.onClick((lat, lng) => {
                console.log(`🌍 Map clicked! Lat: ${lat}, Lng: ${lng}`);
                window.weatherDashboard.onMapClick(lat, lng);
            });
            
            console.log('✅ Weather Dashboard integrated with map - Click map to load weather!');
            
            // Show a test message
            if (window.MsgConsole) {
                window.MsgConsole.info('Weather Dashboard ready - Click map to load weather');
            }
            
            clearInterval(checkMapInterval);
        }
    }, 100);
    
    // Timeout after 10 seconds
    setTimeout(() => {
        if (window.tmap) {
            console.log('✅ Weather integration complete');
        } else {
            console.error('❌ Map not found after 10 seconds. Weather dashboard will not work with map clicks.');
            console.log('💡 You can still use Weather.fetchWeather(lat, lng) manually');
        }
        clearInterval(checkMapInterval);
    }, 10000);
}

// ============================================================================
// AUTO-INITIALIZE
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🌤️ Initializing Weather Dashboard...');
    initializeWeatherDashboard();
});

// Auto-initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWeatherDashboard);
} else {
    initializeWeatherDashboard();
}

// ============================================================================
// GLOBAL API
// ============================================================================

// Expose global API for easy access
window.Weather = {
    show: () => {
        if (window.weatherDashboard) window.weatherDashboard.show();
    },
    
    hide: () => {
        if (window.weatherDashboard) window.weatherDashboard.hide();
    },
    
    toggle: () => {
        if (window.weatherDashboard) window.weatherDashboard.toggle();
    },
    
    refresh: () => {
        if (window.weatherDashboard) window.weatherDashboard.refresh();
    },
    
    fetchWeather: (lat, lng) => {
        if (window.weatherDashboard) window.weatherDashboard.fetchWeather(lat, lng);
    },
    
    clear: () => {
        if (window.weatherDashboard) window.weatherDashboard.clear();
    },
    
    isShown: () => {
        return window.weatherDashboard ? window.weatherDashboard.isShown() : false;
    },
    
    getLocation: () => {
        return window.weatherDashboard ? window.weatherDashboard.getCurrentLocation() : null;
    }
};

console.log('%c🌤️ Weather Dashboard Ready', 'color: #FFCC00; font-size: 14px; font-weight: bold;');
console.log('%cUsage:', 'color: #22c55e; font-weight: bold;');
console.log('%c  Weather.show() - Show dashboard', 'color: #3b82f6;');
console.log('%c  Weather.hide() - Hide dashboard', 'color: #3b82f6;');
console.log('%c  Weather.toggle() - Toggle visibility', 'color: #3b82f6;');
console.log('%c  Weather.refresh() - Refresh current weather', 'color: #3b82f6;');
console.log('%c  Weather.fetchWeather(lat, lng) - Get weather for location', 'color: #3b82f6;');
console.log('%c  Click map to load weather data', 'color: #FFCC00;');