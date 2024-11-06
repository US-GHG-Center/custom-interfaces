
const styleOptions = {
    fillColor: "rgba(173, 216, 230, 0.5)",
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

    // Add a black outline around the polygon.
    map.addLayer({
        'id': `outline-${polygonLayerId}`,
        'type': 'line',
        'source': polygonSourceId,
        'layout': {},
        'paint': {
            'line-color':styleOptions["lineColor"],
            'line-width': styleOptions["lineWidth"]
        }
    });

}

function removeLayers(map, sourceId, layersIds) {
    layersIds.forEach(layerId => {
        if (map.getLayer(layerId)) {
            map.removeLayer(layerId)
        }
    });
    if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
    }
}

function addCoverage(map, currentCov){
    if (document.getElementById("showCoverage").checked) {
        if (map.getLayer("coverage")){
            removeLayers(map, "coverage", ['coverage','outline-coverage']);
        }
        addPolygon(map, "coverage", "coverage",currentCov);

    } else {
        removeLayers(map, "coverage", ['coverage','outline-coverage']);
    }
}

module.exports = {
    addCoverage: addCoverage,
    removeLayers: removeLayers
  };