import { mockTraffic, mockSignals, mockHeatmap, mockChallans, mockRoutes } from './mock-data.js';

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {

    // Privacy Modal Logic
    const modal = document.getElementById('privacy-modal');
    document.getElementById('accept-privacy').addEventListener('click', () => {
        modal.classList.add('hidden');
        initApp();
    });

    // Clock
    setInterval(() => {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateString = now.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });
        const el = document.getElementById('live-time');
        if (el) el.innerHTML = `${timeString} <span class="text-slate-500 text-xs">| ${dateString}</span>`;
    }, 1000);
});

function initApp() {
    // 1. Initialize Leaflet Map
    // Centered on Bangalore for demo purposes as per mock data
    const map = L.map('map', {
        zoomControl: false,
        attributionControl: false
    }).setView([12.9716, 77.5946], 13);

    // Dark Matter Tiles (CartoDB) - Free & Premium looking
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CartoDB',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // 2. Layers Setup
    const trafficLayer = L.layerGroup().addTo(map);
    const signalsLayer = L.layerGroup().addTo(map);
    let heatLayer = null; // Leaflet.heat layer

    // 3. Render Functions
    function renderTraffic() {
        trafficLayer.clearLayers();
        mockTraffic.forEach(road => {
            const color = getCongestionColor(road.congestion);
            const line = L.polyline(road.geometry, {
                color: color,
                weight: 5,
                opacity: 0.8,
                smoothFactor: 1
            }).addTo(trafficLayer);

            line.bindPopup(`
                <div class="font-sans">
                    <h3 class="font-bold text-accent text-sm mb-1">${road.name}</h3>
                    <div class="text-xs space-y-1">
                        <div class="flex justify-between"><span>Status:</span> <span style="color:${color}" class="uppercase font-bold">${road.congestion}</span></div>
                        <div class="flex justify-between"><span>Speed:</span> <span>${road.speed} km/h</span></div>
                        <div class="flex justify-between"><span>Limit:</span> <span>${road.freeflow_speed} km/h</span></div>
                    </div>
                </div>
            `);
        });
    }

    function renderSignals() {
        signalsLayer.clearLayers();
        const signalIcon = L.divIcon({
            html: '<i class="fa-solid fa-traffic-light text-xl text-yellow-400 drop-shadow-lg"></i>',
            className: 'bg-transparent',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        mockSignals.forEach(sig => {
            L.marker([sig.lat, sig.lng], { icon: signalIcon })
                .addTo(signalsLayer)
                .bindPopup(`
                    <div class="font-sans">
                        <h3 class="font-bold text-white text-sm mb-1">${sig.label}</h3>
                        <div class="text-xs text-slate-300">
                            Status: <span class="${sig.status === 'working' ? 'text-green-400' : 'text-red-400'} uppercase font-bold text-[10px]">${sig.status}</span>
                            <br>ID: ${sig.id}
                        </div>
                    </div>
                `);
        });
    }

    function renderHeatmap() {
        if (heatLayer) {
            map.removeLayer(heatLayer);
        }
        // Using Leaflet.heat plugin format: [lat, lng, intensity]
        heatLayer = L.heatLayer(mockHeatmap, {
            radius: 25,
            blur: 15,
            maxZoom: 17,
            gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
        }).addTo(map);
    }

    // Helper: Traffic Colors
    function getCongestionColor(level) {
        switch (level) {
            case 'severe': return '#ef4444'; // red-500
            case 'heavy': return '#f97316'; // orange-500
            case 'moderate': return '#eab308'; // yellow-500
            case 'light': return '#22c55e'; // green-500
            default: return '#3b82f6';
        }
    }

    // Initial Render
    renderTraffic();
    renderSignals();
    renderHeatmap();

    // 4. UI Controls Logic

    // Layer Toggles
    const toggleTraffic = document.getElementById('toggle-traffic');
    const toggleSignals = document.getElementById('toggle-signals');
    const toggleHeatmap = document.getElementById('toggle-heatmap');

    toggleTraffic.addEventListener('change', (e) => {
        if (e.target.checked) map.addLayer(trafficLayer);
        else map.removeLayer(trafficLayer);
    });

    toggleSignals.addEventListener('change', (e) => {
        if (e.target.checked) map.addLayer(signalsLayer);
        else map.removeLayer(signalsLayer);
    });

    toggleHeatmap.addEventListener('change', (e) => {
        if (e.target.checked && heatLayer) map.addLayer(heatLayer);
        else if (heatLayer) map.removeLayer(heatLayer);
    });

    // Challan Lookup
    const btnChallan = document.getElementById('btn-challan');
    const inputChallan = document.getElementById('vehicle-input');
    const resultChallan = document.getElementById('challan-result');

    btnChallan.addEventListener('click', () => {
        const vNum = inputChallan.value.trim().toUpperCase();
        if (!vNum) return;

        // Simulate loading
        btnChallan.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        resultChallan.classList.add('hidden');

        setTimeout(() => {
            btnChallan.innerHTML = '<i class="fa-solid fa-search"></i>';
            const data = mockChallans[vNum];
            resultChallan.classList.remove('hidden');

            if (data && data.length > 0) {
                let html = `<div class="bg-red-500/20 border border-red-500/50 rounded p-2 text-xs">
                    <div class="font-bold text-red-400 mb-1"><i class="fa-solid fa-triangle-exclamation"></i> ${data.length} Pending Challan(s)</div>`;

                data.forEach(c => {
                    html += `
                        <div class="mt-2 pt-2 border-t border-red-500/30">
                            <div class="flex justify-between"><span>${c.date}</span> <span class="text-white font-mono">₹${c.amount}</span></div>
                            <div class="text-slate-400 mt-0.5">${c.violation}</div>
                            <a href="#" class="block text-center mt-2 bg-red-600 hover:bg-red-700 text-white py-1 rounded transition">Pay Now</a>
                        </div>
                    `;
                });
                html += `</div>`;
                resultChallan.innerHTML = html;
            } else {
                // Check if key exists in mock (to decide if "No Pending" or "Not Found" - for demo we assume all other keys are "No Pending")
                resultChallan.innerHTML = `<div class="bg-green-500/20 border border-green-500/50 rounded p-2 text-xs text-green-400 font-bold flex items-center gap-2">
                    <i class="fa-solid fa-check-circle"></i> No Pending Challans
                </div>`;
            }
        }, 800);
    });

    // Route Suggestion
    const btnRoute = document.getElementById('btn-route');
    const panelRoute = document.getElementById('route-panel');
    const resultsRoute = document.getElementById('route-results');
    const closeRoute = document.getElementById('close-route');
    let routeLayers = [];

    btnRoute.addEventListener('click', () => {
        const dest = document.getElementById('dest-input').value;
        if (!dest) return;

        // Simulate calculation
        btnRoute.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Calculating...';

        setTimeout(() => {
            btnRoute.innerHTML = 'Suggest Safe Route';
            panelRoute.classList.remove('hidden');

            // Clear old routes
            routeLayers.forEach(l => map.removeLayer(l));
            routeLayers = [];
            resultsRoute.innerHTML = '';

            mockRoutes.forEach((route, idx) => {
                // Draw line
                const poly = L.polyline(route.geometry, {
                    color: route.trafficColor === 'green' ? '#22c55e' : '#f97316',
                    weight: 6,
                    dashArray: '10, 10',
                    opacity: 0.9
                }).addTo(map);
                routeLayers.push(poly);

                // Add to list
                const div = document.createElement('div');
                div.className = `p-3 rounded border border-slate-700 hover:bg-slate-700/50 cursor-pointer transition ${idx === 1 ? 'bg-slate-800' : ''}`;
                div.innerHTML = `
                    <div class="flex justify-between items-center mb-1">
                        <span class="font-bold text-sm ${route.trafficColor === 'green' ? 'text-green-400' : 'text-orange-400'}">${route.label}</span>
                        <span class="text-xs font-mono bg-slate-900 px-1.5 py-0.5 rounded">${route.eta}</span>
                    </div>
                    <p class="text-[10px] text-slate-400">${route.msg}</p>
                `;
                div.onclick = () => {
                    map.fitBounds(poly.getBounds());
                };
                resultsRoute.appendChild(div);
            });

            // Fit bounds to first route
            if (routeLayers.length > 0) map.fitBounds(routeLayers[0].getBounds());

        }, 1200);
    });

    closeRoute.addEventListener('click', () => {
        panelRoute.classList.add('hidden');
        routeLayers.forEach(l => map.removeLayer(l)); // Optional: keep/remove routes on close
    });
}
