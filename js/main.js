/* =========================================================
   WORLD WIDE BAR - MAIN.JS
   Interactive world map / country markers / 3-page pamphlet
   ========================================================= */

// Regional data files are loaded before this file in index.html.
const alcoholData = Array.isArray(window.alcoholData) ? window.alcoholData : [];

// Master list: ensures all 23 locations and their drink labels remain available
// even while an individual team's detailed data is still being prepared.
const countriesInfo = [
    {
        "code": "036",
        "name": "호주",
        "flag": "🇦🇺",
        "region": "Oceania",
        "drinkName": "럼 (Rum)"
    },
    {
        "code": "554",
        "name": "뉴질랜드",
        "flag": "🇳🇿",
        "region": "Oceania",
        "drinkName": "와인 (Wine)"
    },
    {
        "code": "242",
        "name": "피지",
        "flag": "🇫🇯",
        "region": "Oceania",
        "drinkName": "토디 (Toddy)"
    },
    {
        "code": "410",
        "name": "대한민국",
        "flag": "🇰🇷",
        "region": "Asia",
        "drinkName": "막걸리 (Makgeolli)"
    },
    {
        "code": "392",
        "name": "일본",
        "flag": "🇯🇵",
        "region": "Asia",
        "drinkName": "사케 (Sake)"
    },
    {
        "code": "156",
        "name": "중국",
        "flag": "🇨🇳",
        "region": "Asia",
        "drinkName": "황주 (Huangjiu)"
    },
    {
        "code": "496",
        "name": "몽골",
        "flag": "🇲🇳",
        "region": "Asia",
        "drinkName": "아이락 (Airag)"
    },
    {
        "code": "704",
        "name": "베트남",
        "flag": "🇻🇳",
        "region": "Asia",
        "drinkName": "르어우껀 (Rượu cần)"
    },
    {
        "code": "276",
        "name": "독일",
        "flag": "🇩🇪",
        "region": "Europe",
        "drinkName": "바이젠 맥주 (Weizenbier)"
    },
    {
        "code": "826",
        "name": "스코틀랜드",
        "flag": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
        "region": "Europe",
        "drinkName": "스카치 위스키 (Scotch Whisky)"
    },
    {
        "code": "250",
        "name": "프랑스",
        "flag": "🇫🇷",
        "region": "Europe",
        "drinkName": "샴페인 (Champagne)"
    },
    {
        "code": "203",
        "name": "체코",
        "flag": "🇨🇿",
        "region": "Europe",
        "drinkName": "필스너 (Pilsner)"
    },
    {
        "code": "380",
        "name": "이탈리아",
        "flag": "🇮🇹",
        "region": "Europe",
        "drinkName": "그라파 (Grappa)"
    },
    {
        "code": "231",
        "name": "에티오피아",
        "flag": "🇪🇹",
        "region": "Africa",
        "drinkName": "테즈 (Tej)"
    },
    {
        "code": "566",
        "name": "나이지리아",
        "flag": "🇳🇬",
        "region": "Africa",
        "drinkName": "팜 와인 (Palm Wine)"
    },
    {
        "code": "710",
        "name": "남아프리카공화국",
        "flag": "🇿🇦",
        "region": "Africa",
        "drinkName": "움콤보티 (Umqombothi)"
    },
    {
        "code": "288",
        "name": "가나",
        "flag": "🇬🇭",
        "region": "Africa",
        "drinkName": "아케테시에 (Akpeteshie)"
    },
    {
        "code": "504",
        "name": "모로코",
        "flag": "🇲🇦",
        "region": "Africa",
        "drinkName": "마히아 (Mahia)"
    },
    {
        "code": "484",
        "name": "멕시코",
        "flag": "🇲🇽",
        "region": "Americas",
        "drinkName": "데킬라 (Tequila)"
    },
    {
        "code": "840",
        "name": "미국",
        "flag": "🇺🇸",
        "region": "Americas",
        "drinkName": "버번 위스키 (Bourbon)"
    },
    {
        "code": "604",
        "name": "페루",
        "flag": "🇵🇪",
        "region": "Americas",
        "drinkName": "피스코 (Pisco)"
    },
    {
        "code": "076",
        "name": "브라질",
        "flag": "🇧🇷",
        "region": "Americas",
        "drinkName": "카샤사 (Cachaça)"
    },
    {
        "code": "192",
        "name": "쿠바",
        "flag": "🇨🇺",
        "region": "Americas",
        "drinkName": "쿠바 럼 (Cuban Rum)"
    }
];

