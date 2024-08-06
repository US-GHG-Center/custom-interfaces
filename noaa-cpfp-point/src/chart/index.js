import { getOptions, plugin } from './config.js';
import { getDatasets } from './helper/index.js';
import { setZoomInstructionEvents } from './helper/zoomInstructions.js';
import { constructDataAccessSourceUrls } from './helper/dataAccessUrl.js';
import { closeNotice } from "../notice";

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
export function renderChart(station, datas, selectedGhg, graphsDataLabels, chartColors) {
    const chartContainer = document.getElementById("chart");

    setZoomInstructionEvents();

    if (!!chart) {
        chart.destroy();
    }
    // Create a Chart.js chart here using 'data'
    // Example:

    let datasets = getDatasets(datas, graphsDataLabels, chartColors);
    let options = getOptions(station, selectedGhg);

    chart = new Chart(chartContainer, {
        type: "line",
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
    const closeButton = document.getElementById("chart-close-button");
    const zoomResetButton = document.getElementById("zoom-reset-button");

    const dataAccessUrls = constructDataAccessSourceUrls({...station}, {...queryParams});
    dataSource.innerHTML = "";
    dataAccessUrls.forEach(element => {
        // Add in data access url link to the selected station
        dataSource.innerHTML += `
                                    <div class="data-access-url-container"><a href="${element.source}" target="_blank"> ${element.title} </a></div>
                                `;
    });

    // Show chart and make map half-height
    mapContainer.style.height = "50%";
    chartContainerB.style.height = "50%";
    chartContainerB.style.display = "block";

    // add event listner to chart-close-button
    closeButton.addEventListener("click", () => {
        closeNotice();

        mapContainer.style.height = "100%";
        chartContainerB.style.height = "0%";
        chartContainerB.style.display = "none";
        if (chart) chart.clear();
    });

    zoomResetButton.addEventListener("click", () => {
        if (chart) {
            chart.resetZoom();
        }
    });
}
