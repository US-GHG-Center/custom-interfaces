
// index.js
import "./style.css";
import mapboxgl  from "./map";
import { getMapInstance, layerToggled , plumeListManuallyHidden} from "./map";
import { filterByDates,
        createColorbar,
        addTimelineMarkers,
        beforeAnimation,
        afterAnimation,
        isFeatureWithinBounds,
        getSliderValues } from "./helper";
import { checkToggle,addCoverageToggleListener } from "./coverage";
import { updateSearchList } from "./search";
import { getPopupContent,createItemContent } from "./content"; 
import TimelineControl from 'mapboxgl-timeline';
import 'mapboxgl-timeline/dist/style.css';
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

// Skip animation
// import TimelineControl from 'mapboxgl-timeline';
// import 'mapboxgl-timeline/dist/style.css';

//Global vars
export const map = getMapInstance();
export const ZOOM_THRESHOLD = 10;
const markerClicked = false

const VMIN = 0;
const VMAX = 1500;
const COLLECTION = "emit-ch4plume-v1";
const ASSETS = "ch4-plume-emissions";
const PUBLIC_URL = process.env.PUBLIC_URL || ".";


let itemIds = Array();
let methanMetadata = Array();

let coverageData = Array();


let ALLPOLYGONS = Array(); // it will be initialized once and will remain constant
let MARKERS_ON_MAP = Array(); // this is be initialized to methanMetadata (points only) and changes if  and end_date changes
let MARKERS_ON_VIEWPORT = Array(); // this will change with zoom, drag, start and end filter. Its value will be updated as derived from MARKERS_ON_MAP based on filters
let POLYGONS_ON_MAP = Array(); 
let viewportItemIds = MARKERS_ON_VIEWPORT.map(marker => 
    marker.properties['Data Download'].split('/').pop().split('.')[0]
);


function updateDatesandData(){
    const {s: start_date, e: end_date} = getSliderValues();
    MARKERS_ON_MAP = filterByDates(methanMetadata, start_date, end_date).features
    .filter((f) => f.geometry.type === "Point")
    .map((f) => {
        const id = f.properties["Data Download"].split('/').pop().split('.')[0]; // Extract "abc" from "http://.../abc.tif"
        return {
            id: id,
            feature: f
        };
    });
    checkToggle(map, coverageData, start_date, end_date);
    addPointsOnMap();
    zoomedOrDraggedToThreshold();
};

function removeAllPlumeLayers() {
    const layers = map.getStyle().layers;
    layers.forEach((layer) => {
        const prefixes = ['raster-', 'outline-', 'fill-'];
        prefixes.forEach(prefix => {
            if (layer.id.startsWith(prefix)) {
                    map.removeLayer(layer.id);
                    if (map.getSource(layer.id + "-source")){
                        map.removeSource(layer.id + "-source");
                    }
            }
        });
    });
}

