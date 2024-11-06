// index.js
import "./style.css";
import mapboxgl from "./map";
import { getMapInstance } from "./map";
import { filterByDates,createColorbar } from "./helper";
import { addCoverage,removeLayers } from "./coverage";
import { updateSearchList } from "./search";
import { getPopupContent,createItemContent } from "./content"; 
import {
    //variables
    distancePoints,
    measureVariables,
    //functions
    addMeasurementAnchor,
    disableMeasurementMode,
    createMeasuringLine,
    addMeasurementSource,
    addMeasurementLayer,

  } from "./measureToolHelper";
import TimelineControl from 'mapboxgl-timeline';
import 'mapboxgl-timeline/dist/style.css';
export const map = getMapInstance();

const ZOOM_THRESHOLD = 10;
const markerClicked = false
const VMIN = 0;
const VMAX = 1500;
const COLLECTION = "emit-ch4plume-v1";
const ASSETS = "ch4-plume-emissions";
const PUBLIC_URL = process.env.PUBLIC_URL || ".";
const methanMetadata = await (
    await fetch(`${PUBLIC_URL}/data/combined_plume_metadata.json`)
).json();
const itemIds = await (
    await fetch(`${PUBLIC_URL}/data/methane_stac.geojson`)
).json();
let coverageData =[]
let ALLPOLYGONS = Array(); // it will be initialized once and will remain constant
let MARKERS_ON_MAP = Array(); // this is be initialized to methanMetadata (points only) and changes if  and end_date changes
let MARKERS_ON_VIEWPORT = Array(); // this will change with zoom, drag, start and end filter. Its value will be updated as derived from MARKERS_ON_MAP based on filters
let CURRENTCOVERAGE; // Its value changes with start and end date, derived from covergaeData
let viewportItemIds = MARKERS_ON_VIEWPORT.map(marker => 
    marker.properties['Data Download'].split('/').pop().split('.')[0]
);
let startDate = document.getElementById("start_date").value;
let endDate = document.getElementById("end_date").value;

function updateDatesandData(){
    const startDate =  document.getElementById("start_date").value;
    const endDate = document.getElementById("end_date").value;
    CURRENTCOVERAGE = filterByDates(coverageData,startDate, endDate, "coverage");
    const points = filterByDates(methanMetadata,startDate, endDate, "plumes" ).features
            .filter((f) => f.geometry.type === "Point")
            .map((f, i) => ({
                id: i,
                feature: f
            }));
    MARKERS_ON_MAP = points;
    addCoverage(map);
    addPointsOnMap(MARKERS_ON_MAP);
    zoomedOrDraggedToThreshold();
};

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
}

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
        removePrevPlumeLayers( viewportItemIds);
        createPlumesList();
        addRasterHoverListener();
    }
    else{
        const legendOuter = document.getElementById("plegend-container");
        legendOuter.style.display ='none';
        removeAllPlumeLayers(map);
    };

}

// Plumes polygon
function addOutline(polygonSourceId, polygonLayerId, polygonFeature){
    if (!map.getSource(polygonSourceId)){
        map.addSource(polygonSourceId, {
            type: "geojson",
            data: polygonFeature,
        });
        }
        if (!map.getLayer(`outline-${polygonLayerId}`))
        // Add a black outline around the polygon.
        map.addLayer({
            'id': `outline-${polygonLayerId}`,
            'type': 'line',
            'source': polygonSourceId,
            'layout': {},
            'paint': {
                'line-color': 'orange',
                'line-width': 2
            }
        });
}

