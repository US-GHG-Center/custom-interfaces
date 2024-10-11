const mapboxgl = require("mapbox-gl");
const path = require('path');
import "./style.css";
const {
    createColorbar,
    displayPropertiesWithD3,
    dragElement
} = require("./helper");

const VMIN = 0;
const VMAX = 1500;
const IDS_ON_MAP = new Set();
const RASTER_IDS_ON_MAP = new Set();
const MARKERS_ON_MAP = new Set();
const POLYGON_ADDED = new Set();
const MAP_STYLE = process.env.MAP_STYLE;
const PUBLIC_URL = process.env.PUBLIC_URL || ".";
const ZOOM_THRESHOLD = 8;
mapboxgl.accessToken = process.env.MAP_ACCESS_TOKEN;

const markerClickTracker = new Array(2);

const markerProps = new Object();

var counter_clicks_marker = 0;

var layerToggled = true;
var polygons;
var itemIds;

const map = new mapboxgl.Map({
    container: "map",
    style: MAP_STYLE, // You can choose any Mapbox style
    center: [-98, 39], // Initial center coordinates
    zoom: 4, // Initial zoom level
});
// disable map rotation using right click + drag
map.dragRotate.disable();

// disable map rotation using touch rotation gesture
map.touchZoomRotate.disableRotation();

class HomeButtonControl {
    onClick() {
        // Set the map's center and zoom to the desired location
        map.flyTo({
            center: [-98, 39], // Replace with the desired latitude and longitude
            zoom: 4,
        });
        $("#display_props").css({
            "visibility": "hidden"
        });

        // For each element in counter_clicker set the unvisible to visible
        markerClickTracker.forEach((element) => {
            element.style.visibility = "visible";
        });

    }
    onAdd(map) {
        this.map = map;
        this.container = document.createElement("div");
        this.container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
        this.container.addEventListener("contextmenu", (e) => e.preventDefault());
        this.container.addEventListener("click", (e) => this.onClick());
        this.container.innerHTML =
            '<div class="tools-box">' +
            "<button>" +
            '<span class="mapboxgl-ctrl-icon btn fa fa-refresh" aria-hidden="true" title="Reset To USA"></span>' +
            "</button>" +
            "</div>";
        return this.container;
    }
    onRemove() {
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }
}

class LayerButtonControl {
    onClick() {
        $("#layer-eye").toggleClass("fa-eye fa-eye-slash");
        // Toggle layer visibility
        layerToggled = !layerToggled;
        // Set the map's center and zoom to the desired location
        RASTER_IDS_ON_MAP.forEach((raster_id_on_map) => {

            try {
                const layerID = "raster-layer-" + raster_id_on_map.id;
                const layerDate = new Date(raster_id_on_map.properties["UTC Time Observed"]);
                const startDate = new Date($("#slider-range").slider("values", 0) * 1000)
                const stopDate = new Date($("#slider-range").slider("values", 1) * 1000)
                const boolDisplay = layerToggled && layerDate >= startDate && layerDate <= stopDate;
                showHideLayers([layerID], boolDisplay)
                $("#display_props").css({
                    "visibility": boolDisplay ? "visible" : "hidden"
                });

            } catch (error) {
                console.error(error);
            }
        });
    }
    onAdd(map) {
        this.map = map;
        this.container = document.createElement("div");
        this.container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
        this.container.addEventListener("contextmenu", (e) => e.preventDefault());
        this.container.addEventListener("click", (e) => this.onClick());
        this.container.innerHTML =
            '<div class="tools-box">' +
            "<button>" +
            '<span id="layer-eye" class="mapboxgl-ctrl-icon btn fa fa-eye" aria-hidden="true" title="Show/Hide layers"></span>' +
            "</button>" +
            "</div>";
        return this.container;
    }
    onRemove() {
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }
}

map.addControl(new HomeButtonControl());
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.ScaleControl());
map.addControl(new LayerButtonControl());

function showHideLayers(layersIds, show) {

    layersIds.forEach(layerId => {
        if (map.getLayer(layerId)) {
            map.setLayoutProperty(
                layerId,
                "visibility",
                show ?
                "visible" :
                "none"
            );
        }
    });

}

function removeLayers(sourceId, layersIds) {
    if (map.getSource(sourceId)) {
        layersIds.forEach(layerId => {
            if (map.getLayer(layerId)) {
                map.removeLayer(layerId)
            }
        });
        map.removeSource(sourceId);
    }
}

function addCoverage(map, geojsonData, layerId, startDate, endDate) {
    // Convert startDate and endDate to Date objects for comparison
    const start = new Date(startDate);
    const end = new Date(endDate);
    console.log(start, end);

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

    console.log('Filtered GeoJSON:', JSON.stringify(filteredGeoJSON, null, 2));
    console.log('GeoJSON:', JSON.stringify(geojsonData, null, 2));
    addPolygon(layerId, layerId,filteredGeoJSON,"#1E90FF","rgba(173, 216, 230, 0.6)","transparent",0 )
}


