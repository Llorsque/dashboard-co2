let clubs = [];

// Upload en laad
document.getElementById('load-btn').addEventListener('click', () => {
  const fileInput = document.getElementById('file-input');
  if (!fileInput.files.length) {
    alert('Upload eerst een Excel bestand');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);
    clubs = sheetData;
    initFilters();
    renderAll(clubs);
  };
  reader.readAsArrayBuffer(fileInput.files[0]);
});

// Filters dynamisch vullen
function initFilters() {
  fillCheckboxes("filter-gemeente", [...new Set(clubs.map(c => c["Vestigingsgemeente"]))]);
  fillCheckboxes("filter-sport", [...new Set(clubs.map(c => c["Subsoort organisatie"]))]);
  fillCheckboxes("filter-doelgroep", ["0-4 jaar","4-12 jaar","Jongeren","Volwassenen","Senioren","Aangepast sporten"]);
  fillCheckboxes("filter-soort", [...new Set(clubs.map(c => c["Soort Organisatie"]))]);
}

function fillCheckboxes(containerId, items) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  items.forEach(item => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = item;
    input.addEventListener("change", applyFilters);
    label.appendChild(input);
    label.append(" " + item);
    container.appendChild(label);
    container.appendChild(document.createElement("br"));
  });
}

// Filters toepassen
function applyFilters() {
  let filtered = [...clubs];

  // Gemeente
  const gemeenteSel = [...document.querySelectorAll("#filter-gemeente input:checked")].map(c => c.value);
  if (gemeenteSel.length) filtered = filtered.filter(c => gemeenteSel.includes(c["Vestigingsgemeente"]));

  // Sport
  const sportSel = [...document.querySelectorAll("#filter-sport input:checked")].map(c => c.value);
  if (sportSel.length) filtered = filtered.filter(c => sportSel.includes(c["Subsoort organisatie"]));

  // Soort organisatie
  const soortSel = [...document.querySelectorAll("#filter-soort input:checked")].map(c => c.value);
  if (soortSel.length) filtered = filtered.filter(c => soortSel.includes(c["Soort Organisatie"]));

  renderAll(filtered);
}

// Render tiles + lijst
function renderAll(data) {
  renderTiles(data);
  renderList(data);
}

// Tiles renderen
function renderTiles(data) {
  const grid = document.getElementById("tile-grid");
  grid.innerHTML = "";

  if (data.length === 0) return;

  const totalClubs = data.length;
  const rookvrij = data.filter(c => c["Rookvrij"] == 1).length;
  const accommodatie = data.filter(c => c["Eigen accommodatie"] == 1).length;

  const tiles = [
    { label: "Totaal clubs", value: totalClubs, percent: 100 },
    { label: "Rookvrij", value: rookvrij, percent: (rookvrij/totalClubs*100) },
    { label: "Eigen accommodatie", value: accommodatie, percent: (accommodatie/totalClubs*100) }
  ];

  tiles.forEach(t => {
    const div = document.createElement("div");
    div.className = "tile";
    div.innerHTML = `<h3>${t.value}</h3><p>${t.label}</p><p>${t.percent.toFixed(0)}%</p>`;
    grid.appendChild(div);
  });
}

// Lijst renderen
function renderList(data) {
  const list = document.getElementById("club-list");
  list.innerHTML = "";
  data.forEach(club => {
    const li = document.createElement("li");
    li.textContent = `${club.Naam} (${club["Vestigingsgemeente"]})`;
    li.onclick = () => showClubDetails(club);
    list.appendChild(li);
  });
}

// Popup
function showClubDetails(club) {
  const modal = document.getElementById("club-modal");
  const details = document.getElementById("club-details");
  details.innerHTML = Object.entries(club)
    .map(([k, v]) => `<p><strong>${k}:</strong> ${v == 1 ? "✔ Ja" : v == 0 ? "✖ Nee" : v}</p>`)
    .join("");
  modal.style.display = "block";
}

document.querySelector(".close").onclick = () => {
  document.getElementById("club-modal").style.display = "none";
};

window.onclick = function(event) {
  const modal = document.getElementById("club-modal");
  if (event.target === modal) modal.style.display = "none";
};