// It has no global vars referenced
function filterByDates(data, sDate, eDate, type) {

    // Filter features within the date range for coverage
    if (type === "coverage"){
        const start = new Date(sDate+'Z');
        const end = new Date(eDate+'Z');
        const filteredFeatures = data.features.filter(feature => {
            const featureStartTime = new Date(feature.properties.start_time);
            const featureEndTime = new Date(feature.properties.end_time);

            // Check if the feature's time range overlaps with the given date range
            return (featureStartTime >= start && featureEndTime <= end);
        });
        return {
            ...data,
            features: filteredFeatures
        };
    }

    if (type === "methane-stac") {
        const start = new Date(sDate);
        const end = new Date(eDate);
        // Iterate over each file in the data object and filter based on the date in the filename
        const filteredFeatures = Object.keys(data).filter(key => {
            const item = data[key];
            const fileDateStr = key.match(/(\d{8}T\d{6})/)[0]; // Extract the date part '20240902T130832'
            const fileDate = new Date(fileDateStr.slice(0, 4) + '-' + fileDateStr.slice(4, 6) + '-' + fileDateStr.slice(6, 8) + 'T' + fileDateStr.slice(9, 11) + ':' + fileDateStr.slice(11, 13) + ':' + fileDateStr.slice(13, 15));

            // Check if the file date is within the range
            return (fileDate >= start && fileDate <= end);
        }).map(key => data[key]); // Return the filtered objects
        return {
            ...data,
            features: filteredFeatures
        };
    }

    if (type === "plumes") {
        const start = new Date(sDate);
        const end = new Date(eDate);
        // Filter geojson features based on the UTC Time Observed
        const filteredFeatures = data.features.filter(feature => {
            const observedTime = new Date(feature.properties["UTC Time Observed"]);
            // Check if the observed time falls within the given date range
            return (observedTime >= start && observedTime <= end);
        });
        return {
            ...data,
            features: filteredFeatures
        };
    }
    
}

const d3 = require("d3");

function generateScale(min, max, step) {
  const numbers = [];
  for (let i = min; i <= max; i += step) {
    numbers.push(i);
  }
  numbers[numbers.length - 1] += "+";
  return numbers;
}

function createColorbar(VMIN, VMAX) {

  // Create a color scale using D3
  const colorScale = d3
    .scaleSequential(d3.interpolatePlasma)
    .domain([VMIN, VMAX]); // Set VMIN and VMAX as your desired min and max values

  // Create a colorbar element
  const colorbar = d3.select("body").append("div").attr("class", "colorbar");

  colorbar
    .append("svg")
    .attr("width", 300) // Adjust the width as needed
    .attr("height", 12) // Adjust the height as needed
    .attr("rx", 10)
    .append("g")
    .selectAll("rect")
    .data(d3.range(VMIN, VMAX, (VMAX - VMIN) / 100)) // Adjust the number of color segments as needed
    .enter()
    .append("rect")
    .attr("height", 20)
    .attr("width", 3) // Adjust the width of each color segment

    .attr("x", (d, i) => i * 3)
    .attr("fill", (d) => colorScale(d));

  // Define custom scale labels
  const scaleLabels = generateScale(VMIN, VMAX, 300);

  // Create a container for horizontal scale labels
  const scaleLabelContainer = colorbar
    .append("div")
    .attr("class", "scale-label-container");

  // Create scale label elements horizontally
  scaleLabelContainer
    .selectAll("div")
    .data(scaleLabels)
    .enter()
    .append("div")
    .attr("class", "colorbar-scale-label-horizontal")
    .text((d) => d); // Set the label text

  // Add the label "Methane enhancement (ppm m)" under the scale labels
  colorbar
    .append("div")
    .attr("class", "colorbar-label")
    .style("text-align", "center") // Center the label
    .style("margin-bottom", "12px") // Adjust margin as needed
    .html(`<span class="custom-label"> <strong>Methane enhancement (ppm m) </strong></span>`);

  // Add CSS styles to position and style the colorbar
  colorbar
    .style("position", "absolute")
    .style("bottom", "30px") // Adjust the top position as needed
    .style("right", "50px") // Adjust the left position as needed
    .style("background-color", "white")
    .style("padding", "12px");

  // Add CSS styles to style horizontal scale labels
  scaleLabelContainer
    .style("display", "flex")
    .style("justify-content", "space-between")
    .style("margin-bottom", "12px"); // Adjust margin as needed
}

function addTimelineMarkers(utcTimesObserved, start_date, end_date) {
  const slider = document.querySelector('.mapboxgl-ctrl-timeline__slider');
  const sliderRect = slider.getBoundingClientRect();
  const parentRect = slider.parentNode.getBoundingClientRect();
  const existingMarkers = slider.parentNode.querySelectorAll('.timeline-marker');
  existingMarkers.forEach(marker => marker.remove());
  const offsetLeftStart = sliderRect.left - parentRect.left;
  slider.parentNode.style.position = 'relative';

  // Function to create a marker
  function createMarker(color, leftOffset) {
      const marker = document.createElement('div');
      marker.style.position = 'absolute';
      marker.style.width = '4px';
      marker.style.height = `6px`;
      marker.style.opacity = '0.2';
      marker.style.backgroundColor = color;
      marker.style.borderRadius = '50%';
      marker.style.left = `${leftOffset}px`;
      marker.style.top = `${slider.offsetTop - 1}px`;
      slider.parentNode.appendChild(marker);
  }
  const startTime = new Date(start_date).getTime();
  const endTime = new Date(end_date).getTime();
  const totalDuration = endTime - startTime;

  utcTimesObserved.forEach(timeObserved => {
      const observedTime = new Date(timeObserved).getTime();
      const relativePosition = (observedTime - startTime) / totalDuration;
      const observedOffsetLeft = offsetLeftStart + (relativePosition * sliderRect.width);
      createMarker('black', observedOffsetLeft);
      console.log(observedOffsetLeft)
  });
}

module.exports = {
    filterByDates: filterByDates,
    createColorbar: createColorbar,
    addTimelineMarkers: addTimelineMarkers
  };