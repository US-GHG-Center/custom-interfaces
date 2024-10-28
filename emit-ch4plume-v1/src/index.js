const mapboxgl = require("mapbox-gl");
const path = require('path');
import "./style.css";
const {
    createColorbar,
    displayPropertiesWithD3,
    dragElement,
} = require("./helper");

const VMIN = 0;
const VMAX = 1500;


const MAP_STYLE = process.env.MAP_STYLE;
const PUBLIC_URL = process.env.PUBLIC_URL || ".";
const ZOOM_THRESHOLD = 12;
mapboxgl.accessToken = process.env.MAP_ACCESS_TOKEN;

// Styling for coverage
const styleOptions = {
    fillColor: "rgba(173, 216, 230, 0.5)",
    lineColor: "transparent",
    lineWeight: 1,
    fillOutlineColor: "#1E90FF"

};

const methanMetadata = await (
    await fetch(`${PUBLIC_URL}/data/combined_plume_metadata.json`)
).json();
const itemIds = await (
    await fetch(`${PUBLIC_URL}/data/methane_stac.geojson`)
).json();
const coverageData = await (
    await fetch(`${PUBLIC_URL}/data/coverage.geojson`)
).json();

let ALLPOLYGONS = Array();
let MARKERS_ON_VIEWPORT = Array();
let MARKERS_ON_MAP = Array();
let CURRENTCOVERAGE;


//filters
let toggleSwitch = document.getElementById("showCoverage");
let startDate = document.getElementById("start_date").value;
let endDate = document.getElementById("end_date").value;

// Add event listeners to filters
document.getElementById("start_date").addEventListener('change', updateDatesandData);
document.getElementById("end_date").addEventListener('change', updateDatesandData);
toggleSwitch.addEventListener("change", addCoverage);

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

// createColorbar(VMIN, VMAX);

// function showHideLayers(layersIds, show) {

//     layersIds.forEach(layerId => {
//         if (map.getLayer(layerId)) {
//             map.setLayoutProperty(
//                 layerId,
//                 "visibility",
//                 show ?
//                 "visible" :
//                 "none"
//             );
//         }
//     });

// }

export function removeLayers(sourceId, layersIds) {
    layersIds.forEach(layerId => {
        if (map.getLayer(layerId)) {
            map.removeLayer(layerId)
        }
    });
    if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
    }
}

