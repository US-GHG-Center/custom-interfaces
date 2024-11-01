const mapboxgl = require("mapbox-gl");
import TimelineControl from 'mapboxgl-timeline';
import 'mapboxgl-timeline/dist/style.css';
const {
    createColorbar
} = require("./helper");
const path = require('path');
import "./style.css";
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

let ALLPOLYGONS = Array(); // it will be initialized once and will remain constant
let MARKERS_ON_MAP = Array(); // this is be initialized to methanMetadata (points only) and changes if start and end_date changes
let MARKERS_ON_VIEWPORT = Array(); // this will change with zoom, drag, start and end filter. Its value will be updated as derived from MARKERS_ON_MAP based on filters
let CURRENTCOVERAGE; // Its value changes with start and end date, derived from covergaeData
let viewportItemIds = MARKERS_ON_VIEWPORT.map(marker => 
    marker.properties['Data Download'].split('/').pop().split('.')[0]
);;

const COLLECTION = "emit-ch4plume-v1";
const ASSETS = "ch4-plume-emissions";

//filters
let toggleSwitch = document.getElementById("showCoverage");
let startDate = document.getElementById("start_date").value;
let endDate = document.getElementById("end_date").value;

// Add event listeners to filters
document.getElementById("start_date").addEventListener('change', updateDatesandData);
document.getElementById("end_date").addEventListener('change', updateDatesandData);
toggleSwitch.addEventListener("change", addCoverage);

export const map = new mapboxgl.Map({
    container: "map",
    style: MAP_STYLE, // You can choose any Mapbox style
    center: [-98, 39], // Initial center coordinates
    zoom: 4, // Initial zoom level
});
map.dragRotate.disable();
map.touchZoomRotate.disableRotation();
const zoomControl = new mapboxgl.NavigationControl();
map.addControl(zoomControl, 'top-right');


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

// Attach event listener to search input
document.getElementById("plume-id-search-input").addEventListener("input", (event) => {
    const keyword = event.target.value.trim();
    if (keyword) {
        updateSearchList(keyword); 
    } else {
        document.getElementById("plume-id-search-list").innerHTML = ""; 
    }
});
document.addEventListener("click", (event) => {
    const searchInput = document.getElementById("plume-id-search-input");
    const searchList = document.getElementById("plume-id-search-list");
    if (!searchInput.contains(event.target) && !searchList.contains(event.target)) {
        searchList.innerHTML = "";
    }
});


function handleSearch(keyword) {
    let plumeIds = [];
    let searchResults = [];

    MARKERS_ON_MAP.forEach(marker => {
        const plumeId = `${marker.feature.properties["Plume ID"]} (${marker.feature.properties["Location"]})`;
        plumeIds.push(plumeId);
        
        // Store the relevant information in the searchResults array
        searchResults.push({
            displayText: plumeId,
            latitude: marker.feature.properties["Latitude of max concentration"],
            longitude: marker.feature.properties["Longitude of max concentration"],
            // Add other properties if needed
        });
    });

    plumeIds.sort((a, b) => {
        return getSimilarity(b, keyword) - getSimilarity(a, keyword);
    });

    plumeIds = plumeIds.filter(plume_id => {
        return getSimilarity(plume_id, keyword) > 0;
    });

    // Return both the IDs and the search results
    return searchResults.filter(result => plumeIds.includes(result.displayText));
}

function getSimilarity(data, keyword) {
    data = data.toLowerCase();
    keyword = keyword.toLowerCase();
    return data.length - data.replace(new RegExp(keyword, 'g'), '').length;
}

// Function to update the search list with results
function updateSearchList(keyword) {
    const searchList = document.getElementById("plume-id-search-list");
    searchList.innerHTML = ""; // Clear previous results

    // Get results from handleSearch
    const results = handleSearch(keyword);

    if (results.length === 0) {
        // Show 'No results found' message if no matches
        const noResultItem = document.createElement("li");
        noResultItem.textContent = "No results found";
        noResultItem.className = "no-results";
        searchList.appendChild(noResultItem);
    } else {
        // Populate list with results and attach click listeners
        results.forEach(result => {
            const resultItem = document.createElement("li");
            resultItem.textContent = result.displayText;
            resultItem.className = "result-item";
            searchList.appendChild(resultItem);

            // Add click listener to each result item
            resultItem.addEventListener("click", () => handleSelection(result));
        });
    }
}

// Function to handle selection of a search item
function handleSelection(selectedItem) {
    // Optionally, set the selected item in the search box
    //document.getElementById("plume-id-search-input").value = selectedItem.displayText;

    // Clear search results after selection
    document.getElementById("plume-id-search-list").innerHTML = "";
    map.flyTo({
        center: [selectedItem.longitude, selectedItem.latitude], 
        zoom: ZOOM_THRESHOLD,
    });
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


function addRaster(itemId) {
    const bbox = itemIds[itemId +".tif"]["bbox"];
    const TILE_URL =
        `https://earth.gov/ghgcenter/api/raster/collections/${COLLECTION}/tiles/WebMercatorQuad/{z}/{x}/{y}@1x` +
        "?item=" +
        itemId +
        "&assets=" +
        ASSETS +
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
            console.log("removing ", layer.id)
            map.removeLayer(layer.id);
            if (map.getSource(layer.id + '-source')) {
                map.removeSource(layer.id + '-source');
            }
        }
    });
}
function removePrevPlumeLayers() {
    const layers = map.getStyle().layers;
    layers.forEach((layer) => {
        if (layer.id.startsWith('raster-')) {
            const layerItemId = layer.id.replace('raster-', ''); 
            if (!viewportItemIds.includes(layerItemId)) {
                console.log(`Removing layer: ${layer.id} (not in viewportItemIds)`);
                //map.setLayoutProperty(layer.id, 'visibility', 'none');
                map.removeLayer(layer.id);
                map.removeSource(layer.id +"-source"); 
                console.log(`Removed source: ${layer.id + "-source"}`);
            }
        }
    });
    map.resize();
}