function addPolygon(polygonSourceId, polygonLayerId, polygonFeature, fillOutlineColor, fillColor, lineColor, lineWidth) {

    if (!map.getSource(polygonSourceId)) {

        map.addSource(polygonSourceId, {
            type: "geojson",
            data: polygonFeature,
        });
    }
    if (!map.getLayer(polygonLayerId)) {
        map.addLayer({
            id: polygonLayerId,
            type: "fill",
            source: polygonSourceId,

            layout: {},
            paint: {
                "fill-outline-color": fillOutlineColor,
                'fill-color': fillColor
            },
        });

        // Add a black outline around the polygon.
        map.addLayer({
            'id': `outline-${polygonLayerId}`,
            'type': 'line',
            'source': polygonSourceId,
            'layout': {},
            'paint': {
                'line-color':lineColor,
                'line-width': lineWidth
            }
        });

    }
}

function addRaster(itemProps, feature, polygonId, fromZoom) {
    var props = feature.properties;
    const collection = "emit-ch4plume-v1";
    const assets = "ch4-plume-emissions";

    if (!IDS_ON_MAP.has(feature.id)) {

        const TILE_URL =
            `https://earth.gov/ghgcenter/api/raster/collections/${collection}/tiles/WebMercatorQuad/{z}/{x}/{y}@1x` +
            "?item=" +
            itemProps.id +
            "&assets=" +
            assets +
            "&bidx=1&colormap_name=plasma&rescale=" +
            VMIN +
            "%2C" +
            VMAX +
            "&nodata=-9999";

        map.addSource("raster-source-" + feature.id, {
            type: "raster",
            tiles: [TILE_URL],
            tileSize: 256,
            bounds: itemProps.bbox,
        });
        const layer_id = "raster-layer-" + feature.id
        map.addLayer({
            id: layer_id,
            type: "raster",
            source: "raster-source-" + feature.id,
            paint: {},
        });

        // Check if the eye is open, if so add the layer
        showHideLayers([layer_id], layerToggled)

        map.moveLayer(polygonId);
        RASTER_IDS_ON_MAP.add(feature);

        IDS_ON_MAP.add(feature.id);
    }
    // If not coming from map zoom fly to position
    if (!fromZoom) {
        map.flyTo({
            center: [
                props["Longitude of max concentration"],
                props["Latitude of max concentration"],
            ], // Zoom to the marker's coordinates
            zoom: 14, // Set the zoom level when the marker is clicked
            // essential: true, // This ensures a smooth animation
        });

    }

    displayPropertiesWithD3(props);
    dragElement(document.getElementById("display_props"))

}

function handleSearch(keyword) {
    let plumeIds = new Array()
    MARKERS_ON_MAP.forEach(marker => {
        plumeIds.push(`${marker.feature.properties["Plume ID"]} (${marker.feature.properties["Location"]})`)

    })

    plumeIds.sort((a, b) => {
        return getSimilarity(b, keyword) - getSimilarity(a, keyword)
    })
    plumeIds = plumeIds.filter(plume_id => {
        return getSimilarity(plume_id, keyword) > 0
    })
    return plumeIds;
}

function getSimilarity(data, keyword) {
    data = data.toLowerCase()
    keyword = keyword.toLowerCase()
    return data.length - data.replace(new RegExp(keyword, 'g'), '').length
}

function drawplume_idList(_plume_ids) {
    $('.autocomplete-search-box .search-result').html('')
    for (let i = 0; i < _plume_ids.length; i++) {
        $('.autocomplete-search-box .search-result').append(`<li class="plume_ids">${_plume_ids[i]}</li>`)
    }
}

document.addEventListener("click", function(e) {
    if (e.target && e.target.nodeName === "LI" && e.target.classList.contains('plume_ids')) {
        let text = e.target.textContent || e.target.innerText
        $('.search-box').val(text);
        drawplume_idList([]);
        MARKERS_ON_MAP.forEach(marker => {
            if (text.split(" ")[0] === marker.feature.properties["Plume ID"]) {
                let plumeName = path.basename(marker.feature.properties["Data Download"]);
                let mark_polygon = polygons[marker.id];
                addPolygon(
                    "polygon-source-" + marker.id,
                    "polygon-layer-" + marker.id,
                    mark_polygon.feature,
                    "#20B2AA",
                    "transparent",
                    "#20B2AA",
                    3
                )
                addRaster(itemIds[plumeName], marker.feature, "polygon-layer-" + marker.id, false)

                return true;
            }
        })

    } else {
        $('.search-box').val("");
        drawplume_idList([]);
    }
});




