document.addEventListener("DOMContentLoaded", () => {
  const map = L.map('map').setView([53.1, 6.0], 9);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  const markers = L.markerClusterGroup();
  // Dummy data voor markers
  const clubs = [
    { name: "VV Oerterp", lat: 53.09, lon: 6.12, leden: 350, vrijwilligers: 40 },
    { name: "SC Heerenveen", lat: 52.959, lon: 5.918, leden: 1200, vrijwilligers: 200 }
  ];

  clubs.forEach(c => {
    const marker = L.marker([c.lat, c.lon]);
    marker.bindPopup(`<b>${c.name}</b><br>Leden: ${c.leden}<br>Vrijwilligers: ${c.vrijwilligers}`);
    markers.addLayer(marker);
  });

  map.addLayer(markers);
});