function removePrevPlumeLayers() {
    const layers = map.getStyle().layers;
    layers.forEach((layer) => {
        const prefixes = ['raster-', 'outline-', 'fill-'];
        prefixes.forEach(prefix => {
            if (layer.id.startsWith(prefix)) {
                const layerItemId = layer.id.replace(prefix, '');
                if (!viewportItemIds.includes(layerItemId)) {
                    map.removeLayer(layer.id);
                    if (map.getSource(layer.id + "-source")){
                        map.removeSource(layer.id + "-source");}
                }
            }
        });
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
    const visibility = layerToggled ? 'visible' : 'none';
    map.addLayer({
        id: layer_id,
        type: "raster",
        source: "raster-" + itemId + "-source",
        paint: {},        
        layout: {
            visibility: visibility
        }
    });
}

function zoomedOrDraggedToThreshold(){
    
    const currentZoom = map.getZoom();
    if (currentZoom >= ZOOM_THRESHOLD){
        // MARKERS_ON_VIEWPORT = MARKERS_ON_MAP.filter(marker => {
        //     const coords = marker.feature.geometry.coordinates;
        //     const lngLat = new mapboxgl.LngLat(coords[0], coords[1]);
        //     return  map.getBounds().contains(lngLat); 
        // });
        const bounds = map.getBounds(); 
        const intersectingPolygonIds = POLYGONS_ON_MAP
        .filter(({ feature }) => isFeatureWithinBounds(feature, bounds)) // Check if polygon intersects
        .map(({ feature }) => {
            return feature.properties["Data Download"].split('/').pop().split('.')[0]; 
        });
        MARKERS_ON_VIEWPORT = MARKERS_ON_MAP.filter(marker => {
            const markerId = marker.feature.properties["Data Download"].split('/').pop().split('.')[0];
            return intersectingPolygonIds.includes(markerId); // Match IDs
        });
        const existing_markers = document.querySelectorAll('.marker');
        //existing_markers.forEach(marker => marker.remove());
        existing_markers.forEach(marker => {
            marker.style.visibility = 'hidden'; // Hides the marker while keeping it in the DOM
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
        legendOuter.style.right = '-380px'; // Move off-screen
        removeAllPlumeLayers();
        //addPointsOnMap();
        const existing_markers = document.querySelectorAll('.marker');
        existing_markers.forEach(marker => {
            marker.style.visibility = 'visible'; 
        });
        const mapControls = document.querySelector('.mapboxgl-ctrl-top-right');
        mapControls.style.right = '10px'; // Reset controls to original position
    };
}

function addOutline(polygonSourceId, polygonLayerId, polygonFeature){
    if (!map.getSource(polygonSourceId)){
        map.addSource(polygonSourceId, {
            type: "geojson",
            data: polygonFeature,
        });
        }
        if (!map.getLayer(`outline-${polygonLayerId}`))
        map.addLayer({
            'id': `outline-${polygonLayerId}`,
            'type': 'line',
            'source': polygonSourceId,
            'layout': {},
            'paint': {
                'line-color': "#0098d7",
                'line-width': 1
            }
        });
        if (!map.getLayer(`fill-${polygonLayerId}`))
            map.addLayer({
                'id': `fill-${polygonLayerId}`,
                'type': 'fill',
                'source': polygonSourceId,
                'layout': {},
                'paint': {
                    'fill-opacity': 0
                }
            });
}

function addRasterHoverListener() {
    MARKERS_ON_VIEWPORT.forEach(marker => {
        const itemId = marker.feature.properties['Data Download'].split('/').pop().split('.')[0];
        if (map.getZoom() >= ZOOM_THRESHOLD) {
            if (!map.getLayer("outline-polygon-layer-" + itemId)) {
                
                map.on('mouseenter', `fill-${itemId}`,() => {
                    if (map.getZoom() < ZOOM_THRESHOLD) return; // Zoom check inside event
                    map.setPaintProperty(`outline-${itemId}`, 'line-width', 4); 
                    const selectedItem = document.getElementById("itemDiv-" + itemId);
                    selectedItem.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                        inline: "center"
                    });
                    selectedItem.style.border = "2px solid #0098d7";
                    map.moveLayer(`raster-${itemId}`); 
                    map.moveLayer(`fill-${itemId}`); 
                    map.moveLayer(`outline-${itemId}`); 
                });
                map.on('click', `fill-${itemId}`, () => {
                    if (map.getZoom() < ZOOM_THRESHOLD) return; 
                    const currentVisibility = map.getLayoutProperty(`raster-${itemId}`, 'visibility');
                    if (currentVisibility === 'visible') {
                        map.setLayoutProperty(`raster-${itemId}`, 'visibility', 'none');
                    } else {
                        map.setLayoutProperty(`raster-${itemId}`, 'visibility', 'visible');
                    }
                });
                map.on('mouseleave', `fill-${itemId}`, () => {
                        if (map.getZoom() < ZOOM_THRESHOLD) return; 
                        map.setPaintProperty(`outline-${itemId}`, 'line-width', 2); 
                        const selectedItem = document.getElementById("itemDiv-" + itemId);
                        selectedItem.style.border = "2px solid rgba(255,255,255,0)";
                    });

                // Sidebar item hover effect
                document.getElementById("itemDiv-" + itemId).addEventListener("mouseenter", () => {

                    map.setPaintProperty(`outline-${itemId}`, 'line-width', 4); 
                    const selectedItem = document.getElementById("itemDiv-" + itemId);
                    selectedItem.style.border = "2px solid #0098d7";
                    map.moveLayer(`raster-${itemId}`); 
                    map.moveLayer(`fill-${itemId}`); 
                    map.moveLayer(`outline-${itemId}`); 
                });

                document.getElementById("itemDiv-" + itemId).addEventListener("mouseleave", () => {
                    if (map.getZoom() < ZOOM_THRESHOLD) return; // Zoom check inside event
                    map.setPaintProperty(`outline-${itemId}`, 'line-width', 1); 
                    const selectedItem = document.getElementById("itemDiv-" + itemId);
                    selectedItem.style.border = "2px solid rgba(255,255,255,0)";
                });
            }
        }
    });
}

function createPlumesList(){
    const legendOuter = document.getElementById("plegend-container");
    const additionalText = document.getElementById('num-plumes');
    additionalText.innerText = `${MARKERS_ON_VIEWPORT.length} Plumes`; 
    const legendContainer = document.getElementById("plegend");
    legendContainer.innerHTML = '';
    const mapControls = document.querySelector('.mapboxgl-ctrl-top-right');
    
    MARKERS_ON_VIEWPORT.sort((a, b) => {
        const dateA = new Date(a.feature.properties['UTC Time Observed']);
        const dateB = new Date(b.feature.properties['UTC Time Observed']);
        return dateB - dateA; // For descending order (newest first)
        // return dateA - dateB; for ascending order (oldest first)
    });
    if (plumeListManuallyHidden){
        legendOuter.style.right = '-380px'; // Move off-screen
        mapControls.style.right = '10px';


    }
    else{
        if (MARKERS_ON_VIEWPORT.length>0){
        legendOuter.style.right = '10px'; // Move on-screen
        mapControls.style.right = '380px';
        }
        else{ 
            legendOuter.style.right = '-380px'; // Move off-screen
            mapControls.style.right = '10px';
        }

    }
    
    MARKERS_ON_VIEWPORT.forEach(marker => {
        const properties = marker.feature.properties; 
        const itemDiv = document.createElement('div');
        const itemId = properties['Data Download'].split('/').pop().split('.')[0];
        itemDiv.className = "itemDiv";
        itemDiv.id = "itemDiv-"+itemId;
        const endpoint = `https://earth.gov/ghgcenter/api/raster/collections/emit-ch4plume-v1/items/${itemId}/preview.png?bidx=1&assets=ch4-plume-emissions&rescale=1%2C1500&resampling=bilinear&colormap_name=plasma`;
        itemDiv.innerHTML =createItemContent(marker, properties, endpoint);
        legendContainer.appendChild(itemDiv);
        const polygonFeature = ALLPOLYGONS.find((item) => item.id === itemId);
        if (!map.getLayer("fill-"+ itemId)){
            addOutline(itemId + "-source",itemId, polygonFeature.feature)
        }
        if (!map.getLayer("raster-"+ itemId)){
            addRaster(itemId);
        }
    });
}
// Global to keep track of active markers
const activeMarkers = new Map();

function addPointsOnMap() {
    const newMarkerIds = new Set(MARKERS_ON_MAP.map(point => point.id));
    const currentMarkerIds = new Set(activeMarkers.keys());

    // Remove markers no longer needed
    for (const markerId of currentMarkerIds) {
        if (!newMarkerIds.has(markerId)) {
            const markerObj = activeMarkers.get(markerId);
            markerObj.marker.remove(); // Remove from map
            activeMarkers.delete(markerId); // Remove from activeMarkers map
        }
    }
    // Add new markers
    MARKERS_ON_MAP.forEach(point => {
        if (!activeMarkers.has(point.id)) {
            const coords = point.feature.geometry.coordinates;
            const markerEl = document.createElement("div");
            markerEl.className = "marker";
            markerEl.id = `marker-${point.id}`;

            const marker = new mapboxgl.Marker(markerEl)
                .setLngLat([coords[0], coords[1]])
                .addTo(map);

            const location = point.feature.properties["Location"];
            const utcTimeObserved = point.feature.properties["UTC Time Observed"];
            const id = point.feature.properties["Plume ID"];

            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
            }).setHTML(getPopupContent(location, utcTimeObserved,id));

            marker.setPopup(popup);

            // Event listeners for hover and click
            marker.getElement().addEventListener("mouseenter", () => popup.addTo(map));
            marker.getElement().addEventListener("mouseleave", () => popup.remove());
            marker.getElement().addEventListener("click", () => {
                map.flyTo({
                    center: [coords[0], coords[1]],
                    zoom: ZOOM_THRESHOLD + 2,
                });
            });

            // Add marker to activeMarkers map
            activeMarkers.set(point.id, { marker, element: markerEl });
        }
    });

}

