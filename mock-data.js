
// mock-data.js

export const mockTraffic = [
    {
        id: "r1",
        geometry: [
            [12.9716, 77.5946],
            [12.9780, 77.6000],
            [12.9800, 77.6100]
        ],
        speed: 15,
        freeflow_speed: 40,
        congestion: "heavy", // light, moderate, heavy, severe
        name: "MG Road Central"
    },
    {
        id: "r2",
        geometry: [
            [12.9716, 77.5946],
            [12.9600, 77.5900],
            [12.9500, 77.5800]
        ],
        speed: 35,
        freeflow_speed: 40,
        congestion: "light",
        name: "Lalbagh Main Rd"
    },
    {
        id: "r3",
        geometry: [
            [12.9800, 77.6100],
            [12.9900, 77.6200]
        ],
        speed: 25,
        freeflow_speed: 50,
        congestion: "moderate",
        name: "Indiranagar 100ft Rd"
    }
];

export const mockSignals = [
    { id: "s1", lat: 12.9716, lng: 77.5946, status: "working", label: "Corporation Circle" },
    { id: "s2", lat: 12.9780, lng: 77.6000, status: "maintenance", label: "Mayo Hall" },
    { id: "s3", lat: 12.9600, lng: 77.5900, status: "working", label: "Lalbagh West Gate" }
];

// Generate some random heatmap points around Bangalore center
const centerLat = 12.9716;
const centerLng = 77.5946;
export const mockHeatmap = [];
for (let i = 0; i < 500; i++) {
    mockHeatmap.push([
        centerLat + (Math.random() - 0.5) * 0.05,
        centerLng + (Math.random() - 0.5) * 0.05,
        Math.random() // intensity
    ]);
}

export const mockChallans = {
    "KA01AB1234": [
        { id: "CH-2025-001", date: "2025-11-20", amount: 1000, violation: "Speeding > 20kmph", status: "Unpaid" },
        { id: "CH-2025-099", date: "2025-10-15", amount: 500, violation: "No Parking", status: "Unpaid" }
    ],
    "DL02CD5678": [
        { id: "CH-2025-555", date: "2025-12-01", amount: 2000, violation: "Signal Jump", status: "Unpaid" }
    ],
    "MH12EF9012": [] // Clear
};

export const mockRoutes = [
    {
        id: "routeA",
        label: "Fastest (Crowded)",
        eta: "24 mins",
        trafficColor: "orange",
        geometry: [
            [12.9716, 77.5946],
            [12.9750, 77.6050],
            [12.9800, 77.6100] // Destination
        ],
        msg: "High congestion near MG Road."
    },
    {
        id: "routeB",
        label: "Alternative (Clear)",
        eta: "32 mins",
        trafficColor: "green",
        geometry: [
            [12.9716, 77.5946],
            [12.9650, 77.5900],
            [12.9700, 77.6200],
            [12.9800, 77.6100] // Dest
        ],
        msg: "Longer route but free flow."
    }
];