const mapContainer = document.getElementById('world-map');
const infoContainer = document.getElementById('drink-info');
const tooltip = document.getElementById('map-tooltip');
const pamphletContent = document.getElementById('pamphlet-content');
const pageCounter = document.getElementById('page-counter');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');

let selectedCountry = null;
let currentPage = 1;
let currentWorldData = null;
let resizeTimer = null;

const normalizeCode = (code) => String(code ?? '').padStart(3, '0');

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[char]);
}

function getCountryInfo(code) {
  return countriesInfo.find((country) => normalizeCode(country.code) === normalizeCode(code));
}

function getDrinkByCode(code) {
  return alcoholData.find((item) => normalizeCode(item.countryCode) === normalizeCode(code));
}

function getCountryDrink(code) {
  const country = getCountryInfo(code);
  if (!country) return null;
  const drink = getDrinkByCode(code) || {};
  return {
    ...country,
    ...drink,
    countryCode: country.code,
    countryName: drink.countryName || country.name,
    flag: drink.flag || country.flag,
    drinkName: drink.drinkName || country.drinkName,
    type: drink.type || '자료 준비 중',
    ingredient: drink.ingredient || '자료 준비 중',
    method: drink.method || '자료 준비 중',
    history: drink.history || '자료 준비 중',
    culture: drink.culture || '자료 준비 중',
    image: drink.image || ''
  };
}

function validateProjectData() {
  const seen = new Set();
  countriesInfo.forEach((country) => {
    const code = normalizeCode(country.code);
    if (seen.has(code)) console.error(`[World Wide Bar] 중복 국가 코드: ${code}`);
    seen.add(code);
  });
  if (countriesInfo.length !== 23) {
    console.error(`[World Wide Bar] 국가 목록은 23개여야 합니다. 현재: ${countriesInfo.length}개`);
  }
  const dataCodes = new Set();
  alcoholData.forEach((item) => {
    const code = normalizeCode(item.countryCode);
    if (dataCodes.has(code)) console.error(`[World Wide Bar] 상세 데이터 중복: ${code}`);
    dataCodes.add(code);
    if (!getCountryInfo(code)) console.warn(`[World Wide Bar] 등록 목록에 없는 데이터 코드: ${code}`);
    ['countryCode', 'countryName', 'flag', 'drinkName', 'type', 'ingredient', 'method', 'history', 'culture', 'image']
      .forEach((key) => {
        if (!(key in item)) console.warn(`[World Wide Bar] ${code} 데이터에 ${key} 항목이 없습니다.`);
      });
  });
}

function showTooltip(event, country) {
  if (!tooltip || !country) return;
  tooltip.innerHTML = `<strong>${escapeHTML(country.flag)} ${escapeHTML(country.name)}</strong><br>${escapeHTML(country.drinkName)}`;
  tooltip.style.display = 'block';
  tooltip.setAttribute('aria-hidden', 'false');
  moveTooltip(event);
}

function moveTooltip(event) {
  if (!tooltip || tooltip.style.display === 'none') return;
  const offset = 15;
  const width = tooltip.offsetWidth || 220;
  const height = tooltip.offsetHeight || 50;
  const left = Math.min(event.clientX + offset, window.innerWidth - width - 10);
  const top = Math.min(event.clientY + offset, window.innerHeight - height - 10);
  tooltip.style.left = `${Math.max(8, left)}px`;
  tooltip.style.top = `${Math.max(8, top)}px`;
}

function hideTooltip() {
  if (!tooltip) return;
  tooltip.style.display = 'none';
  tooltip.setAttribute('aria-hidden', 'true');
}

