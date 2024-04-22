import { getOptions, plugin } from './config.js';
import { getDatasets } from './helper/index.js';
import { setZoomInstructionEvents } from './helper/zoomInstructions.js';
import { constructDataAccessSourceUrl } from './helper/dataAccessUrl.js';

let chart = null;

/**
 * Renders a time series chart based on the provided station data, datasets, selected greenhouse gas, and data labels.
 * @param {Object} station - The station object containing information about the station.
 * @param {string} station.name: The station name.
 * @param {string} station.code - The station site code.
 *
 * @param {Object[]} datas - An array of datasets containing time series data.
 * @param {string} selectedGhg - The selected greenhouse gas.
 * @param {string[]} graphsDataLabels - An array of data labels for the chart.
 * @returns {void}
 */
// Function to render the time series chart
export function renderChart(station, datas, selectedGhg, graphsDataLabels) {
    const chartContainer = document.getElementById("chart");

    setZoomInstructionEvents();

    if (!!chart) {
        chart.destroy();
    }
    // Create a Chart.js chart here using 'data'
    // Example:

    let datasets = getDatasets(datas, graphsDataLabels);
    let options = getOptions(station, selectedGhg);

    chart = new Chart(chartContainer, {
        type: "line",
        // data: {
        // // labels: data.map((item, index) => (index % stepSize === 0) ? item.date : ''), // Show label every stepSize data points
        // labels: datas[0].map((item) => item.date), // Show label every stepSize data points
        // datasets: getDatasets(datas, selectedGhg),
        // },
        data: {
            datasets: datasets,
        },
        options: options,
        plugins: [plugin],
    });
}

/**
 * shows/hides chart. Map covers 50% whereas chart covers 50% of screen realstate.
 * @returns {void}
 */
export function openChart(station, queryParams) {
    const mapContainer = document.getElementById("map-container");
    const chartContainerB = document.getElementById("chart-container");
    const dataSource = document.getElementById("data-source");

    const dataAccessUrl = constructDataAccessSourceUrl({...station}, {...queryParams});
    // Add in data access url link to the selected station
    dataSource.innerHTML = `
                            <a href="${dataAccessUrl}"> Access data at NOAA ↗ </a>
                            `;
    // Show chart and make map half-height
    mapContainer.style.height = "50%";
    chartContainerB.style.height = "50%";
    chartContainerB.style.display = "block";
}