function initializeDateSlider() {
    const firstPoint = "2022-08-09T00:00:00";
    const today = new Date() ;
    const lastPoint = today.toISOString().split('T')[0] + "T00:00:00";
    var minStartDate = new Date(firstPoint);
    minStartDate.setUTCHours(0, 0, 0, 0);
    var maxStopDate = new Date(lastPoint);
    maxStopDate.setUTCHours(23, 59, 59, 0);

    $("#amount").val(
        minStartDate.toUTCString().slice(0, -13) + " - " + maxStopDate.toUTCString().slice(0, -13)
      );
    const dateSlider = $("#slider-range").slider({
      range: true,
      min: minStartDate.getTime() / 1000,  // Convert to seconds
      max: maxStopDate.getTime() / 1000,  // Convert to seconds
      step: 86400,  // Step size of 1 day (86400 seconds)
      values: [minStartDate.getTime() / 1000, maxStopDate.getTime() / 1000],
      slide: function (event, ui) {
        let sDate = new Date(ui.values[0] * 1000); // Convert to milliseconds
        let eDate = new Date(ui.values[1] * 1000); // Convert to milliseconds
        sDate.setUTCHours(0, 0, 0, 0);
        eDate.setUTCHours(23, 59, 59, 0);
        $("#amount").val(
          sDate.toUTCString().slice(0, -13) + " - " + eDate.toUTCString().slice(0, -13)
        );
      },
      stop: function (event, ui) {
        let sDate = new Date(ui.values[0] * 1000); // Convert to milliseconds
        let eDate = new Date(ui.values[1] * 1000); // Convert to milliseconds
        sDate.setUTCHours(0, 0, 0, 0);
        eDate.setUTCHours(23, 59, 59, 0);
  
        // $("#amount").val(
        //   sDate.toUTCString().slice(0, -13) + " - " + eDate.toUTCString().slice(0, -13)
        // );
        updateDatesandData();
      }
    });
  }

