// Global variables
let map;
let heatmapLayer;
let cctvLayerGroup;
let currentMarker;
let existingCCTVs = [];
let incidentLayerGroup;

// Initialize main map (dashboard)
function initMainMap() {
    try {
        console.log('🗺️ Initializing main dashboard map...');

        if (!document.getElementById('map')) {
            console.error('❌ Map element not found');
            return;
        }

        // Create map centered on Jakarta
        map = L.map('map', {
            center: [-6.2088, 106.8456],
            zoom: 13,
            zoomControl: true,
            scrollWheelZoom: true
        });

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);

        // Initialize CCTV layer group
        cctvLayerGroup = L.layerGroup().addTo(map);
        incidentLayerGroup = L.layerGroup().addTo(map);

        console.log('✅ Base map created successfully');

        // Load data
        loadIncidentMarkers();
        loadCCTVMarkers();

    } catch (error) {
        console.error('❌ Error initializing main map:', error);
    }
}

function toggleIncidentMarkers() {
    if (incidentLayerGroup) {
        if (map.hasLayer(incidentLayerGroup)) {
            map.removeLayer(incidentLayerGroup);
            console.log('🚨 Incident markers hidden');
            return false;
        } else {
            map.addLayer(incidentLayerGroup);
            console.log('🚨 Incident markers shown');
            return true;
        }
    }
    return false;
}


// Initialize incident form map
function initIncidentMap() {
    try {
        console.log('🚨 Initializing incident form map...');

        if (!document.getElementById('map')) {
            console.error('❌ Map element not found');
            return;
        }

        // Create map
        map = L.map('map', {
            center: [-6.2088, 106.8456],
            zoom: 13,
            zoomControl: true,
            scrollWheelZoom: true
        });

        // Add tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);

        // Add click event for location selection
        map.on('click', function (e) {
            selectIncidentLocation(e.latlng.lat, e.latlng.lng);
        });

        console.log('✅ Incident map ready - click to select location');

    } catch (error) {
        console.error('❌ Error initializing incident map:', error);
    }
}

// Initialize CCTV form map
function initCCTVMap() {
    try {
        console.log('📹 Initializing CCTV form map...');

        if (!document.getElementById('map')) {
            console.error('❌ Map element not found');
            return;
        }

        // Create map
        map = L.map('map', {
            center: [-6.2088, 106.8456],
            zoom: 13,
            zoomControl: true,
            scrollWheelZoom: true
        });

        // Add tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);

        // Load existing CCTVs first
        loadExistingCCTVsForForm();

        // Add click event for location selection
        map.on('click', function (e) {
            selectCCTVLocation(e.latlng.lat, e.latlng.lng);
        });

        console.log('✅ CCTV map ready - click to select location');

    } catch (error) {
        console.error('❌ Error initializing CCTV map:', error);
    }
}

// Select location for incident
function selectIncidentLocation(lat, lng) {
    try {
        console.log(`📍 Selecting incident location: ${lat}, ${lng}`);

        // Remove existing marker
        if (currentMarker) {
            map.removeLayer(currentMarker);
        }

        // Create red marker for incident
        currentMarker = L.marker([lat, lng], {
            icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        }).addTo(map);

        // Update form fields
        document.getElementById('latitude').value = lat.toFixed(6);
        document.getElementById('longitude').value = lng.toFixed(6);

        // Update coordinates display if exists
        if (typeof updateCoordinatesDisplay === 'function') {
            updateCoordinatesDisplay(lat, lng);
        }

        // Get location name
        reverseGeocode(lat, lng, 'location');

    } catch (error) {
        console.error('❌ Error selecting incident location:', error);
    }
}

