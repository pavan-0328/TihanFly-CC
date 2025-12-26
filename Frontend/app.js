/**
 * Application Logic
 * Contains ALL non-map functions: formatting, validation, business logic
 */

// ============================================================================
// UTILITY FUNCTIONS - Helper functions for the application
// ============================================================================

const Utils = {
    // Format distance from meters to readable string
    formatDistance(distanceInMeters) {
        if (distanceInMeters < 1000) {
            return `${distanceInMeters.toFixed(0)} m`;
        }
        return `${(distanceInMeters / 1000).toFixed(2)} km`;
    },

    // Format coordinates to fixed decimal places
    formatCoordinate(coord, decimals = 6) {
        return parseFloat(coord).toFixed(decimals);
    },

    // Validate latitude value
    isValidLatitude(lat) {
        return !isNaN(lat) && lat >= -90 && lat <= 90;
    },

    // Validate longitude value
    isValidLongitude(lng) {
        return !isNaN(lng) && lng >= -180 && lng <= 180;
    },

    // Validate both coordinates
    validateCoordinates(lat, lng) {
        return this.isValidLatitude(lat) && this.isValidLongitude(lng);
    },

    // Parse input to float safely
    parseCoordinate(value) {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? null : parsed;
    },

    // Show console message with icon
    logMessage(message, type = 'info') {
        const icons = {
            success: '✓',
            error: '✗',
            info: 'ℹ',
            warning: '⚠'
        };
        console.log(`${icons[type] || icons.info} ${message}`);
    }
};

// ============================================================================
// MAP APPLICATION - Main application logic
// ============================================================================

class MapApplication {
    constructor() {
        this.config = {
            useOffline: false,
            defaultCenter: [28.6139, 77.2090],
            defaultZoom: 13,
            routeColor: '#FF0000'
        };

        this.map = null;
        this.ui = null;
        this.compass = null;
        this.currentHeading = 0;
        this.currentSpeed = 0;
        this.satellites = 12; // Simulated satellite count
    }

    initialize() {
        // Create map instance
        this.map = new TMap(
            'map',
            this.config.defaultCenter,
            this.config.defaultZoom,
            this.config.useOffline
        );

        // Setup map behavior
        this.setupMapBehavior();

        // Create UI controller
        this.ui = new UIController(this.map, this);

        // Initialize enhanced compass with telemetry
        this.compass = new CompassEnhanced('map');
        
        // Initialize telemetry with default values
        this.updateTelemetryDisplay();
        
        // Start compass rotation simulation (optional - remove in production)
        // Uncomment the line below to see the compass rotate automatically
        // this.compass.startRotation(2);
        
        // Listen to map rotation/bearing changes if needed
        this.setupCompassBehavior();
        
        // Update telemetry periodically
        this.startTelemetryUpdates();
    }

    setupMapBehavior() {
        // Handle map clicks to add markers
        this.map.onClick((lat, lng) => {
            this.addMarkerWithEvents(lat, lng);
        });
    }

    setupCompassBehavior() {
        // Update compass when map moves
        this.map.onMoveEnd((lat, lng) => {
            this.updateCompassHeading();
            this.updateTelemetryDisplay();
        });
    }

    startTelemetryUpdates() {
        // Update telemetry display every second
        setInterval(() => {
            this.updateTelemetryDisplay();
            // Simulate speed changes (for demo purposes)
            this.currentSpeed = Math.random() * 5;
        }, 1000);
    }

    updateTelemetryDisplay() {
        const center = this.map.getCenter();
        const coords = this.map.getMarkerCoordinates();
        const distance = this.map.calculateDistance(coords);
        
        // Update compass telemetry
        if (this.compass) {
            this.compass.updateTelemetry({
                latitude: center.lat,
                longitude: center.lng,
                altitude: 0, // Can be set from external data
                speed: this.currentSpeed,
                distance: distance,
                satellites: this.satellites
            });
        }
    }

    updateCompassHeading() {
        const coords = this.map.getMarkerCoordinates();
        
        // Calculate heading from first two markers (if they exist)
        if (coords.length >= 2) {
            const heading = this.calculateBearing(
                coords[0].lat, coords[0].lng,
                coords[1].lat, coords[1].lng
            );
            this.setHeading(heading);
        }
    }

    calculateBearing(lat1, lng1, lat2, lng2) {
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const lat1Rad = lat1 * Math.PI / 180;
        const lat2Rad = lat2 * Math.PI / 180;
        
        const y = Math.sin(dLng) * Math.cos(lat2Rad);
        const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
                  Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
        
        let bearing = Math.atan2(y, x) * 180 / Math.PI;
        bearing = (bearing + 360) % 360;
        
        return bearing;
    }

    setHeading(degrees) {
        this.currentHeading = degrees;
        if (this.compass) {
            this.compass.setHeading(degrees);
        }
        Utils.logMessage(`Heading updated: ${degrees.toFixed(1)}°`, 'info');
    }

    addMarkerWithEvents(lat, lng) {
        const marker = this.map.addMarker(lat, lng);
        
        // Setup marker drag to update route
        this.map.onMarkerDrag(marker, () => {
            this.updateRoute();
            this.updateCompassHeading();
            this.updateTelemetryDisplay();
        });

        // Log when marker drag ends
        this.map.onMarkerDragEnd(marker, (lat, lng) => {
            Utils.logMessage(
                `Marker moved to [${Utils.formatCoordinate(lat)}, ${Utils.formatCoordinate(lng)}]`,
                'info'
            );
            this.updateTelemetryDisplay();
        });

        // Update route and compass after adding marker
        this.updateRoute();
        this.updateCompassHeading();
        this.updateTelemetryDisplay();
    }

