import { MEDIUM, TYPES, GHG, CH4, FLASK, SURFACE, ghgBlue} from './src/enumeration.js';
import { getStationsMeta, constructStationDataSourceUrl, getStationData, constructDataAccessSourceUrl } from "./src/utils";
import { openChart, renderChart } from './src/chart/index.js';

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
  const selectedGhg = ghg || CH4;
  const selectedType = type || FLASK;
  const selectedMedium = medium || SURFACE;

  // Add title of the NOAA according to the query params
  const titleContainer = document.getElementById("title");
  titleContainer.innerHTML = `<strong> NOAA: ESRL Global Monitoring Laboratory: ${
    GHG[selectedGhg].long
  } (${MEDIUM[selectedMedium].long}-${TYPES[selectedType].long}) </strong>`;
  titleContainer.style.display = "block";
  titleContainer.style.color = ghgBlue;

  // Fetch and plot Stations
  const stations = getStationsMeta(selectedGhg, selectedType, selectedMedium);
  // Loop through stations and add markers
  stations.forEach((station) => {
    const markerEl = document.createElement("div");
    markerEl.className = "marker";
    try {
      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat([station.site_longitude, station.site_latitude])
        .addTo(map);

      // Create a tooltip or popup content for the marker
      const tooltipContent = `
          <strong style="color: ${ghgBlue}">${station.site_code} : ${station.site_name}</strong><br>
          <strong> ${station.site_country} </strong><br>
          Latitude: ${station.site_latitude}<br>
          Longitude: ${station.site_longitude}<br>
          Elevation: ${station.site_elevation} ${station.site_elevation_unit}
          `;

      const popup = new mapboxgl.Popup().setHTML(tooltipContent);

      marker.setPopup(popup);

      marker.getElement().addEventListener("mouseenter", () => {
        popup.addTo(map);
      });

      marker.getElement().addEventListener("mouseleave", () => {
        popup.remove();
      });

      marker.getElement().addEventListener("click", () => {
        renderStation(station);
      });
    } catch (error) {
      // console.log("error in", station.site_code);
    }
  });

  // If specific station chart directly queried using URL
  if (stationCode) {
    // Find the station based on the query parameter
    const selectedStation = stations.find(
      (station) => station.site_code === stationCode
    );
    // If a station with the specified code is found, zoom in and display the chart
    if (selectedStation) {
      const { site_latitude: lat, site_longitude: lon } = selectedStation;
      const stationLocation = {
        center: [lon, lat],
        zoom: 10,
      };
      map.flyTo({ ...stationLocation, duration: 1200, essential: true }); // Adjust the zoom level as needed
      renderStation(selectedStation);
    }
  }

  // MAP resize observer
  const mapC = document.getElementById("map");
  const resizeObserver = new ResizeObserver(() => {
    setTimeout(function () {
      map.resize();
    }, 0);
  });
  resizeObserver.observe(mapC);

  // On station click: render station
  async function renderStation(station, frequency="monthly") {
    openChart();
    const stationDataUrl = constructStationDataSourceUrl(selectedGhg, selectedType, selectedMedium, station.dataset_name, frequency);
    const dataAccessUrl = constructDataAccessSourceUrl(selectedGhg, selectedType, station.site_code);

    // Add in data access url link to the selected station
    document.getElementById("data-source").innerHTML = `<a href="${dataAccessUrl}"> Access data at NOAA ↗ </a>`
    // for Insitu, give an option to select monthly and daily frequency datasets.
    let frequencySelector = document.getElementById("select-frequency");
    if (selectedType === "insitu") {
      frequencySelector.innerHTML = `
                                    Data frequency
                                    <select style="margin-left: 5px;">
                                      <option value='monthly'>Monthly</option>
                                      <option value='daily'>Daily</option>
                                    <select>
                                    `;
      let selectOption = frequencySelector.querySelector("select");
      selectOption.value = frequency;
      selectOption.addEventListener("change", (event) => {
        let frequency = event.target.value;
        renderStation(station, frequency)
      });
    }

    // Fetch data and render chart
    try {
      let data = await getStationData(stationDataUrl);
      let parsedData;
      if (selectedType === "insitu") {
        parsedData = await data.json();
      } else {
        let response = await data.text();
        // Parse data (you may need to adjust this based on your CSV format)
        parsedData = await parseData(response);
      }
      // Render chart
      renderChart({name: station.site_name, code: station.site_code}, parsedData, selectedGhg);
    } catch (err) {
      console.error(err)
    }
  }

  // Data preprocessors
  // Function to parse CSV data (customize based on your CSV format)
  async function parseData(csvdata) {
    // Parse your CSV data here and return it as ank array of objects
    let data = csvdata.split("\n");
    let header_lines = data[0]
      .split(":")
      .slice(-1)[0]
      .trim()
      .replace("\n#\n#", "");
    header_lines = parseInt(header_lines);
    data = data.slice(header_lines - 1);
    const lines = data
      .slice(1)
      .map((line) => line.replace("\n", "").split(" "));
    const filtered = lines
      .filter((line) => line[21] == "...")
      .filter((line) => line[10] !== "-999.99")
      .filter((line) => line[10] !== "0");
    let return_value = filtered.map((line) => {
      return {
        date: line[7],
        value: line[10],
      };
    });
    return return_value;
    // return [{ date: "2023-01-01", value: 10 }, { date: "2023-01-02", value: 20 }, { date: "2023-01-03", value: 15 }]
  }
});