export function addPolygon(polygonSourceId, polygonLayerId, polygonFeature, fillOutlineColor, fillColor, lineColor, lineWidth) {
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

function addCoverage(){
    if (toggleSwitch.checked) {
        if (map.getLayer("coverage")){
            removeLayers("coverage", ['coverage','outline-coverage']);
        }
        addPolygon("coverage", "coverage",CURRENTCOVERAGE,
        styleOptions['fillOutlineColor'],styleOptions['fillColor'],styleOptions['lineColor'],styleOptions['lineWeight']);

    } else {
        removeLayers("coverage", ['coverage','outline-coverage']);
    }
}

function updateDatesandData(){
    startDate =  document.getElementById("start_date").value;
    endDate = document.getElementById("end_date").value;
    CURRENTCOVERAGE = filterByDates(coverageData,startDate, endDate, "coverage");
    const points = filterByDates(methanMetadata,startDate, endDate, "plumes" ).features
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
    MARKERS_ON_MAP = points;
    addCoverage();
    addPointsOnMap(MARKERS_ON_MAP);
    zoomedOrDraggedToThreshold();
};


function addRaster(itemId, feature, polygonId, fromZoom) {
    const collection = "emit-ch4plume-v1";
    const assets = "ch4-plume-emissions";
    const bbox = itemIds[itemId +".tif"]["bbox"];
    
    const TILE_URL =
        `https://earth.gov/ghgcenter/api/raster/collections/${collection}/tiles/WebMercatorQuad/{z}/{x}/{y}@1x` +
        "?item=" +
        itemId +
        "&assets=" +
        assets +
        "&bidx=1&colormap_name=plasma&rescale=" +
        VMIN +
        "%2C" +
        VMAX +
        "&nodata=-9999";

    map.addSource("raster-" + itemId + "-source", {
        type: "raster",
        tiles: [TILE_URL],
        tileSize: 256,
        bounds: bbox,
    });
    const layer_id = "raster-" + itemId
    console.log("adding..",layer_id );
    map.addLayer({
        id: layer_id,
        type: "raster",
        source: "raster-" + itemId + "-source",
        paint: {},
    });

    // If not coming from map zoom fly to position
    if (!fromZoom) {
        console.log("not from zoom or drag")
    }

}

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

function removeAllPlumeLayers() {
    const layers = map.getStyle().layers;
    
    layers.forEach((layer) => {
        if (layer.id.startsWith('raster-')) {
            map.removeLayer(layer.id);
            if (map.getSource(layer.id + '-source')) {
                map.removeSource(layer.id + '-source');
            }
        }
    });
}

function addRasterHoverListener() {
    // adding listener to raster layer didnt work so i will try putting listener on the marker
    // MARKERS_ON_VIEWPORT.forEach(item => {
    //     const itemId = item.feature.properties['Data Download'].split('/').pop().split('.')[0];
    //     const polygonFeature = ALLPOLYGONS.filter((item) => item.id === itemId)[0];
    //     console.log("adding listeners ", itemId,ALLPOLYGONS, polygonFeature);
    //     console.log("look here",map.getStyle().layers.map(layer => layer.id).includes("raster-" + itemId)); // says true
    //     //check if "raster-"+itemId is in the list of all layers
    //     map.on('click', "raster-"+itemId, () => addPolygon("polygon-source-" + itemId, "polygon-layer-" +itemId, polygonFeature, "black", "transparent", "black", 2));
    //     map.on('mouseleave', "raster-"+itemId, () => removeLayers("polygon-source-" + itemId,["polygon-layer-" +itemId]));
    // });
    MARKERS_ON_VIEWPORT.forEach(marker => {
        const itemId = marker.feature.properties['Data Download'].split('/').pop().split('.')[0];
        const polygonFeature = ALLPOLYGONS.filter((item) => item.id === itemId)[0];
        if (map.getZoom()>= ZOOM_THRESHOLD){
        document.getElementById(`marker-${marker.id}`).addEventListener("mouseenter", () => {
            addPolygon("polygon-source-" + itemId, "polygon-layer-" +itemId, polygonFeature.feature, "orange", "transparent", "orange", 2);
            const selectedItem = document.getElementById("itemDiv-"+itemId);
            selectedItem.style.border = "2px solid orange";
            selectedItem.scrollIntoView({
                behavior: "smooth", // Smooth scroll effect
                block: "center",   // Aligns the elementin center to the visible part of the container as possible
                inline: "center"     // Optionally align horizontally if the container is also scrollable horizontally
            });
        });
        document.getElementById(`marker-${marker.id}`).addEventListener("mouseleave", () => {
            removeLayers("",["polygon-layer-" +itemId, "outline-polygon-layer-" +itemId]);
            const selectedItem = document.getElementById("itemDiv-"+itemId);
            selectedItem.style.border = "1px solid black";
        });
        document.getElementById("itemDiv-"+itemId).addEventListener("mouseenter", () => {
            addPolygon("polygon-source-" + itemId, "polygon-layer-" +itemId, polygonFeature.feature, "orange", "transparent", "orange", 2);
            const selectedItem = document.getElementById("itemDiv-"+itemId);
            selectedItem.style.border = "2px solid orange";
        });
        document.getElementById("itemDiv-"+itemId).addEventListener("mouseleave", () => {
            removeLayers("",["polygon-layer-" +itemId, "outline-polygon-layer-" +itemId]);
            const selectedItem = document.getElementById("itemDiv-"+itemId);
            selectedItem.style.border = "1px solid black";
        });
    }
    });
  }

function zoomedOrDraggedToThreshold(){
    const currentZoom = map.getZoom();
    if (currentZoom >= ZOOM_THRESHOLD){
        MARKERS_ON_VIEWPORT = MARKERS_ON_MAP.filter(marker => {
            const coords = marker.feature.geometry.coordinates;
            const lngLat = new mapboxgl.LngLat(coords[0], coords[1]);
            return  map.getBounds().contains(lngLat); 
        });

        //createPlumesList()
        const legendOuter = document.getElementById("plegend-container");
        legendOuter.style.display ='';

        // Create a container for the heading and additional text
        const headerContainer = document.getElementById("header-container");

        // Create the additional text
        const additionalText = document.getElementById('num-plumes');
        additionalText.innerText = `${MARKERS_ON_VIEWPORT.length} Plumes`; 

        const legendContainer = document.getElementById("plegend");
        legendContainer.innerHTML = ''; // Clear previous entries

        // // Append heading and line to the legend container
        // legendContainer.appendChild(heading);
        removeAllPlumeLayers();
        MARKERS_ON_VIEWPORT.forEach(marker => {
            const properties = marker.feature.properties; // Access properties of the marker
            const itemDiv = document.createElement('div'); // Create a new div
            const itemId = properties['Data Download'].split('/').pop().split('.')[0];
            itemDiv.className = "itemDiv";
            itemDiv.id = "itemDiv-"+itemId;
            const endpoint = `https://dev.ghg.center/api/raster/collections/emit-ch4plume-v1/items/${itemId}/preview.png?bidx=1&assets=ch4-plume-emissions&rescale=1%2C1500&resampling=bilinear&colormap_name=plasma`

            // Set the content of the div (customize as needed)
            itemDiv.innerHTML = `
                <img src="${endpoint}" alt="Thumbnail" style="width: 15%; height: 30px;"/>
                <strong>ID:</strong> ${marker.id}<br>
                <strong>Data Download:</strong> <a href="${properties['Data Download']}" target="_blank">Download</a><br>
                <strong>Max Plume Concentration:</strong> ${properties['Max Plume Concentration (ppm m)']} ppm m<br>
                <strong>UTC Time Observed:</strong> ${properties['UTC Time Observed']}<br>
                <strong>Location:</strong> ${properties['Location']}<br>
            `;

            // Append the new div to the legend container
            legendContainer.appendChild(itemDiv);

            //now add the rasters
            addRaster(itemId, marker.feature, itemId, true);
        });
        addRasterHoverListener();

    }
    else{
        const legendOuter = document.getElementById("plegend-container");
        legendOuter.style.display ='none';
        removeAllPlumeLayers();
    };

}

async function main() {

    map.on("load", async () => {  
        // Get the start and end date filters - global vars
        let startDate = document.getElementById("start_date").value;
        let endDate = document.getElementById("end_date").value;
    
        
        const polygons = methanMetadata.features
        .filter((f) => f.geometry.type === "Polygon")
        .map((f) => {
            const id = f.properties["Data Download"].split('/').pop().split('.')[0]; // Extract "abc" from "http://.../abc.tif"
            return {
                id: id,     
                feature: f
            };
        })
        // Filter the data by dates and select only points
        const points = filterByDates(methanMetadata,startDate, endDate, "plumes" ).features
            .filter((f) => f.geometry.type === "Point")
            .map((f) => {
                const id = f.properties["Data Download"].split('/').pop().split('.')[0]; // Extract "abc" from "http://.../abc.tif"
                return {
                    id: id,     
                    feature: f
                };
            })

        // Set the global vars when the map loads
        ALLPOLYGONS = polygons;
        MARKERS_ON_VIEWPORT = points;
        MARKERS_ON_MAP = points;
        CURRENTCOVERAGE = coverageData;

        // Initially display all plumes as markers
        addPointsOnMap();
    
    });
}

function addPointsOnMap(p){
    // Removing prev markers
    const existing_markers = document.querySelectorAll('.marker');
    existing_markers.forEach(marker => marker.remove());

    // Adding new markers
    MARKERS_ON_MAP.forEach(function(point) {
        if (map.getLayer(`marker-${point.id}`)){
            map.removeLayer(layerId);
        }
        //const itemName = path.basename(point.feature.properties["Data Download"]); // ---.tif
        const coords = point.feature.geometry.coordinates
        const markerEl = document.createElement("div");
        markerEl.className = "marker";
        markerEl.id = `marker-${point.id}`;
        const marker = new mapboxgl.Marker(markerEl)
            .setLngLat([coords[0], coords[1]])
            .addTo(map);
        const popup = new mapboxgl.Popup().setHTML(`<h3>${point.feature.properties['Location']}${point.feature.properties['UTC Time Observed']}</h3>`);
        marker.setPopup(popup);
        marker.getElement().addEventListener("mouseenter", () => {
            popup.addTo(map);
        });
        marker.getElement().addEventListener("mouseleave", () => {
            popup.remove();
        });

        // Flying over automatically triggers zoom and drag evemt listeners
        marker.getElement().addEventListener("click", () => {
            map.flyTo({
                center: [coords[0], coords[1]], // Replace with the desired latitude and longitude
                zoom: ZOOM_THRESHOLD,
            });
            
        });
    });
    
};

map.on('drag', () => {
    zoomedOrDraggedToThreshold();
});

map.on('zoomend', () => {
    zoomedOrDraggedToThreshold();
})

main();