function selectCountry(code) {
  const drink = getCountryDrink(code);
  if (!drink || !infoContainer) return;
  selectedCountry = drink;
  currentPage = 1;
  renderPamphlet();
  infoContainer.classList.add('open');
  infoContainer.setAttribute('aria-hidden', 'false');
  hideTooltip();
  if (mapContainer) {
    mapContainer.querySelectorAll('.country.is-selected').forEach((node) => node.classList.remove('is-selected'));
    const selected = mapContainer.querySelector(`[data-country-code="${normalizeCode(code)}"]`);
    if (selected) selected.classList.add('is-selected');
  }
}

function closePamphlet() {
  if (!infoContainer) return;
  infoContainer.classList.remove('open');
  infoContainer.setAttribute('aria-hidden', 'true');
  selectedCountry = null;
  if (mapContainer) mapContainer.querySelectorAll('.country.is-selected').forEach((node) => node.classList.remove('is-selected'));
}

function changePage(direction) {
  if (!selectedCountry) return;
  currentPage = Math.max(1, Math.min(3, currentPage + direction));
  renderPamphlet();
}

function imageMarkup(drink) {
  if (!drink.image) {
    return '<div class="image-placeholder">IMAGE<br>COMING SOON</div>';
  }
  const safeSrc = escapeHTML(drink.image);
  const safeAlt = escapeHTML(drink.drinkName);
  return `<img class="drink-image" src="${safeSrc}" alt="${safeAlt}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'), { className: 'image-placeholder', innerHTML: 'IMAGE<br>COMING SOON' }))">`;
}

function getPageContent(drink, page) {
  if (page === 1) {
    return `
      <div class="pamphlet-page cover-page">
        <div class="page-label">WORLD WIDE BAR · SIGNATURE DRINK</div>
        <div class="gold-line"></div>
        <div class="drink-subtitle">BARTENDER'S SELECTION</div>
        <h1 class="drink-title">${escapeHTML(drink.drinkName)}</h1>
        <div class="gold-line"></div>
        <div class="drink-image-area">${imageMarkup(drink)}</div>
        <p class="cover-motto">A taste of tradition, culture and history.</p>
      </div>`;
  }

  if (page === 2) {
    return `
      <div class="pamphlet-page">
        <div class="page-label">01 · COUNTRY & INGREDIENTS</div>
        <h2 class="country-heading">${escapeHTML(drink.flag)} <span class="country-name-ko">${escapeHTML(drink.countryName)}</span></h2>
        <div class="info-block"><div class="info-heading">SIGNATURE DRINK</div><p class="info-text">${escapeHTML(drink.drinkName)}</p></div>
        <div class="info-block"><div class="info-heading">TYPE OF DRINK</div><p class="info-text">${escapeHTML(drink.type)}</p></div>
        <div class="info-block"><div class="info-heading">MAIN INGREDIENTS</div><p class="info-text">${escapeHTML(drink.ingredient)}</p></div>
      </div>`;
  }

  return `
    <div class="pamphlet-page">
      <div class="page-label">02 · STORY & CULTURE</div>
      <div class="info-block"><div class="info-heading">PRODUCTION METHOD</div><p class="info-text">${escapeHTML(drink.method)}</p></div>
      <div class="info-block"><div class="info-heading">HISTORY</div><p class="info-text">${escapeHTML(drink.history)}</p></div>
      <div class="info-block"><div class="info-heading">CULTURAL SIGNIFICANCE</div><p class="info-text">${escapeHTML(drink.culture)}</p></div>
    </div>`;
}

function renderPamphlet() {
  if (!selectedCountry || !pamphletContent) return;
  pamphletContent.innerHTML = getPageContent(selectedCountry, currentPage);
  pamphletContent.scrollTop = 0;
  pageCounter.textContent = `0${currentPage} / 03`;
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === 3;
}

