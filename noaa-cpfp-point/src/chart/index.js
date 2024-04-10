import { getOptions, plugin } from './config.js';
import { getDatasets } from './helper/index.js';

let chart = null;

// Function to render the time series chart
export function renderChart(station, data, selectedGhg) {
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
    chart = new Chart(chartContainer, {
        type: "line",
        data: {
        // labels: data.map((item, index) => (index % stepSize === 0) ? item.date : ''), // Show label every stepSize data points
        labels: data.map((item) => item.date), // Show label every stepSize data points
        datasets: getDatasets(data, selectedGhg),
        },
        options: getOptions(station, selectedGhg),
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
  }