function addRasterHoverListener() {
    MARKERS_ON_VIEWPORT.forEach(marker => {
        const itemId = marker.feature.properties['Data Download'].split('/').pop().split('.')[0];
        const polygonFeature = ALLPOLYGONS.filter((item) => item.id === itemId)[0];
        if (map.getZoom()>= ZOOM_THRESHOLD){
            if (!map.getLayer("outline-polygon-layer-" +itemId)){
                document.getElementById(`marker-${marker.id}`).addEventListener("mouseenter", () => {
                    addOutline("polygon-source-" + itemId, "polygon-layer-" +itemId, polygonFeature.feature);
                    const selectedItem = document.getElementById("itemDiv-"+itemId);
                    selectedItem.style.border = "2px solid orange";
                    selectedItem.scrollIntoView({
                        behavior: "smooth", 
                        block: "center", 
                        inline: "center"  
                    });
                });
                document.getElementById(`marker-${marker.id}`).addEventListener("mouseleave", () => {
                    removeLayers(map, "",["polygon-layer-" +itemId, "outline-polygon-layer-" +itemId]);
                    const selectedItem = document.getElementById("itemDiv-"+itemId);
                    selectedItem.style.border = "1px solid black";
                });
                document.getElementById("itemDiv-"+itemId).addEventListener("mouseenter", () => {
                    addOutline("polygon-source-" + itemId, "polygon-layer-" +itemId, polygonFeature.feature, "orange", "transparent", "orange", 2);
                    const selectedItem = document.getElementById("itemDiv-"+itemId);
                    selectedItem.style.border = "2px solid orange";
                });
                document.getElementById("itemDiv-"+itemId).addEventListener("mouseleave", () => {
                    removeLayers(map, "",["polygon-layer-" +itemId, "outline-polygon-layer-" +itemId]);
                    const selectedItem = document.getElementById("itemDiv-"+itemId);
                    selectedItem.style.border = "1px solid black";
                });
            }
    }
    });
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
        itemDiv.innerHTML =createItemContent(marker, properties, endpoint);

        // Append the new div to the legend container
        legendContainer.appendChild(itemDiv);

        //now add the rasters
        if (!map.getLayer("raster-"+ itemId)){
            addRaster(itemId);
        }   
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
        }).setHTML(getPopupContent(location, utcTimeObserved)); 
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

async function main() {

    map.on("load", async () => {  
        addMeasurementSource(map);
        document.querySelector(".toolbar").style.display = "block";
        createColorbar(VMIN, VMAX);

        let startDate = document.getElementById("start_date").value;
        let endDate = document.getElementById("end_date").value;

        coverageData = await (
            await fetch(`${PUBLIC_URL}/data/coverage.geojson`)
        ).json();
    
        addMeasurementLayer(map);
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

//Add event listeners
map.on('drag', () => { zoomedOrDraggedToThreshold(); });
map.on('zoomend', () => { zoomedOrDraggedToThreshold(); });
document.getElementById("start_date").addEventListener('change', updateDatesandData);
document.getElementById("end_date").addEventListener('change', updateDatesandData);
document.getElementById("showCoverage").addEventListener("change", () => addCoverage(map,CURRENTCOVERAGE));
document.getElementById("plume-id-search-input").addEventListener("input", (event) => {
    const keyword = event.target.value.trim();
    if (keyword) {
        updateSearchList(keyword, map, MARKERS_ON_MAP, ZOOM_THRESHOLD); 
    } else {
        document.getElementById("plume-id-search-list").innerHTML = ""; 
    }});
document.addEventListener("click", (event) => {
    const searchInput = document.getElementById("plume-id-search-input");
    const searchList = document.getElementById("plume-id-search-list");
    if (!searchInput.contains(event.target) && !searchList.contains(event.target)) {
        searchList.innerHTML = "";
    }});
document.getElementById("toggle-button").addEventListener("click", () => {
    if (map.getZoom()>=ZOOM_THRESHOLD){
    const legendContainer = document.getElementById("plegend-container");
    // Check if the container is currently hidden
    if (legendContainer.style.display === "none") {
        legendContainer.style.display = "block";  
    } else {
        legendContainer.style.display = "none";  
    }
}});

map.on("dblclick", (e) => {
    if (measureVariables.measureToggled) {
        disableMeasurementMode(map);
    } else {
      map.doubleClickZoom.enable();
    }
  });

  map.on("click", (e) => {
    if (!markerClicked && measureVariables.measureToggled)
      addMeasurementAnchor(e, map, markerClicked);
  });

  map.on("mousemove", (e) => {
    if (
      distancePoints.features.length > 0 &&
      measureVariables.measureToggled
    ) {
      createMeasuringLine(e, map);
    }
  });

  // WIP for animation
// (ZZOM_THRESHOLD, MARKERS_ON_VIEWPORT, )
const isAnimation = document.getElementById("doAnimation");
let timeline;
isAnimation.addEventListener("change", (event) => {
    if (event.target.checked) {
        // Check if the zoom level is sufficient before adding the control
        if (map.getZoom() >= ZOOM_THRESHOLD) {
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
                step: 1000 * 3600 * 24* 30, // 30 days interval
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
