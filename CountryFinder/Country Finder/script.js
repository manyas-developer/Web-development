const form = document.getElementById("countryForm");
const input = document.getElementById("countryInput");
const statusBox = document.getElementById("status");
const resultCard = document.getElementById("resultCard");
const errorCard = document.getElementById("errorCard");

// result fields
const flagImg = document.getElementById("flagImg");
const coatImg = document.getElementById("coatImg");
const nameCommon = document.getElementById("nameCommon");
const nameOfficial = document.getElementById("nameOfficial");
const cca2 = document.getElementById("cca2");
const cca3 = document.getElementById("cca3");
const regionChip = document.getElementById("regionChip");
const subregionChip = document.getElementById("subregionChip");
const capital = document.getElementById("capital");
const population = document.getElementById("population");
const area = document.getElementById("area");
const timezones = document.getElementById("timezones");
const languages = document.getElementById("languages");
const currencies = document.getElementById("currencies");
const callingCode = document.getElementById("callingCode");
const tld = document.getElementById("tld");
const borders = document.getElementById("borders");
const gmaps = document.getElementById("gmaps");
const osmaps = document.getElementById("osmaps");
const fifa = document.getElementById("fifa");
const carSide = document.getElementById("carSide");
const startOfWeek = document.getElementById("startOfWeek");

// ===== UTIL =====
function clearLists() {
  timezones.innerHTML = "";
  languages.innerHTML = "";
  currencies.innerHTML = "";
  tld.innerHTML = "";
  borders.innerHTML = "";
}

// ===== FETCH COUNTRY =====
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const country = input.value.trim();

  if (!country) return;

  statusBox.textContent = "Searching…";
  statusBox.className = "status";
  resultCard.classList.add("hidden");
  errorCard.classList.add("hidden");

  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);

    if (!res.ok) throw new Error("Not found");

    let data = await res.json();

    // filter exact name (IMPORTANT FIX)
    data = data.filter(c =>
        c.name.common.toLowerCase() === country.toLowerCase()
    );

    const c = data.length > 0 ? data[0] : null;

    if (!c) throw new Error("No exact match");

    clearLists();

    flagImg.src = c.flags?.png || "";
    coatImg.src = c.coatOfArms?.png || "";

    nameCommon.textContent = c.name.common;
    nameOfficial.textContent = c.name.official;

    cca2.textContent = c.cca2;
    cca3.textContent = c.cca3;
    regionChip.textContent = c.region;
    subregionChip.textContent = c.subregion || "—";

    capital.textContent = c.capital ? c.capital.join(", ") : "—";
    population.textContent = c.population.toLocaleString();
    area.textContent = c.area.toLocaleString();

    // timezones
    c.timezones?.forEach(z => {
      let li = document.createElement("li");
      li.textContent = z;
      timezones.appendChild(li);
    });

    // languages
    if (c.languages) {
      Object.values(c.languages).forEach(l => {
        let li = document.createElement("li");
        li.textContent = l;
        languages.appendChild(li);
      });
    }

    // currencies
    if (c.currencies) {
      Object.values(c.currencies).forEach(cur => {
        let li = document.createElement("li");
        li.textContent = `${cur.name} (${cur.symbol})`;
        currencies.appendChild(li);
      });
    }

    // calling code
    callingCode.textContent = c.idd?.root
      ? c.idd.root + (c.idd.suffixes?.[0] || "")
      : "—";

    // tld
    c.tld?.forEach(d => {
      let li = document.createElement("li");
      li.textContent = d;
      tld.appendChild(li);
    });

    // borders
    if (c.borders) {
      c.borders.forEach(b => {
        let span = document.createElement("span");
        span.className = "chip";
        span.textContent = b;
        borders.appendChild(span);
      });
    }

    // maps
    gmaps.href = c.maps?.googleMaps || "#";
    osmaps.href = c.maps?.openStreetMaps || "#";

    fifa.textContent = c.fifa || "—";
    carSide.textContent = c.car?.side || "—";
    startOfWeek.textContent = c.startOfWeek || "—";

    // show card
    resultCard.classList.remove("hidden");
    statusBox.textContent = "Success!";
    statusBox.classList.add("ok");

  } catch (err) {
    console.log(err);
    errorCard.classList.remove("hidden");
    statusBox.textContent = "Error: Country not found!";
    statusBox.classList.add("err");
  }
});