    updateRoute() {
        const coords = this.map.getMarkerCoordinates();
        this.map.drawRoute(coords, { color: this.config.routeColor });
    }

    getMarkerInfo() {
        const coords = this.map.getMarkerCoordinates();
        const count = this.map.getMarkerCount();
        const distance = this.map.calculateDistance(coords);
        
        return {
            count: count,
            coordinates: coords,
            distance: distance,
            formattedDistance: Utils.formatDistance(distance),
            heading: this.currentHeading,
            speed: this.currentSpeed,
            satellites: this.satellites
        };
    }

    clearAll() {
        this.map.clearMarkers();
        this.map.clearRoute();
        if (this.compass) {
            this.compass.setHeading(0);
        }
        this.currentHeading = 0;
        this.updateTelemetryDisplay();
    }

    navigateTo(lat, lng) {
        this.map.setCenter(lat, lng);
        this.updateTelemetryDisplay();
    }
}

// ============================================================================
// UI CONTROLLER - Handles user interface interactions
// ============================================================================

class UIController {
    constructor(map, app) {
        this.map = map;
        this.app = app;
        this.elements = this.getDOMElements();
        this.attachEventListeners();
    }

    getDOMElements() {
        return {
            addMarkerBtn: document.getElementById('addMarkerBtn'),
            clearMarkersBtn: document.getElementById('clearMarkersBtn'),
            getMarkersBtn: document.getElementById('getMarkersBtn'),
            goToBtn: document.getElementById('goToBtn'),
            latInput: document.getElementById('lat'),
            lngInput: document.getElementById('lng')
        };
    }

    attachEventListeners() {
        const { addMarkerBtn, clearMarkersBtn, getMarkersBtn, goToBtn, latInput, lngInput } = this.elements;

        if (addMarkerBtn) {
            addMarkerBtn.addEventListener('click', () => this.handleAddMarker());
        }

        if (clearMarkersBtn) {
            clearMarkersBtn.addEventListener('click', () => this.handleClearMarkers());
        }

        if (getMarkersBtn) {
            getMarkersBtn.addEventListener('click', () => this.handleGetInfo());
        }

        if (goToBtn) {
            goToBtn.addEventListener('click', () => this.handleNavigate());
        }

        // Enable Enter key for navigation
        if (latInput && lngInput) {
            [latInput, lngInput].forEach(input => {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.handleNavigate();
                });
            });
        }
    }

    handleAddMarker() {
        const center = this.map.getCenter();
        this.app.addMarkerWithEvents(center.lat, center.lng);
        
        Utils.logMessage(
            `Marker added at [${Utils.formatCoordinate(center.lat)}, ${Utils.formatCoordinate(center.lng)}]`,
            'success'
        );
    }

    handleClearMarkers() {
        this.app.clearAll();
        Utils.logMessage('All markers cleared', 'success');
    }

    handleGetInfo() {
        const info = this.app.getMarkerInfo();
        
        if (info.count === 0) {
            Utils.logMessage('No markers on map', 'info');
            return;
        }

        // Log detailed information
        console.log('═══════════════════════════════════════');
        console.log('WAYPOINT INFORMATION');
        console.log('═══════════════════════════════════════');
        console.log(`Total Markers: ${info.count}`);
        console.log(`Route Distance: ${info.formattedDistance}`);
        console.log(`Current Heading: ${info.heading.toFixed(1)}°`);
        console.log(`Current Speed: ${info.speed.toFixed(1)} m/s`);
        console.log(`Satellites: ${info.satellites}`);
        console.log('───────────────────────────────────────');
        console.log('Coordinates:');
        info.coordinates.forEach((coord, index) => {
            console.log(`  ${index + 1}. [${Utils.formatCoordinate(coord.lat)}, ${Utils.formatCoordinate(coord.lng)}]`);
        });
        console.log('═══════════════════════════════════════');
        
        Utils.logMessage(
            `${info.count} markers | Distance: ${info.formattedDistance} | Heading: ${info.heading.toFixed(1)}°`,
            'success'
        );
    }

    handleNavigate() {
        const { latInput, lngInput } = this.elements;
        
        const lat = Utils.parseCoordinate(latInput.value);
        const lng = Utils.parseCoordinate(lngInput.value);

        if (lat === null || lng === null) {
            this.showError('Please enter numeric values for coordinates');
            return;
        }

        if (!Utils.validateCoordinates(lat, lng)) {
            this.showError('Invalid coordinates! Lat: -90 to 90, Lng: -180 to 180');
            return;
        }

        this.app.navigateTo(lat, lng);
        Utils.logMessage(
            `Navigated to [${Utils.formatCoordinate(lat)}, ${Utils.formatCoordinate(lng)}]`,
            'success'
        );
    }

    showError(message) {
        Utils.logMessage(message, 'error');
        alert(message);
    }
}

// ============================================================================
// INITIALIZE APPLICATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    const app = new MapApplication();
    app.initialize();
});
