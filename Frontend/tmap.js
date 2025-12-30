/**
 * TMap - Pure Map Library
 * Contains ONLY map-related operations
 */

class TMap {
    constructor(containerId, centerCoords, zoomLevel, useOffline = false) {
        // Initialize Leaflet map with minZoom and maxBounds to prevent zooming/panning too far
        this.map = L.map(containerId, {
            minZoom: 2,  // Won't zoom out beyond this level
            maxBounds: [[-90, -180], [90, 180]],  // Prevent panning beyond world boundaries
            maxBoundsViscosity: 1.0  // Makes bounds "solid" - can't drag beyond
        }).setView(centerCoords, zoomLevel);
        
        // Initialize layers
        this.markerLayer = L.layerGroup().addTo(this.map);
        this.routeLayer = L.layerGroup().addTo(this.map);
        
        // Store markers
        this.markers = [];
        
        // Click handler control
        this.clickEnabled = false;
        this.clickCallback = null;
        
        // Load tiles
        this.loadTiles(useOffline);
    }

    // ========================================================================
    // TILE OPERATIONS - Load map tiles
    // ========================================================================
    
    loadTiles(useOffline) {
        if (useOffline) {
            L.tileLayer('tiles/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: 'Offline Map Data'
            }).addTo(this.map);
        } else {
            const GoogleSatellite = L.TileLayer.extend({
                getTileUrl: function (coords) {
                    const x = coords.x;
                    const y = coords.y;
                    const z = this._getZoomForUrl();
                    
                    if (z > 22) return '';
                    
                    const server = (x + y) % 4;
                    return `https://mt${server}.google.com/vt/lyrs=s&x=${x}&y=${y}&z=${z}`;
                }
            });

            new GoogleSatellite('', {
                maxZoom: 22,
                attribution: '© Google'
            }).addTo(this.map);
        }
    }

    // ========================================================================
    // MARKER OPERATIONS - Add, remove, get markers
    // ========================================================================
    
    addMarker(lat, lng, draggable = true, options = {}) {
        const markerOptions = { 
            draggable,
            ...options
        };
        
        const marker = L.marker([lat, lng], markerOptions)
            .addTo(this.markerLayer);

        this.markers.push(marker);
        return marker;
    }

    removeMarker(marker) {
        const index = this.markers.indexOf(marker);
        if (index > -1) {
            this.markerLayer.removeLayer(marker);
            this.markers.splice(index, 1);
        }
    }

    removeLastMarker() {
        if (this.markers.length > 0) {
            const lastMarker = this.markers[this.markers.length - 1];
            this.removeMarker(lastMarker);
        }
    }

    removeMarkerAt(index) {
        if (index >= 0 && index < this.markers.length) {
            const marker = this.markers[index];
            this.removeMarker(marker);
        }
    }

    clearMarkers() {
        this.markerLayer.clearLayers();
        this.markers = [];
    }

    getMarkers() {
        return this.markers;
    }

    getMarkerCoordinates() {
        return this.markers.map(marker => {
            const pos = marker.getLatLng();
            return { lat: pos.lat, lng: pos.lng };
        });
    }

    getMarkerCount() {
        return this.markers.length;
    }

    // ========================================================================
    // ROUTE OPERATIONS - Draw and clear routes
    // ========================================================================
    
    drawRoute(coordinates, options = {}) {
        this.clearRoute();

        if (coordinates.length < 2) return null;

        const style = {
            color: options.color || '#FF0000',
            weight: options.weight || 3,
            opacity: options.opacity || 0.7
        };

        const latLngs = coordinates.map(coord => [coord.lat, coord.lng]);
        const route = L.polyline(latLngs, style).addTo(this.routeLayer);
        
        return route;
    }

    clearRoute() {
        this.routeLayer.clearLayers();
    }

    // ========================================================================
    // DISTANCE CALCULATION - Calculate distance between points
    // ========================================================================
    
    calculateDistance(coordinates) {
        if (coordinates.length < 2) return 0;

        let totalDistance = 0;
        for (let i = 0; i < coordinates.length - 1; i++) {
            const point1 = L.latLng(coordinates[i].lat, coordinates[i].lng);
            const point2 = L.latLng(coordinates[i + 1].lat, coordinates[i + 1].lng);
            totalDistance += point1.distanceTo(point2);
        }

        return totalDistance;
    }

    // ========================================================================
    // MAP NAVIGATION - Pan, zoom, get position
    // ========================================================================
    
    setCenter(lat, lng, zoom = null) {
        if (zoom !== null) {
            this.map.setView([lat, lng], zoom);
        } else {
            this.map.panTo([lat, lng]);
        }
    }

    getCenter() {
        return this.map.getCenter();
    }

    setZoom(zoom) {
        this.map.setZoom(zoom);
    }

    getZoom() {
        return this.map.getZoom();
    }

    getBounds() {
        return this.map.getBounds();
    }

    fitBounds(bounds) {
        this.map.fitBounds(bounds);
    }

    // ========================================================================
    // EVENT HANDLING - Map and marker events
    // ========================================================================
    
    onClick(callback) {
        this.clickCallback = callback;
        this.map.on('click', (e) => {
            if (this.clickEnabled && this.clickCallback) {
                this.clickCallback(e.latlng.lat, e.latlng.lng, e);
            }
        });
    }

    enableClick() {
        this.clickEnabled = true;
    }

    disableClick() {
        this.clickEnabled = false;
    }

    removeClickHandler() {
        this.clickEnabled = false;
        this.clickCallback = null;
        this.map.off('click');
    }

    onRightClick(callback) {
        this.map.on('contextmenu', (e) => {
            callback(e.latlng.lat, e.latlng.lng, e);
        });
    }

    onMarkerDrag(marker, callback) {
        marker.on('drag', () => {
            const pos = marker.getLatLng();
            callback(pos.lat, pos.lng);
        });
    }

    onMarkerDragEnd(marker, callback) {
        marker.on('dragend', () => {
            const pos = marker.getLatLng();
            callback(pos.lat, pos.lng);
        });
    }

    onMarkerClick(marker, callback) {
        marker.on('click', (e) => {
            e.originalEvent.stopPropagation(); // Prevent map click event
            const pos = marker.getLatLng();
            callback(pos.lat, pos.lng, marker);
        });
    }

    onMarkerRightClick(marker, callback) {
        marker.on('contextmenu', (e) => {
            e.originalEvent.stopPropagation(); // Prevent map click event
            const pos = marker.getLatLng();
            callback(pos.lat, pos.lng, marker);
        });
    }

    onZoomChange(callback) {
        this.map.on('zoom', () => {
            callback(this.getZoom());
        });
    }

    onMoveEnd(callback) {
        this.map.on('moveend', () => {
            const center = this.getCenter();
            callback(center.lat, center.lng);
        });
    }

    // ========================================================================
    // UTILITY METHODS - Helper functions for common patterns
    // ========================================================================
    
    /**
     * Enable click-to-remove functionality for markers
     * When a marker is clicked, it will be removed from the map
     */
    enableMarkerRemovalOnClick() {
        this.markers.forEach(marker => {
            this.onMarkerClick(marker, (lat, lng, m) => {
                this.removeMarker(m);
            });
        });
    }

    /**
     * Add a marker that can be removed by clicking on it
     */
    addRemovableMarker(lat, lng, draggable = true, options = {}) {
        const marker = this.addMarker(lat, lng, draggable, options);
        this.onMarkerClick(marker, (lat, lng, m) => {
            this.removeMarker(m);
        });
        return marker;
    }
}