function main() {
    map.on("load", async () => {  
        addMeasurementSource(map);
        document.querySelector(".toolbar").style.display = "block";
        createColorbar(VMIN, VMAX);
        initializeDateSlider();
        addMeasurementLayer(map);
        methanMetadata = await (
            await fetch(`${PUBLIC_URL}/data/combined_plume_metadata.json`)
        ).json();
        itemIds = await (
            await fetch(`${PUBLIC_URL}/data/methane_stac.geojson`)
        ).json();


        coverageData = await (
            await fetch(`${PUBLIC_URL}/data/coverage_data.json`)
        ).json();

        initializeDateSlider();
        // coverageData =  await getCoverageData();
        addCoverageToggleListener(map, coverageData)
        document.getElementById("loading-spinner").style.display = "none";

        let {s: startDate, e: endDate} = getSliderValues();
        MARKERS_ON_MAP = methanMetadata.features
        .filter((f) => f.geometry.type === "Point")
        .map((f) => {
            const id = f.properties["Data Download"].split('/').pop().split('.')[0]; // Extract "abc" from "http://.../abc.tif"
            return {
                id: id,     
                feature: f
            };
        })
        ALLPOLYGONS = methanMetadata.features
        .filter((f) => f.geometry.type === "Polygon")
        .map((f) => {
            const id = f.properties["Data Download"].split('/').pop().split('.')[0]; // Extract "abc" from "http://.../abc.tif"
            return {
                id: id,     
                feature: f
            };
        });
        // Set the global vars when the map loads
        POLYGONS_ON_MAP = ALLPOLYGONS;
        MARKERS_ON_VIEWPORT = MARKERS_ON_MAP;
        viewportItemIds = MARKERS_ON_VIEWPORT.map(marker => 
            marker.feature.properties['Data Download'].split('/').pop().split('.')[0]
        );
        removeAllPlumeLayers();
        addPointsOnMap();
        
    });
}