// Select location for CCTV
function selectCCTVLocation(lat, lng) {
    try {
        console.log(`📹 Selecting CCTV location: ${lat}, ${lng}`);

        // Remove existing marker
        if (currentMarker) {
            map.removeLayer(currentMarker);
        }

        // Create green marker for new CCTV
        currentMarker = L.marker([lat, lng], {
            icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        }).addTo(map);

        // Update form fields
        document.getElementById('cctvLatitude').value = lat.toFixed(6);
        document.getElementById('cctvLongitude').value = lng.toFixed(6);

        // Update coordinates display if exists
        if (typeof updateCoordinatesDisplay === 'function') {
            updateCoordinatesDisplay(lat, lng);
        }

        // Get location name
        reverseGeocode(lat, lng, 'cctvLocation');

    } catch (error) {
        console.error('❌ Error selecting CCTV location:', error);
    }
}

// Reverse geocoding function
async function reverseGeocode(lat, lng, targetFieldId) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1&accept-language=id,en`
        );

        const data = await response.json();
        const targetField = document.getElementById(targetFieldId);

        if (targetField) {
            if (data && data.display_name) {
                targetField.value = data.display_name;
                console.log(`✅ Location found: ${data.display_name}`);
            } else {
                targetField.value = `Koordinat: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                console.log('⚠️ No address found, using coordinates');
            }
        }

    } catch (error) {
        console.error('❌ Geocoding error:', error);
        const targetField = document.getElementById(targetFieldId);
        if (targetField) {
            targetField.value = `Koordinat: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }
    }
}

// Load heatmap data
async function loadIncidentMarkers() {
    try {
        console.log('🚨 Loading incident markers...');

        const response = await fetch('/api/reports'); // <-- endpoint ke backend Flask kamu
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const reports = await response.json(); // <--- pakai nama "reports" karena sesuai konteksmu
        console.log(`📊 Received ${reports.length} incident markers`);

        // Clear existing markers
        if (incidentLayerGroup) {
            incidentLayerGroup.clearLayers();
        }

        if (reports && reports.length > 0) {
            // Define red icon for incidents
            const incidentIcon = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            // Add markers
            reports.forEach(report => {
                const marker = L.marker([report.latitude, report.longitude], {
                    icon: incidentIcon
                });

                const popupContent = `
                    <div class="incident-popup">
                        <h3>🚨 ${report.jenisKejadian}</h3>
                        <p><strong>📍 Lokasi:</strong><br>${report.lokasiKejadian}</p>
                        <p><strong>🕒 Waktu:</strong> ${report.waktuKejadian || 'Tidak tersedia'}</p>
                        ${report.deskripsiKejadian ? `<p><strong>📝 Keterangan:</strong><br>${report.deskripsiKejadian}</p>` : ''}
                    </div>
                `;

                marker.bindPopup(popupContent, {
                    maxWidth: 300,
                    className: 'custom-popup'
                });

                incidentLayerGroup.addLayer(marker);
            });

            console.log('✅ Incident markers loaded');
        } else {
            console.log('ℹ️ No incident data available');
        }
    } catch (error) {
        console.error('❌ Error loading incident markers:', error);
    }
}



// Load CCTV markers for dashboard
async function loadCCTVMarkers() {
    try {
        console.log('📹 Loading CCTV markers...');

        const response = await fetch('http://localhost:3001/api/cctv');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const cctvs = await response.json();
        console.log(`📊 Received ${cctvs.length} CCTV markers`);

        // Clear existing markers
        if (cctvLayerGroup) {
            cctvLayerGroup.clearLayers();
        }

        if (cctvs && cctvs.length > 0) {
            cctvs.forEach(cctv => {
                // Create CCTV icon
                const cctvIcon = L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });

                // Create marker
                const marker = L.marker([cctv.latitude, cctv.longitude], {
                    icon: cctvIcon
                });

                // Create popup content
                const popupContent = `
                    <div class="cctv-popup">
                        <h3>📹 ${cctv.name}</h3>
                        <p><strong>📍 Lokasi:</strong><br>${cctv.location_name}</p>
                        <p><strong>🔧 Status:</strong> <span class="status-${cctv.status}">${cctv.status.toUpperCase()}</span></p>
                        <p><strong>📅 Ditambahkan:</strong> ${new Date(cctv.created_at).toLocaleDateString('id-ID')}</p>
                        ${cctv.description ? `<p><strong>📝 Keterangan:</strong><br>${cctv.description}</p>` : ''}
                    </div>
                `;

                marker.bindPopup(popupContent, {
                    maxWidth: 300,
                    className: 'custom-popup'
                });

                cctvLayerGroup.addLayer(marker);
            });

            console.log('✅ CCTV markers loaded');
        } else {
            console.log('ℹ️ No CCTV data available');
        }

    } catch (error) {
        console.error('❌ Error loading CCTV markers:', error);
    }
}

// Load existing CCTVs for form reference
async function loadExistingCCTVsForForm() {
    try {
        const response = await fetch('/api/cctvs');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const cctvs = await response.json();
        existingCCTVs = cctvs;

        // Add existing CCTVs as blue markers
        cctvs.forEach(cctv => {
            const marker = L.marker([cctv.latitude, cctv.longitude], {
                icon: L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                })
            }).addTo(map);

            marker.bindPopup(`
                <div class="cctv-popup">
                    <h3>📹 ${cctv.name}</h3>
                    <p><strong>Status:</strong> ${cctv.status}</p>
                    <p><em>CCTV yang sudah terdaftar</em></p>
                </div>
            `);
        });

        console.log(`✅ Loaded ${cctvs.length} existing CCTVs for reference`);

    } catch (error) {
        console.error('❌ Error loading existing CCTVs:', error);
    }
}

// Toggle heatmap visibility
function toggleHeatmap() {
    if (heatmapLayer) {
        if (map.hasLayer(heatmapLayer)) {
            map.removeLayer(heatmapLayer);
            console.log('🔥 Heatmap hidden');
            return false;
        } else {
            map.addLayer(heatmapLayer);
            console.log('🔥 Heatmap shown');
            return true;
        }
    }
    return false;
}

// Toggle CCTV markers visibility
function toggleCCTVMarkers() {
    if (cctvLayerGroup) {
        if (map.hasLayer(cctvLayerGroup)) {
            map.removeLayer(cctvLayerGroup);
            console.log('📹 CCTV markers hidden');
            return false;
        } else {
            map.addLayer(cctvLayerGroup);
            console.log('📹 CCTV markers shown');
            return true;
        }
    }
    return false;
}

// Refresh all map data
function refreshAllMapData() {
    console.log('🔄 Refreshing all map data...');
    if (incidentLayerGroup) loadIncidentMarkers();
    if (cctvLayerGroup) loadCCTVMarkers();
}

// Center map to Jakarta
function centerMap() {
    if (map) {
        map.setView([-6.2088, 106.8456], 13);
        console.log('🎯 Map centered to Jakarta');
    }
}

// Utility function to check if Leaflet is loaded
function checkLeafletLoaded() {
    return typeof L !== 'undefined';
}

// Auto-initialization based on page
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Crime Monitoring System - Maps Module Loaded');

    // Wait for Leaflet to load
    setTimeout(() => {
        if (!checkLeafletLoaded()) {
            console.error('❌ Leaflet library not loaded');
            return;
        }

        console.log('✅ Leaflet library ready');

        // Detect page type and initialize appropriate map
        const path = window.location.pathname;
        const mapElement = document.getElementById('map');

        if (mapElement) {
            console.log(`🗺️ Map element found on path: ${path}`);

            if (path === '/' || path === '/index' || path === '') {
                initMainMap();
            } else if (path.includes('add-incident')) {
                initIncidentMap();
            } else if (path.includes('add-cctv')) {
                initCCTVMap();
            } else {
                console.log('⚠️ Unknown page, no map initialization');
            }
        } else {
            console.log('ℹ️ No map element found on this page');
        }
    }, 500);
});

// Export functions for global access
window.toggleHeatmap = toggleHeatmap;
window.toggleCCTVMarkers = toggleCCTVMarkers;
window.refreshAllMapData = refreshAllMapData;
window.centerMap = centerMap;
window.initMainMap = initMainMap;
window.initIncidentMap = initIncidentMap;
window.initCCTVMap = initCCTVMap;

window.toggleIncidentMarkers = toggleIncidentMarkers;
// Debug info
console.log('📍 Maps.js loaded - Crime Monitoring System Ready');
