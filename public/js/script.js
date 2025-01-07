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
  attribution: "&copy Aditya Ray",
}).addTo(map);

// Create an empty object markers for storing user ID
const markers = {};

// Receive location data via the socket
socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude]);

  if (markers[id]) {
    // Update the marker's position
    markers[id].setLatLng([latitude, longitude]);
  } else {
    // Create a new marker
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

// Remove markers when a user disconnects
socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