async function main() {

    map.on("load", async () => {
        const covearageData = await (
            await fetch(`${PUBLIC_URL}/data/coverage.geojson`)
        ).json();
        const methanMetadata = await (
            await fetch(`${PUBLIC_URL}/data/combined_plume_metadata.json`)
        ).json();
        itemIds = await (
            await fetch(`${PUBLIC_URL}/data/methane_stac.geojson`)
        ).json();
        const features = methanMetadata.features;

        $("#lds-roller-id").css({
            'display': 'none'
        });

        polygons = features
            .filter((f) => f.geometry.type === "Polygon")
            .map((f, i) => ({
                id: i,
                feature: f
            }));
        const points = features
            .filter((f) => f.geometry.type === "Point")
            .map((f, i) => ({
                id: i,
                feature: f
            }))
            .sort((prev, next) => {
                const prev_date = new Date(prev.feature.properties["UTC Time Observed"]).getTime();
                const next_date = new Date(next.feature.properties["UTC Time Observed"]).getTime();
                return prev_date - next_date
            });

        createColorbar(VMIN, VMAX);
        document.getElementById('toggleCoverage').addEventListener('change', function() {
            if (this.checked) {
              console.log('Coverage layer enabled');
              // TODO: take the start and end dates from the date slider
              addCoverage(map, covearageData, "coverage-layer", "2022-08-10T03:47:12Z","2024-09-10T06:44:12Z")
              // Add your code to show the coverage layer
            } else {
              console.log('Coverage layer disabled');
              removeLayers("coverage-layer",["coverage-layer"]);

              // Add your code to hide the coverage layer
            }
          });


        // Filter and set IDs for points
        features
            .filter((f) => f.geometry.type === "Point")
            .map((f, i) => {
                f.id = i;
                return f;
            })

        points.forEach(function(point) {
            const itemName = path.basename(point.feature.properties["Data Download"]);
            const coords = point.feature.geometry.coordinates
            const markerEl = document.createElement("div");
            markerEl.className = "marker";
            markerEl.id = `marker-${point.id}`;
            const marker = new mapboxgl.Marker(markerEl)
                .setLngLat([coords[0], coords[1]])
                .addTo(map);

            MARKERS_ON_MAP.add(point);

            const localProps = point.feature.properties

            const tooltipContent = `
        <strong> Max Methane Enh: <span style="color: red">${localProps["Max Plume Concentration (ppm m)"]} (ppm m)</span></strong><br>
        Latitude (max conc): ${coords[1].toFixed(3)}<br>
        Longitude (max conc): ${coords[0].toFixed(3)}<br>
        Time Observed: ${localProps["UTC Time Observed"]}
        `;

            const popup = new mapboxgl.Popup().setHTML(tooltipContent);
            const polygon = polygons[point.id];
            const polygonSourceId = "polygon-source-" + polygon.id;
            const polygonLayerId = "polygon-layer-" + polygon.id

            marker.setPopup(popup);

            marker.getElement().addEventListener("mouseenter", () => {
                popup.addTo(map);
            });

            marker.getElement().addEventListener("mouseleave", () => {
                popup.remove();
            });

            markerProps["point-layer-" + point.id] = marker;

            map.on('mouseenter', polygonLayerId, () => {
                map.getCanvas().style.cursor = 'pointer';
                popup.addTo(map);
            });

            map.on('mouseleave', polygonLayerId, () => {
                map.getCanvas().style.cursor = '';
                popup.remove();
            });

            map.on('click', polygonLayerId, () => {
                addPolygon(
                    polygonSourceId,
                    polygonLayerId,
                    polygon.feature,
                    "#20B2AA",
                    "transparent",
                    "#20B2AA",
                    3
                );

                if (map.getSource("raster-source-" + point.feature.id)) {
                    removeLayers(
                        "raster-source-" + point.feature.id,
                        ["raster-layer-" + point.feature.id]

                    )
                    RASTER_IDS_ON_MAP.delete(point.feature);
                    IDS_ON_MAP.delete(point.feature.id)
                } else {
                    addRaster(
                        itemIds[itemName],
                        point.feature,
                        polygonLayerId,
                        true
                    );

                }

            });

            marker.getElement().addEventListener("click", (e) => {

                counter_clicks_marker += 1

                if (counter_clicks_marker % 2 == 0) {
                    markerClickTracker[0] = e.target
                    markerClickTracker[0].style.visibility = "hidden"
                    if (markerClickTracker[1]) {
                        markerClickTracker[1].style.visibility = "visible"
                    }

                } else {
                    markerClickTracker[1] = e.target
                    markerClickTracker[1].style.visibility = "hidden"
                    if (markerClickTracker[0]) {
                        markerClickTracker[0].style.visibility = "visible"
                    }
                }

                addPolygon(
                    polygonSourceId,
                    polygonLayerId,
                    polygon.feature,
                    "#20B2AA",
                    "transparent",
                    "#20B2AA",
                    3
                )

                addRaster(
                    itemIds[itemName],
                    point.feature,
                    polygonLayerId
                );

            });

        })

        $(function() {
            //

            const firstPoint = points[0].feature.properties["UTC Time Observed"];
            const lastPoint = points[points.length - 1].feature.properties["UTC Time Observed"];

            var minStartDate = new Date(firstPoint)
            minStartDate.setUTCHours(0, 0, 0, 0)
            var maxStopDate = new Date(lastPoint)
            maxStopDate.setUTCHours(23, 59, 59, 0)

            $("#slider-range").slider({
                range: true,
                min: minStartDate.getTime() / 1000,
                max: maxStopDate.getTime() / 1000,
                step: 86400,
                values: [
                    minStartDate.getTime() / 1000,
                    maxStopDate.getTime() / 1000,
                ],
                slide: function(event, ui) {

                    let startDate = new Date(ui.values[0] * 1000);
                    let stopDate = new Date(ui.values[1] * 1000);
                    startDate.setUTCHours(0, 0, 0, 0)
                    stopDate.setUTCHours(23, 59, 59, 0)

                    for (const point of points) {
                        // let polygon_visiblity = 'visible'
                        let layerID = "point-layer-" + point.id;
                        // let polygonID = "polygon-layer-" + point.id
                        let point_date = new Date(
                            point.feature.properties["UTC Time Observed"]
                        );

                        if (point_date >= startDate && point_date <= stopDate) {

                            markerProps[layerID].addTo(map);
                            showHideLayers([`polygon-layer-${point.id}`, `outline-polygon-layer-${point.id}`], true)
                            MARKERS_ON_MAP.add(point);

                        } else {
                            markerProps[layerID].remove();
                            showHideLayers([`polygon-layer-${point.id}`, `outline-polygon-layer-${point.id}`], false)

                            MARKERS_ON_MAP.delete(point);

                        }

                    }

                    for (const feature of RASTER_IDS_ON_MAP) {
                        let layerID = "raster-layer-" + feature.id;
                        let point_date = new Date(feature.properties["UTC Time Observed"]);
                        let boolDisplay = layerToggled && point_date >= startDate && point_date <= stopDate;
                        showHideLayers([layerID], boolDisplay)
                        $("#display_props").css({
                            "visibility": boolDisplay ? "visible" : "hidden"
                        });

                    }

                    $("#amount").val(
                        startDate.toUTCString().slice(0, -13) + " - " + stopDate.toUTCString().slice(0, -13)
                    );
                },
            });
            var startDate = new Date($("#slider-range").slider("values", 0) * 1000);
            var stopDate = new Date($("#slider-range").slider("values", 1) * 1000);
            $("#amount").val(
                startDate.toUTCString().slice(0, -13) + " - " + stopDate.toUTCString().slice(0, -13)
            );
        });

        let typingTimeout = null;
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            $('.search-box').keyup((e) => {
                const copy_procedures = handleSearch($(e.target).val())
                drawplume_idList(copy_procedures);
            })
        }, 500);

    });
}