function createWorldMap(worldData) {
  if (!mapContainer) return;
  if (typeof d3 === 'undefined' || typeof topojson === 'undefined') {
    mapContainer.innerHTML = '<div class="map-loading">지도를 표시할 라이브러리를 불러오지 못했습니다. 인터넷 연결을 확인해 주세요.</div>';
    console.error('[World Wide Bar] D3 또는 TopoJSON을 불러오지 못했습니다.');
    return;
  }

  mapContainer.innerHTML = '';
  const width = Math.max(mapContainer.clientWidth, 320);
  const height = Math.max(mapContainer.clientHeight, 300);
  const features = topojson.feature(worldData, worldData.objects.countries).features;
  const registered = new Map(countriesInfo.map((country) => [normalizeCode(country.code), country]));
  const projection = d3.geoNaturalEarth1().fitExtent([[18, 20], [width - 18, height - 20]], {
    type: 'FeatureCollection', features
  });
  const path = d3.geoPath(projection);
  const svg = d3.select(mapContainer).append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .attr('role', 'presentation');

  svg.append('g').attr('class', 'country-shapes')
    .selectAll('path').data(features).join('path')
    .attr('class', (feature) => registered.has(normalizeCode(feature.id)) ? 'country registered' : 'country unregistered')
    .attr('data-country-code', (feature) => normalizeCode(feature.id))
    .attr('d', path)
    .on('mouseenter', function(event, feature) {
      const country = registered.get(normalizeCode(feature.id));
      if (!country) return;
      d3.select(this).classed('is-hovered', true);
      showTooltip(event, country);
    })
    .on('mousemove', moveTooltip)
    .on('mouseleave', function() {
      d3.select(this).classed('is-hovered', false);
      hideTooltip();
    })
    .on('click', function(event, feature) {
      const country = registered.get(normalizeCode(feature.id));
      if (country) selectCountry(country.code);
    });

  const markers = svg.append('g').attr('class', 'country-markers');
  countriesInfo.forEach((country) => {
    const feature = features.find((item) => normalizeCode(item.id) === normalizeCode(country.code));
    if (!feature) {
      console.warn(`[World Wide Bar] 지도에서 국가 코드를 찾지 못했습니다: ${country.code} (${country.name})`);
      return;
    }
    const [x, y] = path.centroid(feature);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    const marker = markers.append('g')
      .attr('class', 'country-marker')
      .attr('transform', `translate(${x},${y})`)
      .on('mouseenter', (event) => showTooltip(event, country))
      .on('mousemove', moveTooltip)
      .on('mouseleave', hideTooltip)
      .on('click', () => selectCountry(country.code));
    marker.append('circle').attr('class', 'marker-halo').attr('r', 9);
    marker.append('circle').attr('class', 'marker-core').attr('r', 4.7);
  });

  if (selectedCountry) {
    const selected = mapContainer.querySelector(`[data-country-code="${normalizeCode(selectedCountry.code)}"]`);
    if (selected) selected.classList.add('is-selected');
  }
}

function handleResize() {
  if (!currentWorldData) return;
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => createWorldMap(currentWorldData), 120);
}

// Panel controls
if (document.getElementById('close-pamphlet')) {
  document.getElementById('close-pamphlet').addEventListener('click', closePamphlet);
}
if (prevButton) prevButton.addEventListener('click', () => changePage(-1));
if (nextButton) nextButton.addEventListener('click', () => changePage(1));
document.addEventListener('keydown', (event) => {
  if (!selectedCountry) return;
  if (event.key === 'Escape') closePamphlet();
  if (event.key === 'ArrowLeft') changePage(-1);
  if (event.key === 'ArrowRight') changePage(1);
});

validateProjectData();

if (typeof d3 === 'undefined' || typeof topojson === 'undefined') {
  if (mapContainer) {
    mapContainer.innerHTML = '<div class="map-loading">지도 라이브러리를 불러오지 못했습니다.<br>인터넷 연결을 확인해 주세요.</div>';
  }
  console.error('[World Wide Bar] D3 또는 TopoJSON 라이브러리를 불러오지 못했습니다.');
} else {
  d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    .then((worldData) => {
      currentWorldData = worldData;
      createWorldMap(worldData);
    })
    .catch((error) => {
      console.error('[World Wide Bar] 세계지도 로딩 오류:', error);
      if (mapContainer) mapContainer.innerHTML = '<div class="map-loading">세계지도를 불러오지 못했습니다.<br>인터넷 연결을 확인해 주세요.</div>';
    });
}

window.addEventListener('resize', handleResize);
