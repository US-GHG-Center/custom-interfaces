import { CH4, FLASK, SURFACE } from './src/enumeration.js';
import { drawTitle } from './src/title/index.js';
import { plotStations } from "./src/station/index.js";
import { showOptions } from './src/menu/index.js';

// script.js
document.addEventListener("DOMContentLoaded", () => {
  // Replace 'MAPBOX_ACCESS_TOKEN' with your actual Mapbox access token
  mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

  // initialize map
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/satellite-v9",
    center: [-98.585522, 1.8333333], // Centered on the US
    zoom: 2,
    projection: 'equirectangular'
  });

  // Parse query parameters from the URL
  const queryParams = new URLSearchParams(window.location.search);
  const stationCode = queryParams.get("station_code");
  const ghg = queryParams.get("ghg");
  const type = queryParams.get("type");
  const medium = queryParams.get("medium");
  const frequency = queryParams.get("frequency");
  const selectedGhg = ghg || CH4;
  const selectedType = type || FLASK;
  const selectedMedium = medium || SURFACE;

  const parsedQueryParams = {
    ghg: selectedGhg,
    type: selectedType,
    medium: selectedMedium,
    frequency,
    stationCode
  }

  drawTitle({...parsedQueryParams});
  showOptions({...parsedQueryParams});

  // Fetch and plot Stations
  plotStations(map, parsedQueryParams);

  // MAP resize observer
  const mapC = document.getElementById("map");
  const resizeObserver = new ResizeObserver(() => {
    setTimeout(function () {
      map.resize();
    }, 0);
  });
  resizeObserver.observe(mapC);
});
