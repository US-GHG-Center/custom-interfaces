
const styleOptions = {
    fillColor: "rgba(173, 216, 230, 0.4)",
    lineColor: "transparent",
    lineWidth: 1,
    fillOutlineColor: "#1E90FF"

};

function addPolygon(map, polygonSourceId, polygonLayerId, polygonFeature) {
    if (!map.getSource(polygonSourceId)){
    map.addSource(polygonSourceId, {
        type: "geojson",
        data: polygonFeature,
    });
    }
    map.addLayer({
        id: polygonLayerId,
        type: "fill",
        source: polygonSourceId,

        layout: {},
        paint: {
            "fill-outline-color": styleOptions["fillOutlineColor"],
            'fill-color': styleOptions["fillColor"]
        },
    });

    // always keep the coverage layer below the rasters
    const layers = map.getStyle().layers;
    const rasterLayers = layers.filter(layer => layer.id.startsWith('raster-'));
    if (rasterLayers.length > 0) {
        const firstRasterLayerId = rasterLayers[0].id;
        map.moveLayer(polygonLayerId, firstRasterLayerId);
    }

}

function removeLayers(map, sourceId, layerId) {


    if (map.getLayer(layerId)) {
        map.removeLayer(layerId)
    }

    if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
    }
}
function checkToggle(map, coverageData, startDate, stopDate){
    if ($('#showCoverage').is(':checked')){
        removeLayers(map, "coverage", 'coverage')
        addCoverage(map, coverageData, "coverage", startDate,stopDate)
    }
    else {
        removeLayers(map, "coverage", 'coverage')
    }
}

function addCoverage(map, geojsonData, layerId, startDate, stopDate) {
    // Convert startDate and endDate to Date objects for comparison
    const start = new Date(startDate);
    const end = new Date(stopDate);

    // Filter features within the date range
    const filteredFeatures = geojsonData.features.filter(feature => {
        const featureStartTime = new Date(feature.properties.start_time);
        
        // Check if the feature's time range overlaps with the given date range
        return (featureStartTime >= start && featureStartTime <= end);
    });

    // Create a new GeoJSON object with the filtered features
    const filteredGeoJSON = {
        ...geojsonData,
        features: filteredFeatures
    };

    addPolygon(map, layerId, layerId,filteredGeoJSON)
}

function addCoverageToggleListener(map, coverageData) {
    // Event listener for the toggle button
    document.getElementById('showCoverage').addEventListener('change', function() {
        // Get the current values from the slider
        let sliderValues = $("#slider-range").slider("values");
        let startDate = new Date(sliderValues[0] * 1000);
        let stopDate = new Date(sliderValues[1] * 1000);
        startDate.setUTCHours(0, 0, 0, 0);
        stopDate.setUTCHours(23, 59, 59, 0);

        checkToggle(map, coverageData, startDate, stopDate)
    });
}

module.exports = {
    addCoverage: addCoverage,
    removeLayers: removeLayers,
    checkToggle: checkToggle,
    addCoverageToggleListener:addCoverageToggleListener
  };