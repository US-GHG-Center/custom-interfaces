import { GHG, ghgBlue} from '../enumeration.js';

let chart = null;

const plugin = {
  id: "corsair",
  defaults: {
    width: 1,
    color: "#DEDEDE",
    dash: [1000, 1000],
  },
  afterInit: (chart, args, opts) => {
    chart.corsair = {
      x: 0,
      y: 0,
    };
  },
  afterEvent: (chart, args) => {
    const { inChartArea } = args;
    const { type, x, y } = args.event;

    chart.corsair = { x, y, draw: inChartArea };
    chart.draw();
  },
  beforeDatasetsDraw: (chart, args, opts) => {
    const { ctx } = chart;
    const { top, bottom, left, right } = chart.chartArea;
    const { x, y, draw } = chart.corsair;
    if (!draw) return;

    ctx.save();

    ctx.beginPath();
    ctx.lineWidth = opts.width;
    ctx.strokeStyle = opts.color;
    ctx.setLineDash(opts.dash);
    ctx.moveTo(x, bottom);
    ctx.lineTo(x, top);
    // ctx.moveTo(left, y)
    // ctx.lineTo(right, y)
    ctx.stroke();

    ctx.restore();
  },
};

// Function to update zoom instructions
function updateZoomInstructions() {
    const zoomInstructions = document.getElementById("zoom-instructions");
    if (zoomInstructions) {
    zoomInstructions.style.display = "none"; // Show instructions when not zoomed
    }
}

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
        datasets: [
            {
            label: `Observed ${GHG[selectedGhg].short} Concentration`,
            data: data.map((item) => item.value),
            borderColor: "#440154",
            borderWidth: 2,
            spanGaps: true,
            // fill: false,
            // pointRadius: 0, // Remove the points
            showLine: false,
            hoverBorderWidth: 3,
            pointHoverBackgroundColor: "#440154", // Set hover background color to red
            pointHoverBorderColor: "#FFFFFF", // Set hover border color to red
            },
        ],
        },
        options: {
        interaction: {
            intersect: false,
            mode: "nearest",
            axis: "x",
        },
        hover: {
            mode: "nearest",
            intersect: false,
        },
        scales: {
            x: {
            title: {
                display: true,
                text: "Observation Date/Time",
            },
            grid: {
                display: false,
                drawOnChartArea: false,
            },
            type: "time",
            ticks: {
                autoSkip: true, // Enable automatic skip
                maxTicksLimit: 8, // Maximum number of ticks to display
                // callback: function(value) {
                //   return "fadhsdsf"
                // }
            },
            },
            y: {
            title: {
                text: `${ GHG[selectedGhg].long } (${GHG[selectedGhg].short}) Concentration (${GHG[selectedGhg].unit})`,
                display: true,
            },
            },
        },
        plugins: {
            corsair: {
            // color: 'black',
            },
            zoom: {
            zoom: {
                wheel: {
                enabled: true,
                },
                pinch: {
                enabled: true,
                },
                drag: {
                enabled: true,
                },
                mode: "x",
                onZoom: (zoom) => {
                // Handle zoom event here
                // isChartZoomed = zoom.scales.x > 1; // Check if x-scale zoomed
                updateZoomInstructions(); // Call a function to update instructions
                },
            },
            },
            title: {
            display: true,
            text: `${station.name} (${station.code})`, // Add your chart title here
            padding: {
                top: 10,
                bottom: 20,
            },
            font: {
                size: 24,
                family: "Inter",
            },
            color: ghgBlue,
            },
            legend: {
            display: true,
            position: "top", // You can change the position to 'bottom', 'left', or 'right'
            },
            tooltip: {
            callbacks: {
                label: function (context) {
                let label = context.dataset.label || "";
                let splitText = label.split(":");
                return `${context.parsed.y} : ${
                    splitText[splitText.length - 1]
                }`;
                },
            },
            mode: "nearest",
            intersect: false,
            backgroundColor: "#FFFFFF",
            titleColor: "#000",
            bodyColor: "#000",
            titleFontSize: 16,
            titleFontColor: "#0066ff",
            bodyFontColor: "#000",
            bodyFontSize: 14,
            displayColors: true,
            cornerRadius: 5,
            borderColor: "#DEDEDE",
            borderWidth: 1,
            padding: 8,
            caretSize: 0,
            boxPadding: 3,
            // multiKeyBackground: ghgBlue
            },
        },
        },
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
