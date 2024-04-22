import { addMarker } from "../marker";
import { drawLegend } from "../marker/legend/legend";
import { openChart } from "../chart";
import { getStationsMeta, getStationDatas, constructDataAccessSourceUrl } from "../utils";
import { parseData } from "./dataPreprocessor";
import { renderChart } from "../chart";
import { getDataSourceAndLabels } from "./dataSourceAndLabel";

/**
 * Plots stations on the provided map based on the given query parameters.
 * 
 * This function fetches stations metadata using the provided query parameters and plots
 * them on the specified map. Additionally, it adds click and hover event listeners to the plotted stations.
 * 
 * @param {Object} map - The map object where the stations will be plotted.
 * @param {Object} queryParams - An object containing query parameters.
 * @param {string} [queryParams.ghg='co2'] - The greenhouse gas (CO2 or CH4).
 *                                          Possible values: 'co2', 'ch4'.
 * @param {string} [queryParams.type='flask'] - The type of data (insitu, flask, or pfp).
 *                                              Possible values: 'insitu', 'flask', 'pfp'.
 * @param {string} [queryParams.medium='surface'] - The medium of measurement (tower or surface).
 *                                                   Possible values: 'tower', 'surface'.
 * @param {string} [queryParams.frequency='continuous'] - The frequency of measurement (continuous or non-continuous).
 *                                                        Possible values: 'continuous', 'non-continuous', 'all'
 * @returns {void} This function does not return a value.
 */
export const plotStations = (map, queryParams) => {
    // Fetch and plot Stations
    const stations = getStationsMeta(queryParams);
    stations.forEach((station) => {
        try {
            // add marker to the map.
            let marker = addMarker(map, station, queryParams);
            // also add in the click event listner to the marker
            marker.getElement().addEventListener("click", () => {
                handleStationClick(station, queryParams);
            });
        } catch (err) {
            // console.log("error in", station.site_code);
            // console.log(err)
        }
    });

    drawLegend(queryParams);

    const { stationCode } = queryParams;
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
            handleStationClick(selectedStation, queryParams);
        }
    }
}

/**
 * Handles the click event on a station marker.
 * 
 * This function is triggered when a station marker on the map is clicked (or explicitly called via stationCode in query params).
 * It opens a chart, retrieves data sources, constructs data access URLs, fetches data, and opens and renders a chart
 * based on the provided station information and query parameters.
 * 
 * @param {Object} station - The station object representing the clicked station.
 * @param {Object} queryParams - An object containing query parameters.
 * @param {string} queryParams.stationCode - The code of the clicked station.
 * @param {string} queryParams.ghg - The greenhouse gas (CO2 or CH4).
 * @param {string} queryParams.type - The type of data (insitu, flask, or pfp).
 * @param {string} queryParams.medium - The medium of measurement (tower or surface).
 * @param {string} queryParams.frequency - The frequency of measurement (continuous or non-continuous).
 * @returns {void} This function does not return a value.
 */
const handleStationClick = async (station, queryParams) => {
    const { ghg, type } = queryParams;
    const { site_code, site_name } = station;
    openChart();

    let dataSourceAndLabels = getDataSourceAndLabels(station, {...queryParams});
    const dataAccessUrl = constructDataAccessSourceUrl(ghg, type, site_code);

    // Add in data access url link to the selected station
    document.getElementById("data-source").innerHTML = `<a href="${dataAccessUrl}"> Access data at NOAA ↗ </a>`

    // Fetch data and render chart
    try {
      const dataSources = dataSourceAndLabels.map(elem => elem.datasource);
      let datas = await getStationDatas(dataSources);
      datas.forEach((data, idx) => {
        // not all data path might be available. So filter the unavailable ones.
        // Also, at the sametime filter out the unnecessary labels. (using idx).
        if (data.status == 404) {
          dataSourceAndLabels[idx] = null;
        }
      });

      // filtered data and labels, based off availabillity
      datas = datas.filter(data => data);
      let labels = dataSourceAndLabels.map(elem => elem.label);

      // promises to convert them to appropriate json.
      const conversionPromises = [];
      datas.forEach(data => {
        if (data && data.url && !data.url.includes("insitu")) {
          let promise = data.text().then(res => parseData(res));
          conversionPromises.push(promise);
        } else { // new ones will have json by default
          let promise = data.json();
          conversionPromises.push(promise);
        }
      });
      let parsedDatas = await Promise.all(conversionPromises);

      // Render chart
      let stationMeta = {name: site_name, code: site_code}
      renderChart(stationMeta, parsedDatas, ghg, labels);
    } catch (err) {
      console.error(err)
    }
}