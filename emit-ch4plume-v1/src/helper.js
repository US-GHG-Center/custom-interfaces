// It has no global vars referenced
function filterByDates(data, sDate, eDate, type) {
    // Filter features within the date range for coverage
    if (type === "coverage"){
        const start = new Date(sDate+'Z');
        const end = new Date(eDate+'Z');
        const filteredFeatures = data.features.filter(feature => {
            const featureStartTime = new Date(feature.properties.start_time);
            //skip end date
            // const featureEndTime = new Date(feature.properties.end_time);
            // Check if the feature's time range overlaps with the given date range
            return (featureStartTime >= start && featureStartTime <= end);
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

  // Define colorbar width and height
  const colorbarWidth = 350; // Adjusted width
  const colorbarHeight = 12; // Height of the colorbar
  const numSegments = 100; // Number of color segments


  // Create the SVG container for the colorbar
  const svg = colorbar
    .append("svg")
    .attr("width", colorbarWidth)
    .attr("height", colorbarHeight) // Set the height of the colorbar
    .attr("rx", 10);

  // Add color segments (rectangles)
  svg
    .append("g")
    .selectAll("rect")
    .data(d3.range(VMIN, VMAX, (VMAX - VMIN) / numSegments)) // Number of segments
    .enter()
    .append("rect")
    .attr("height", colorbarHeight) // Match the height of the colorbar
    .attr("width", colorbarWidth / numSegments) // Dynamically calculate width of each segment
    .attr("x", (d, i) => (i * (colorbarWidth / numSegments)) ) // Shift by 25px to center the rects
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
    .style("text-align","left")
    .text((d) => d); // Set the label text

  // Add the label "Methane enhancement (ppm m)" under the scale labels
  colorbar
    .append("div")
    .attr("class", "colorbar-label")
    .style("text-align", "center") // Center the label
    .style("margin-bottom", "12px") // Adjust margin as needed
    .html("<strong>Methane enhancement (ppm m)</strong>");

  // Add CSS styles to position and style the colorbar
  colorbar
    .style("position", "absolute")
    .style("bottom", "20px") // Adjust the top position as needed
    .style("right", "50px") // Adjust the left position as needed
    .style("background-color", "white")
    .style("padding", "12px");

  // Add CSS styles to style horizontal scale labels
  scaleLabelContainer
    .style("display", "flex")
    .style("justify-content", "center")
    .style("margin-bottom", "12px"); // Adjust margin as needed
}

function addTimelineMarkers(utcTimesObserved, start_date, end_date, color, zindex, height,width, radius) {
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
      marker.style.width = `${width}px`;
      marker.style.zIndex= zindex
      marker.style.height = `${height}px`;
      marker.style.opacity = '1';
      marker.style.borderRadius = `${radius}%`;
      marker.style.backgroundColor = color;
      marker.style.left = `${leftOffset}px`;
      marker.style.top = `${slider.offsetTop - (height/2) +2 }px`;
      slider.parentNode.appendChild(marker);
  }
  const startTime = new Date(start_date).getTime();
  const endTime = new Date(end_date).getTime();
  const totalDuration = endTime - startTime;

  utcTimesObserved.forEach(timeObserved => {
      const observedTime = new Date(timeObserved).getTime();
      const relativePosition = (observedTime - startTime) / totalDuration;
      const observedOffsetLeft = offsetLeftStart + (relativePosition * sliderRect.width);
      createMarker(color, observedOffsetLeft);
  });
}

function beforeAnimation(map){
  map.dragPan.disable();
  map.scrollZoom.disable();
  map.boxZoom.disable();

  document.getElementById("plegend-container").style.display ='none';
  // const start_date = document.getElementById("start_date").value;
  // const end_date = document.getElementById("end_date").value;
  // console.log("paila ko format", start_date)
  // console.log("aba ko format", getSliderValues())
  const {s:start_date, e:end_date} = getSliderValues();
  const cov = document.getElementById("showCoverage").checked;
  preservedState = {
      dates: {
          startDate:start_date,
          endDate: end_date
      },
      coverage: cov,
  }
  $("#slider-range").slider("disable");
  $("#slider-range").css("opacity", "0.4"); 
  $("#amount").css("opacity", 0); 
  document.querySelector('.mapboxgl-ctrl button.mapboxgl-ctrl-zoom-in').disabled = true;
  document.querySelector('.mapboxgl-ctrl button.mapboxgl-ctrl-zoom-out').disabled = true;
  document.getElementById('refresh').disabled = true;
  document.querySelector('.autocomplete-search-box .search-box').disabled = true;
  document.getElementById('showCoverage').disabled = true;

  document.querySelector('.autocomplete-search-box .search-box').style.opacity = '0.4'
  document.querySelector('.slider').style.opacity = '0.4';

  document.querySelectorAll('input[type="datetime-local"]').forEach(input => {
      input.disabled = true;
      input.style.opacity = '0.4';
  });
  return {start_date, end_date, cov}
}

function afterAnimation(map, preservedState){
  map.dragPan.enable();
  map.scrollZoom.enable();
  map.boxZoom.enable();

  $("#slider-range").slider("enable");
  $("#slider-range").css("opacity", "1"); 
  const sDate= new Date(preservedState.startDate).getTime()/1000;
  const eDate= new Date(preservedState.endDate).getTime()/1000;
  $("#slider-range").slider("values", [sDate, eDate]);
  $("#amount").css("opacity", 1); 
  document.querySelector('.mapboxgl-ctrl button.mapboxgl-ctrl-zoom-in').disabled = false;
  document.querySelector('.mapboxgl-ctrl button.mapboxgl-ctrl-zoom-out').disabled = false;
  document.getElementById('refresh').disabled = false;
  document.querySelector('.autocomplete-search-box .search-box').disabled = false;
  document.getElementById('showCoverage').disabled = false;

  document.querySelector('.autocomplete-search-box .search-box').style.opacity = '1'
  document.querySelector('.slider').style.opacity = '1';

  // const dateInputs = document.querySelectorAll('input[type="datetime-local"]');
  // dateInputs.forEach(input => {
  //     input.disabled = false;
  //     input.style.opacity = '1'; 
  // });
  // Restore dates and coverage
  document.getElementById("showCoverage").checked = preservedState.coverage;
  // document.getElementById("start_date").value = preservedState.startDate;
  // document.getElementById("end_date").value = preservedState.endDate;
}

function isFeatureWithinBounds(feature, bounds) {
  if (feature.geometry.type !== 'Polygon') return false;

  // Create a bounding box feature from the map bounds
  const boundingBox = turf.bboxPolygon([
    bounds._sw.lng,
    bounds._sw.lat,
    bounds._ne.lng,
    bounds._ne.lat
  ]);

  // Check if the feature intersects with the bounding box
  return turf.booleanIntersects(feature, boundingBox);
}

function initializeDateSlider() {
  const firstPoint = "2022-06-06T00:00:00";
  const lastPoint = "2024-06-06T00:00:00";

  var minStartDate = new Date(firstPoint);
  minStartDate.setUTCHours(0, 0, 0, 0);

  var maxStopDate = new Date(lastPoint);
  maxStopDate.setUTCHours(23, 59, 59, 0);

  // Store a reference to the slider
  dateSlider = $("#slider-range").slider({
    range: true,
    min: minStartDate.getTime() / 1000,  // Convert to seconds
    max: maxStopDate.getTime() / 1000,  // Convert to seconds
    step: 86400,  // Step size of 1 day (86400 seconds)
    values: [minStartDate.getTime() / 1000, maxStopDate.getTime() / 1000],  // Default slider range
    slide: function (event, ui) {
      let startDate = new Date(ui.values[0] * 1000); // Convert to milliseconds
      let stopDate = new Date(ui.values[1] * 1000); // Convert to milliseconds
      startDate.setUTCHours(0, 0, 0, 0);
      stopDate.setUTCHours(23, 59, 59, 0);

      $("#amount").val(
        startDate.toUTCString().slice(0, -13) + " - " + stopDate.toUTCString().slice(0, -13)
      );
    }
  });

  // Set the initial value for the date range in the text input
  var startDate = new Date($("#slider-range").slider("values", 0) * 1000);
  var endDate = new Date($("#slider-range").slider("values", 1) * 1000);

  $("#amount").val(
    startDate.toUTCString().slice(0, -13) + " - " + endDate.toUTCString().slice(0, -13)
  );
}
function formatTimestampToDate(timestamp) {
  const d = new Date(timestamp);  // Convert the timestamp to a Date object
  
  const year = d.getUTCFullYear();  // Get the full year in UTC
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');  // Get the month (0-indexed, so add 1)
  const day = String(d.getUTCDate()).padStart(2, '0');  // Get the day of the month
  const hours = String(d.getUTCHours()).padStart(2, '0');  // Get the hour (UTC)
  const minutes = String(d.getUTCMinutes()).padStart(2, '0');  // Get the minutes (UTC)

  return `${year}-${month}-${day}T${hours}:${minutes}`;  // Return in the desired format
}


function getSliderValues() {
  const dateSlider = document.getElementById("slider-range");
  if (dateSlider) {
    const s= formatTimestampToDate($("#slider-range").slider("values", 0) * 1000)
    const e= formatTimestampToDate($("#slider-range").slider("values", 1) * 1000)
    return {s,e}
  } else {
    console.log("Slider is not initialized yet.");
  }
}

module.exports = {
    filterByDates: filterByDates,
    createColorbar: createColorbar,
    addTimelineMarkers: addTimelineMarkers,
    afterAnimation: afterAnimation,
    beforeAnimation: beforeAnimation,
    isFeatureWithinBounds: isFeatureWithinBounds,
    initializeDateSlider: initializeDateSlider,
    getSliderValues: getSliderValues,
    formatTimestampToDate: formatTimestampToDate
  };