const fetchJson = async (path, config) => {
  const res = await fetch(`${config.dataUrl}/${path}`);
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  return res.json();
};
const formatCityKeyGra2pes = (city) => {
  return (
    city.replace("/", "-").replace(/\s+/g, "_") +
    "_2021_Month07_species_sectoral_breakdown_conservative"
  );
};

export const getGra2pesData = async (city, config) => {
  const cityKey = formatCityKeyGra2pes(city);
  const data = await fetchJson(`gra2pes/${cityKey}.json`, config);

  if (!data) {
    console.warn(`⚠️ No data found for city key: ${cityKey}`);
  }

  return data;
};

const formatCityVulcanKey = (city) => {
  return (
    city.replace("/", "-").replace(/\s+/g, "_") +
    "_PLACE_AggregatedSectors_2013_2021"
  );
};

export const getVulcanData = async (city, config) => {
  const cityKey = formatCityVulcanKey(city);
  const data = await fetchJson(`vulcan/${cityKey}.json`, config);

  // const geoJSON = VULCAN_GEOJSON[city]

  if (!data) {
    console.warn(`⚠️ No data found for city key: ${cityKey}`);
  }

  return data;
};
