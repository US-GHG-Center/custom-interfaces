import { getOptions, plugin } from './config.js';
import { getDatasets } from './helper/index.js';

let chart = null;

// Function to render the time series chart
export function renderChart(station, datas, selectedGhg, graphsDataLabels) {
    const chartContainer = document.getElementById("chart");
    const zoomInstructions = document.getElementById("zoom-instructions");
    
    if (zoomInstructions) {
        zoomInstructions.style.display = "block"; // Show instructions when not zoomed
    }

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

// Function to toggle map height and show/hide chart
export function openChart() {
    const mapContainer = document.getElementById("map-container");
    const chartContainerB = document.getElementById("chart-container");
    // Show chart and make map half-height
    mapContainer.style.height = "50%";
    chartContainerB.style.height = "50%";
    chartContainerB.style.display = "block";

    let collectionMechanismDropdownContainer = document.getElementById("collection-mechanism-selection-container");
    collectionMechanismDropdownContainer.style.height = "54%";
    let legendContainer = document.getElementById("legend-container");
    legendContainer.style.height = "61%";
  }
