let ghgBlue = "#082A63";

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

// script.js
document.addEventListener("DOMContentLoaded", () => {
  let chart = null;
  const baseFileName = "1_ccgg_event";

  const chartContainer = document.getElementById("chart");

  const mapC = document.getElementById("map");
  const mapContainer = document.getElementById("map-container");
  const chartContainerB = document.getElementById("chart-container");

  // Replace 'MAPBOX_ACCESS_TOKEN' with your actual Mapbox access token
  mapboxgl.accessToken =
    "pk.eyJ1Ijoic2xlc2FhZCIsImEiOiJjbDd0anduOWUweml6NDFyMHI2MzN1ZHdmIn0.L8NDN4-Z41VeGCOHUMtjlg";

  // Parse query parameters from the URL
  const queryParams = new URLSearchParams(window.location.search);
  const stationCode = queryParams.get("station_code");
  const ghg = queryParams.get("ghg");
  const type = queryParams.get("type");
  const selectedGhg = ghg || "ch4";
  const selectedType = type || "flask";

  const titleContainer = document.getElementById("title");
  titleContainer.innerHTML = `<strong> NOAA: Global Monitoring Laboratory: ${
    selectedGhg === "ch4" ? "Methane" : "Carbon dioxide"
  } ${selectedType === "flask" ? "(Flask)" : "(Surface PFP)"} </strong>`;
  titleContainer.style.display = "block";
  titleContainer.style.color = ghgBlue;

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/satellite-v9",
    center: [-98.585522, 1.8333333], // Centered on the US
    zoom: 2,
    projection: 'equirectangular'
  });

  const stations = stations_data[selectedType][selectedGhg];

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

  // Function to toggle map height and show/hide chart
  function openChart() {
    // Show chart and make map half-height
    mapContainer.style.height = "50%";
    chartContainerB.style.height = "50%";
    chartContainerB.style.display = "block";
  }

  const resizeObserver = new ResizeObserver(() => {
    setTimeout(function () {
      map.resize();
    }, 0);
  });

  resizeObserver.observe(mapC);

  function renderStation(station) {
    openChart();
    const selectedFile = `${selectedType}/${selectedGhg}/${selectedGhg}_${station.site_code.toLowerCase()}_${
      station.dataset_project
    }_${baseFileName}.txt`;
    // Fetch data and render chart
    fetch(selectedFile)
      .then((response) => response.text())
      .then(async (data) => {
        // Parse data (you may need to adjust this based on your CSV format)
        const parsedData = await parseData(data);
        // Render chart
        renderChart(chartContainer, {name: station.site_name, code: station.site_code}, parsedData);
      })
      .catch((error) => console.error(error));
  }

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

    // Add an event listener to the dropdown to update the chart when the selection changes
    // dropdown.addEventListener('change', () => {
    //     const selectedCSVFile = dropdown.value;
    //     fetch(selectedCSVFile)
    //         .then(response => response.text())
    //         .then(data => {
    //             // Parse CSV data (you may need to adjust this based on your CSV format)
    //             const parsedData = parseData(data);

    //             // Render the chart inside the popup content
    //             renderChart(`chart-${station.name}`, station.name, parsedData);
    //         })
    //         .catch(error => console.error(error));
    // });
  });

  // Function to parse CSV data (customize based on your CSV format)
  async function parseData(data) {
    // Parse your CSV data here and return it as an array of objects
    data = data.split("\n");
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

  // Function to create a dropdown menu with CSV file options
  function createDropdown(csvFiles) {
    const dropdown = document.createElement("select");
    csvFiles.forEach((csvFile) => {
      const option = document.createElement("option");
      option.value = csvFile;
      option.textContent = csvFile;
      dropdown.appendChild(option);
    });
    return dropdown;
  }

  // Function to render the time series chart
  function renderChart(chartContainer, station, data) {
    // const chartContainer = document.getElementById(containerId);

    const zoomInstructions = document.getElementById("zoom-instructions");
    if (zoomInstructions) {
      zoomInstructions.style.display = "block"; // Show instructions when not zoomed
    }

    if (!!chart) {
      chart.destroy();
    }

    // Define a red color for the hovered point
    const redColor = "rgb(255, 0, 0)";

    // Limit the number of x-axis labels to a maximum of 10
    const maxLabelsToShow = 10;
    const stepSize = Math.ceil(data.length / maxLabelsToShow);

    // Create a Chart.js chart here using 'data'
    // Example:
    chart = new Chart(chartContainer, {
      type: "line",
      data: {
        // labels: data.map((item, index) => (index % stepSize === 0) ? item.date : ''), // Show label every stepSize data points
        labels: data.map((item) => item.date), // Show label every stepSize data points
        datasets: [
          {
            label: `Observed ${
              selectedGhg === "ch4" ? "CH₄" : "CO₂"
            } Concentration`,
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
              text: `${
                selectedGhg === "ch4" ? "Methane (CH₄)" : "Carbon Dioxide (CO₂)"
              } Concentration (${selectedGhg === "ch4" ? "ppb" : "ppm"})`,
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
            position: "bottom", // You can change the position to 'bottom', 'left', or 'right'
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

    // Function to update zoom instructions
    function updateZoomInstructions() {
      const zoomInstructions = document.getElementById("zoom-instructions");
      if (zoomInstructions) {
        zoomInstructions.style.display = "none"; // Show instructions when not zoomed
      }
    }
  }
});
