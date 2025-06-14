import { AVAILABLE_REGIONS } from "../../../assets/geojson";
import { CITY_CENTERS } from "../../../assets/geojson";
import { CITY_GEOJSON } from "../../../assets/geojson/cityGeojson";

export const generateUrbanRegions = async () => {
  const URBAN_REGIONS_ARR = [];

  for (const city of AVAILABLE_REGIONS) {
    const key = city.replace(/ /g, "_").replace(/\//g, "-");
    const geojson = CITY_GEOJSON[key];

    if (!geojson) {
      console.warn(`⚠️ GeoJSON not found for ${city} (key: ${key})`);
      continue;
    }

    URBAN_REGIONS_ARR.push({
      name: city,
      geojson,
      center: CITY_CENTERS[city],
    });
  }

  return URBAN_REGIONS_ARR;
};