//Add event listeners
map.on('dragend', () => { zoomedOrDraggedToThreshold(); });
map.on('zoomend', () => { zoomedOrDraggedToThreshold(); });
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
// Check animation feature flag 
const urlParams = new URLSearchParams(window.location.search);
const isFeatureXEnabled = urlParams.get('animate') === 'true';
if (isFeatureXEnabled) {
  document.getElementById('animate').style.display = 'block';
}

// Skip animation
const isAnimation = document.getElementById("doAnimation");
let timeline;
let preservedState= {};
isAnimation.addEventListener("change", (event) => {
    if (event.target.checked) {
        if (map.getZoom() >= ZOOM_THRESHOLD) {
            const {start_date, end_date, cov}= beforeAnimation(map);
            preservedState = {
                startDate:start_date,
                endDate: end_date,
                coverage: cov,
            };
            document.getElementById("showCoverage").checked = true;
            const utcTimesObserved = MARKERS_ON_VIEWPORT.map(item => item.feature.properties['UTC Time Observed']);
            const covTimes = coverageData.features
            .filter(feature => isFeatureWithinBounds(feature, map.getBounds()))
            .map(feature => feature.properties.start_time)
            .filter(date => date >=  start_date && date <= end_date);

            removePrevPlumeLayers();
            timeline = new TimelineControl({
                placeholder: 'Plumes',
                className: 'timeline-control' ,
                start: start_date,
                end: end_date,
                format: (date) => {
                    const formattedDate = new Date(date).toLocaleDateString('en-US', {
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric'
                    });
                    return `From ${formattedDate} - 30 days prior`;
                },         
                step: 1000 * 3600 * 24* 30, // 30 days interval
                onChange: date => {
                    const currentStartTime = $("#slider-range").slider("values", 0);
                    const manualEndTime =  new Date(date).getTime()/1000;
                    $("#slider-range").slider("values", [currentStartTime, manualEndTime]);
                    updateDatesandData(); 
                    //if you dont want cummulative
                    const currentEndTime = $("#slider-range").slider("values", 1);
                    const manualStartTime= currentEndTime;
                    $("#slider-range").slider("values", [manualStartTime, currentEndTime]);
                },
            });
            const timelineElement = timeline.onAdd(map);
            document.getElementById('toolbar').appendChild(timelineElement);
            addTimelineMarkers(covTimes, start_date, end_date, '#ddd', -5, 8,4, 0);
            addTimelineMarkers(utcTimesObserved, start_date, end_date,"#20068f", 10, 4,4,50);
        } 
        else 
        {
            alert(`Your Zoom level is ${map.getZoom()}. Please increase zoom level to ${ZOOM_THRESHOLD} around the area you want to animate!!`);
            document.getElementById("doAnimation").checked= false;

        }
    } else {
        afterAnimation(map, preservedState);
        updateDatesandData();
        if (timeline) {
            map.removeControl(timeline);
            timeline = null; // Reset timeline to allow recreation
        }
    }
})
main();
