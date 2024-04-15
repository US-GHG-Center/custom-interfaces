import { MEDIUM, TYPES, GHG, CH4, FLASK, SURFACE, ghgBlue, INSITU, PFP, FLASK_PFP} from './src/enumeration.js';
import { getStationsMeta, constructStationDataSourceUrlsAndLabels, getStationDatas, constructDataAccessSourceUrl } from "./src/utils";
import { openChart, renderChart } from './src/chart/index.js';

let publicUrl = process.env.PUBLIC_URL;

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

  // options for selection
  let collectionMechanismDropdown = document.getElementById("collection-mechanism");
  if (selectedType == INSITU) {
    collectionMechanismDropdown.value = "continuous";
  } else {
    collectionMechanismDropdown.value = "discrete";
  }
  collectionMechanismDropdown.addEventListener("change", (e) => {
    let clickedVal = e.target.value;
    if (clickedVal == "discrete" & selectedType == INSITU) { // and previous is continuous
      let newlocation = `${publicUrl}/?ghg=${selectedGhg}&type=flask-pfp&medium=surface`;
      window.location.href = newlocation;
      collectionMechanismDropdown.value = "discrete";
    } else if (clickedVal == "continuous" & (selectedType == FLASK | selectedType == PFP | selectedType == FLASK_PFP)) { // and previous is discrete
      let newlocation = `${publicUrl}/?ghg=${selectedGhg}&type=insitu&medium=surface-tower`;
      window.location.href = newlocation;
      collectionMechanismDropdown.value = "continuous";
    } else {
      // do nothing
    }
  });


  // Fetch and plot Stations
  const stations = getStationsMeta(selectedGhg, selectedType, selectedMedium);
  // Loop through stations and add markers
  stations.forEach((station) => {
    const markerEl = document.createElement("div");
    // styling the marker
    if (station.dataset_name.includes("tower")) {
      markerEl.className = "marker-tower";
    } else if (station.dataset_name.includes("flask")) {
      markerEl.className = "marker-gold";
    } else {
      markerEl.className = "marker";
    }

    // adding the marker
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
        center: [Number(lon), Number(lat)-.1],
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
  async function renderStation(station) {
    openChart();
    const { stationDataUrls, stationDataLabels } = constructStationDataSourceUrlsAndLabels(selectedGhg, selectedType, selectedMedium, station.dataset_name);
    const dataAccessUrl = constructDataAccessSourceUrl(selectedGhg, selectedType, station.site_code);

    // Add in data access url link to the selected station
    document.getElementById("data-source").innerHTML = `<a href="${dataAccessUrl}"> Access data at NOAA ↗ </a>`

    // Fetch data and render chart
    try {
      let datas = await getStationDatas(stationDataUrls);
      // not all data path might be available. So filter the unavailable ones.
      // Also, at the sametime filter out the unnecessary labels from instument-graph map as well (using idx).
      datas.forEach((data, idx) => {
        if (data.status == 404) {
          datas[idx] = null;
          stationDataLabels[idx] = null;
        }
      });

      datas = datas.filter(data => data);
      let graphsDataLabels = stationDataLabels.filter(data => data);

      let parsedDatas;
      if (selectedType === "insitu") {
        let jsonConversionPromises = datas.map(data => data.json());
        parsedDatas = await Promise.all(jsonConversionPromises);
      } else {
        let textConversionPromises = datas.map(data => data.text());
        let responses = await Promise.all(textConversionPromises);
        // Parse data (you may need to adjust this based on your CSV format)
        parsedDatas = responses.map(response => parseData(response));
      }
      // Render chart
      let stationMeta = {name: station.site_name, code: station.site_code}
      renderChart(stationMeta, parsedDatas, selectedGhg, graphsDataLabels);
    } catch (err) {
      console.error(err)
    }
  }

  // Data preprocessors
  // Function to parse CSV data (customize based on your CSV format)
  function parseData(csvdata) {
    // Parse your CSV data here and return it as ank array of objects
    let data = csvdata.split("\n");
    let datasetNameStr = data[5];
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
    let filtered;
    if (datasetNameStr === "# dataset_name: co2_nwf_surface-pfp_1_ccgg_event" |
        datasetNameStr === "# dataset_name: co2_bao_surface-pfp_1_ccgg_event" |
        datasetNameStr === "# dataset_name: co2_mvy_surface-pfp_1_ccgg_event") {
      // data column number is different
      filtered = lines
      .filter((line) => line[20] == "...")
      .filter((line) => line[10] !== "-999.99")
      .filter((line) => line[10] !== "0");
    } else {
      filtered = lines
      .filter((line) => line[21] == "...")
      .filter((line) => line[10] !== "-999.99")
      .filter((line) => line[10] !== "0");

    }
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
