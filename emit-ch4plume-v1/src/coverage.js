

import {removeLayers,addPolygon} from './index.js'

// Styling for coverage
const styleOptions = {
    fillColor: "rgba(173, 216, 230, 0.5)",
    lineColor: "transparent",
    lineWeight: 1,
    fillOutlineColor: "#1E90FF"

};

// Check if toggle is on and add/remove layer accordingly
export function checkToggle(map, coverageData, startDate, stopDate){
    if ($('#toggleCoverage').is(':checked')){
        removeLayers("coverage-layer", ['coverage-layer','outline-coverage-layer'])
        addCoverage(map, coverageData, "coverage-layer", startDate,stopDate),styleOptions['fillOutlineColor'],styleOptions['fillColor'],styleOptions['lineColor'],styleOptions['lineWeight']
    }
    else {
        removeLayers("coverage-layer", ['coverage-layer','outline-coverage-layer'])
    }
}

export function addCoverageToggleListener(map, coverageData) {
    // Event listener for the toggle button
    document.getElementById('toggleCoverage').addEventListener('change', function() {
        // Get the current values from the slider
        let sliderValues = $("#slider-range").slider("values");
        let startDate = new Date(sliderValues[0] * 1000);
        let stopDate = new Date(sliderValues[1] * 1000);
        startDate.setUTCHours(0, 0, 0, 0);
        stopDate.setUTCHours(23, 59, 59, 0);

        checkToggle(map, coverageData, startDate, stopDate)
    });
}


export function addCoverage(map, geojsonData, layerId, startDate, stopDate) {
    // Convert startDate and endDate to Date objects for comparison
    const start = new Date(startDate);
    const end = new Date(stopDate);

    // Filter features within the date range
    const filteredFeatures = geojsonData.features.filter(feature => {
        const featureStartTime = new Date(feature.properties.start_time);
        const featureEndTime = new Date(feature.properties.end_time);
        
        // Check if the feature's time range overlaps with the given date range
        return (featureStartTime >= start && featureEndTime <= end);
    });

    // Create a new GeoJSON object with the filtered features
    const filteredGeoJSON = {
        ...geojsonData,
        features: filteredFeatures
    };

    addPolygon(layerId, layerId,filteredGeoJSON,
        styleOptions['fillOutlineColor'],styleOptions['fillColor'],styleOptions['lineColor'],styleOptions['lineWeight'])
}

