let rawData = [];
let filteredData = [];

// Bestand inladen
document.getElementById('fileInput').addEventListener('change', handleFile);
document.getElementById('dummyBtn').addEventListener('click', loadDummyData);
document.getElementById('resetBtn').addEventListener('click', resetFilters);

function handleFile(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function(evt) {
    const data = new Uint8Array(evt.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    rawData = XLSX.utils.sheet_to_json(sheet);
    filteredData = rawData;
    populateFilters();
    render();
  };
  reader.readAsArrayBuffer(file);
}

function loadDummyData() {
  rawData = [
    { Naam: "VV Oerterp", Vestigingsgemeente: "Opsterland", Soort: "Voetbal", Doelgroep: "Jeugd", "Aantal leden": 150 },
    { Naam: "SC Gorredijk", Vestigingsgemeente: "Opsterland", Soort: "Korfbal", Doelgroep: "Volwassenen", "Aantal leden": 120 },
    { Naam: "VV Drachten", Vestigingsgemeente: "Smallingerland", Soort: "Voetbal", Doelgroep: "Senioren", "Aantal leden": 200 }
  ];
  filteredData = rawData;
  populateFilters();
  render();
}

function populateFilters() {
  const gemeenteFilter = document.getElementById('gemeenteFilter');
  const sportFilter = document.getElementById('sportFilter');
  const doelgroepFilter = document.getElementById('doelgroepFilter');

  let gemeentes = [...new Set(rawData.map(d => d.Vestigingsgemeente))];
  let sporten = [...new Set(rawData.map(d => d.Soort))];
  let doelgroepen = [...new Set(rawData.map(d => d.Doelgroep))];

  gemeenteFilter.innerHTML = '<option value="">Gemeente</option>' + gemeentes.map(g => `<option value="${g}">${g}</option>`).join("");
  sportFilter.innerHTML = '<option value="">Sport</option>' + sporten.map(s => `<option value="${s}">${s}</option>`).join("");
  doelgroepFilter.innerHTML = '<option value="">Doelgroep</option>' + doelgroepen.map(d => `<option value="${d}">${d}</option>`).join("");

  gemeenteFilter.onchange = filterData;
  sportFilter.onchange = filterData;
  doelgroepFilter.onchange = filterData;
  document.getElementById('profitFilter').onchange = filterData;
}

function filterData() {
  const gVal = document.getElementById('gemeenteFilter').value;
  const sVal = document.getElementById('sportFilter').value;
  const dVal = document.getElementById('doelgroepFilter').value;
  const pVal = document.getElementById('profitFilter').value;

  filteredData = rawData.filter(club =>
    (gVal === "" || club.Vestigingsgemeente === gVal) &&
    (sVal === "" || club.Soort === sVal) &&
    (dVal === "" || club.Doelgroep === dVal) &&
    (pVal === "" || club["Soort Organisatie"] === pVal)
  );
  render();
}

function resetFilters() {
  document.getElementById('gemeenteFilter').value = "";
  document.getElementById('sportFilter').value = "";
  document.getElementById('doelgroepFilter').value = "";
  document.getElementById('profitFilter').value = "";
  filteredData = rawData;
  render();
}

function render() {
  document.getElementById('clubsCount').innerText = filteredData.length;
  document.getElementById('gemeenteCount').innerText = new Set(filteredData.map(d => d.Vestigingsgemeente)).size;
  document.getElementById('sportCount').innerText = new Set(filteredData.map(d => d.Soort)).size;
  document.getElementById('ledenCount').innerText = filteredData.reduce((a, b) => a + (b["Aantal leden"] || 0), 0);

  const clubList = document.getElementById('clubList');
  clubList.innerHTML = "";
  filteredData.forEach(club => {
    const li = document.createElement('li');
    li.innerText = club.Naam + " (" + club.Vestigingsgemeente + ")";
    li.onclick = () => showPopup(club);
    clubList.appendChild(li);
  });
}

function showPopup(club) {
  const popup = document.getElementById('popup');
  const details = document.getElementById('popupDetails');
  details.innerHTML = Object.entries(club).map(([k,v]) => `<p><b>${k}:</b> ${v}</p>`).join("");
  popup.style.display = 'block';
}

document.getElementById('closePopup').onclick = () => {
  document.getElementById('popup').style.display = 'none';
}
