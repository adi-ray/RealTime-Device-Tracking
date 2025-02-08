const socket = io();

// Check for geolocation support. Use watchPosition to track the user's location continuously.
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

// Initialize the map centered at (0, 0) with zoom level of 16
const map = L.map("map").setView([0, 0], 16);

// Add OpenStreetMap tile layer to the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; Aditya Ray",
}).addTo(map);

// Create an empty object markers for storing user ID
const markers = {};
const waypoints = [];
let routingControl = null;
let lastUpdateTime = 0;

// Receive location data via the socket
socket.on("receive-location", (data) => {
  const now = Date.now();
  if (now - lastUpdateTime < 3000) return; // Only update every 3 seconds
  lastUpdateTime = now;

  const { id, latitude, longitude } = data;

  if (markers[id]) {
    // Update the marker's position
    markers[id].setLatLng([latitude, longitude]);
  } else {
    // Create a new marker
    markers[id] = L.marker([latitude, longitude]).addTo(map);

    // Adjustes map view
    if (Object.keys(markers).length === 1) {
      map.setView([latitude, longitude], 16);
    } else {
      map.fitBounds(Object.values(markers).map((marker) => marker.getLatLng()));
    }
  }

  if (Object.keys(markers).length === 2) {
    showRoute();
  }
});

// Remove markers when a user disconnects
socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];

    if (Object.keys(markers).length < 2 && routingControl) {
      map.removeControl(routingControl);
      routingControl = null;
    }
  }
});

function showRoute() {
  const markerKeys = Object.keys(markers);
  if (markerKeys.length < 2) return;

  const startMarker = markers[markerKeys[0]].getLatLng();
  const endMarker = markers[markerKeys[1]].getLatLng();

  if (routingControl) {
    map.removeControl(routingControl);
  }

  routingControl = L.Routing.control({
    waypoints: [
      L.latLng(startMarker.lat, startMarker.lng),
      L.latLng(endMarker.lat, endMarker.lng),
    ],
    createMarker: () => null,
    routeWhileDragging: false,
  }).addTo(map);
}
