import { AVAILABLE_REGIONS } from "../../../assets/geojson";
import { CITY_CENTERS } from "../../../assets/geojson";

export const fetchJson = async (path) => {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  return res.json();
};

export const generateUrbanRegions = async (config) => {
  const URBAN_REGIONS_ARR = [];
  const api = config.dataUrl;
  for (const city of AVAILABLE_REGIONS) {
    const key = city.replace(/ /g, "_").replace(/\//g, "-");
    try {
      const path = `${api}/cities/${key}.json`;
      const geojson = await fetchJson(path);
      URBAN_REGIONS_ARR.push({
        name: city,
        geojson,
        center: CITY_CENTERS[city],
      });
    } catch (err) {
      console.warn(`⚠️ GeoJSON not found for ${city} (key: ${key})`);
    }
  }
  return URBAN_REGIONS_ARR;
};