map.on('zoomend', () => {
    const currentZoom = map.getZoom();

    if (currentZoom > ZOOM_THRESHOLD) {
        const bounds = map.getBounds();

        MARKERS_ON_MAP.forEach(marker => {
            const coords = marker.feature.geometry.coordinates;
            const lngLat = new mapboxgl.LngLat(coords[0], coords[1]);
            // Check if the point is within the bounds
            const isWithinBounds = bounds.contains(lngLat);

            if (isWithinBounds) {
                $(`#marker-${marker.id}`).css({
                    "visibility": "hidden"
                });
                const polygon = polygons[marker.id];
                addPolygon(
                    `polygon-source-${polygon.id}`,
                    `polygon-layer-${polygon.id}`,
                    polygon.feature,
                    "#20B2AA",
                    "transparent",
                    "#20B2AA",
                    3
                );
                POLYGON_ADDED.add(polygon);
            }

        });

    } else {
        POLYGON_ADDED.forEach(polygonAdded => {
            const polygonLayerId = `polygon-layer-${polygonAdded.id}`
            removeLayers(
                `polygon-source-${polygonAdded.id}`,
                [
                    polygonLayerId,
                    `outline-${polygonLayerId}`
                ]

            );
            POLYGON_ADDED.delete(polygonAdded);
            $(`#marker-${polygonAdded.id}`).css({
                "visibility": "visible"
            });

        })
    }

})

main();
