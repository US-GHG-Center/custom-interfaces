
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

    // Add a black outline around the polygon.
    // map.addLayer({
    //     'id': `outline-${polygonLayerId}`,
    //     'type': 'line',
    //     'source': polygonSourceId,
    //     'layout': {},
    //     'paint': {
    //         'line-color': styleOptions["lineColor"],
    //         'line-width': styleOptions["lineWidth"]
    //     }
    // });


    // always keep the coverage layer below the rasters
    const layers = map.getStyle().layers;
    const rasterLayers = layers.filter(layer => layer.id.startsWith('raster-'));
    if (rasterLayers.length > 0) {
        const firstRasterLayerId = rasterLayers[0].id;
        map.moveLayer(polygonLayerId, firstRasterLayerId);
    }

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
            //removeLayers(map, "coverage", ['coverage','outline-coverage']);
            removeLayers(map, "coverage", ['coverage']);
        }
        addPolygon(map, "coverage", "coverage",currentCov);

    } else {
        //removeLayers(map, "coverage", ['coverage','outline-coverage']);
        removeLayers(map, "coverage", ['coverage']);
    }
}

module.exports = {
    addCoverage: addCoverage,
    removeLayers: removeLayers
  };