function addRasterHoverListener() {
    MARKERS_ON_VIEWPORT.forEach(marker => {
        const itemId = marker.feature.properties['Data Download'].split('/').pop().split('.')[0];
        const polygonFeature = ALLPOLYGONS.filter((item) => item.id === itemId)[0];
        if (map.getZoom()>= ZOOM_THRESHOLD){
            if (!map.getLayer("outline-polygon-layer-" +itemId)){
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
        
        viewportItemIds = MARKERS_ON_VIEWPORT.map(marker => 
            marker.feature.properties['Data Download'].split('/').pop().split('.')[0]
        );
        removePrevPlumeLayers();
        createPlumesList();
        addRasterHoverListener();
    }
    else{
        const legendOuter = document.getElementById("plegend-container");
        legendOuter.style.display ='none';
        removeAllPlumeLayers();
    };

}

function createPlumesList(){
    const legendOuter = document.getElementById("plegend-container");
    legendOuter.style.display ='';

    // Create the additional text
    const additionalText = document.getElementById('num-plumes');
    additionalText.innerText = `${MARKERS_ON_VIEWPORT.length} Plumes`; 

    const legendContainer = document.getElementById("plegend");
    legendContainer.innerHTML = ''; // Clear previous entries

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
        if (!map.getLayer("raster-"+ itemId)){
            addRaster(itemId);
        }
        
    });
}
document.getElementById("toggle-button").addEventListener("click", () => {
    if (map.getZoom()>=ZOOM_THRESHOLD){
    const legendContainer = document.getElementById("plegend-container");
    const toggleButton = document.getElementById("toggle-button");

    // Check if the container is currently hidden
    if (legendContainer.style.display === "none") {
        legendContainer.style.display = "block";  // Show the container
        toggleButton.innerHTML = "&laquo;"; // Change to "<<" to indicate collapse
    } else {
        legendContainer.style.display = "none";  // Hide the container
        toggleButton.innerHTML = "&#9776;"; // Change to "≡" to indicate expand
    }
}
});


async function main() {

    map.on("load", async () => {  
        createColorbar(VMIN, VMAX);
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
        viewportItemIds = MARKERS_ON_VIEWPORT.map(marker => 
            marker.feature.properties['Data Download'].split('/').pop().split('.')[0]
        );
        removePrevPlumeLayers();
        MARKERS_ON_MAP = points;
        CURRENTCOVERAGE = coverageData;

        // Initially display all plumes as markers
        addPointsOnMap();

    
    });
}

function addPointsOnMap(){
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
        const location = point.feature.properties['Location'];
        const utcTimeObserved = new Date(point.feature.properties['UTC Time Observed']).toLocaleString("en-US", {
            year: "numeric", 
            month: "short", 
            day: "numeric", 
            hour: "2-digit", 
            minute: "2-digit", 
            second: "2-digit",
            hour12: false
        });
            
        const popup = new mapboxgl.Popup({
            closeButton: false, 
            closeOnClick: false
        }).setHTML(`
        <table style="line-height: 1.4; font-size: 12px;">
            <tr><td><strong>Location:</strong></td><td>${location}</td></tr>
            <tr><td><strong>Date:</strong></td><td>${utcTimeObserved}</td></tr>
        </table>
    `);
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

// WIP for animation
const isAnimation = document.getElementById("doAnimation");
let timeline;
isAnimation.addEventListener("change", (event) => {
    if (event.target.checked) {
        // Check if the zoom level is sufficient before adding the control
        if (map.getZoom() >= ZOOM_THRESHOLD) {
            console.log("do animation");
            map.dragPan.disable();
            map.scrollZoom.disable();
            map.boxZoom.disable();
            removePrevPlumeLayers();
            const legendOuter = document.getElementById("plegend-container");
            legendOuter.style.display ='none';

            timeline = new TimelineControl({
                placeholder: 'Plumes',
                start: startDate,
                end: endDate,
                step: 1000 * 3600 * 24* 30,
                onChange: date => {
                    endDate = new Date(date).toISOString().slice(0, 16);
                    document.getElementById("end_date").value = endDate;
                    updateDatesandData(); 
                },
            });
            map.addControl(timeline, 'bottom-left');
        } else {
            alert("Please zoom into an area you want to animate!!");
            map.dragPan.enable();
            map.scrollZoom.enable();
            map.boxZoom.enable();
            isAnimation.checked = false; 
        }
    } else {
        // Remove the timeline control when animation is stopped
        console.log("stop animation");
        map.dragPan.enable();
        map.scrollZoom.enable();
        map.boxZoom.enable();
        if (timeline) {
            map.removeControl(timeline);
            timeline = null; // Reset timeline to allow recreation
        }
    }
});

main();
