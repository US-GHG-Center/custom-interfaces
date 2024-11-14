// index.js
import "./style.css";
import mapboxgl from "./map";
import { getMapInstance } from "./map";
import { filterByDates,
        createColorbar,
        addTimelineMarkers,
        beforeAnimation,
        afterAnimation } from "./helper";
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

//Global vars
export const map = getMapInstance();
export const ZOOM_THRESHOLD = 12;
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
    addCoverage(map, CURRENTCOVERAGE);
    addPointsOnMap(MARKERS_ON_MAP);
    zoomedOrDraggedToThreshold();
};

function removeAllPlumeLayers() {
    const layers = map.getStyle().layers;
    layers.forEach((layer) => {
        const prefixes = ['raster-', 'outline-', 'fill-'];
        prefixes.forEach(prefix => {
            if (layer.id.startsWith(prefix)) {
                const layerItemId = layer.id.replace(prefix, '');
                    map.removeLayer(layer.id);
                    if (map.getSource(layer.id + "-source")){
                        map.removeSource(layer.id + "-source");
                    }
            }
        });
    });
}

// function removePrevPlumeLayers() {
//     const layers = map.getStyle().layers;
//     layers.forEach((layer) => {
//         if (layer.id.startsWith('raster-') || layer.id.startsWith('outline-') || layer.id.startsWith('fill-')) {
//             const layerItemId = layer.id.replace('raster-', ''); 
//             if (!viewportItemIds.includes(layerItemId)) {
//                 console.log(`Removing layer: ${layer.id} (not in viewportItemIds)`);
//                 //map.setLayoutProperty(layer.id, 'visibility', 'none');
//                 map.removeLayer(layer.id);
//                 map.removeSource(layer.id +"-source"); 
//                 console.log(`Removed source: ${layer.id + "-source"}`);
//             }
//         }
//     });
// }

function removePrevPlumeLayers() {
    const layers = map.getStyle().layers;
    layers.forEach((layer) => {
        const prefixes = ['raster-', 'outline-', 'fill-'];
        prefixes.forEach(prefix => {
            if (layer.id.startsWith(prefix)) {
                const layerItemId = layer.id.replace(prefix, '');
                if (!viewportItemIds.includes(layerItemId)) {
                    console.log(`Removing layer: ${layer.id} (not in viewportItemIds)`);
                    map.removeLayer(layer.id);
                    if (map.getSource(layer.id + "-source")){
                        map.removeSource(layer.id + "-source");}
                    console.log(`Removed source: ${layer.id + "-source"}`);
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
    console.log(TILE_URL);
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
        const existing_markers = document.querySelectorAll('.marker');
        existing_markers.forEach(marker => marker.remove());
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
        removeAllPlumeLayers();
        addPointsOnMap();
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
                    'fill-opacity': 0,
                }
            });
}

function addRasterHoverListener() {
    MARKERS_ON_VIEWPORT.forEach(marker => {
        const itemId = marker.feature.properties['Data Download'].split('/').pop().split('.')[0];
        const polygonFeature = ALLPOLYGONS.find((item) => item.id === itemId);
        if (map.getZoom() >= ZOOM_THRESHOLD) {
            if (!map.getLayer("outline-polygon-layer-" + itemId)) {
                
                // Marker hover effect
                // document.getElementById(`marker-${marker.id}`).addEventListener("mouseenter", () => {
                //     if (map.getZoom() < ZOOM_THRESHOLD) return; // Zoom check inside event
                //     addOutline("polygon-source-" + itemId, "polygon-layer-" + itemId, polygonFeature.feature);
                //     const selectedItem = document.getElementById("itemDiv-" + itemId);
                //     selectedItem.style.border = "2px solid #0098d7";
                //     selectedItem.scrollIntoView({
                //         behavior: "smooth",
                //         block: "center",
                //         inline: "center"
                //     });
                // });
                map.on('mouseenter', `fill-${itemId}`,() => {
                    if (map.getZoom() < ZOOM_THRESHOLD) return; // Zoom check inside event
                    //addOutline("polygon-source-" + itemId, "polygon-layer-" + itemId, polygonFeature.feature);
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
                map.on('click', `fill-${itemId}`, (event) => {
                    event.preventDefault();
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
                        //removeLayers(map, "", ["polygon-layer-" + itemId, "outline-polygon-layer-" + itemId]);
                        map.setPaintProperty(`outline-${itemId}`, 'line-width', 2); 
                        const selectedItem = document.getElementById("itemDiv-" + itemId);
                        selectedItem.style.border = "2px solid rgba(255,255,255,0)";
                    });

                // document.getElementById(`marker-${marker.id}`).addEventListener("mouseleave", () => {
                //     if (map.getZoom() < ZOOM_THRESHOLD) return; // Zoom check inside event
                //     removeLayers(map, "", ["polygon-layer-" + itemId, "outline-polygon-layer-" + itemId]);
                //     const selectedItem = document.getElementById("itemDiv-" + itemId);
                //     selectedItem.style.border = "0px";
                // });

                // Sidebar item hover effect
                document.getElementById("itemDiv-" + itemId).addEventListener("mouseenter", () => {
                    if (map.getZoom() < ZOOM_THRESHOLD) return; // Zoom check inside event
                    //addOutline("polygon-source-" + itemId,  itemId, polygonFeature.feature);
                    map.setPaintProperty(`outline-${itemId}`, 'line-width', 4); 
                    const selectedItem = document.getElementById("itemDiv-" + itemId);
                    selectedItem.style.border = "2px solid #0098d7";
                    map.moveLayer(`raster-${itemId}`); 
                    map.moveLayer(`fill-${itemId}`); 
                    map.moveLayer(`outline-${itemId}`); 
                });

                document.getElementById("itemDiv-" + itemId).addEventListener("mouseleave", () => {
                    if (map.getZoom() < ZOOM_THRESHOLD) return; // Zoom check inside event
                    //removeLayers(map, "", ["polygon-layer-" + itemId, "outline-polygon-layer-" + itemId]);
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
    legendOuter.style.display ='';
    const additionalText = document.getElementById('num-plumes');
    additionalText.innerText = `${MARKERS_ON_VIEWPORT.length} Plumes`; 
    const legendContainer = document.getElementById("plegend");
    legendContainer.innerHTML = '';
    console.log("startDate ", startDate);
    console.log("endDate ", endDate);
    console.log("markers on viewport ", MARKERS_ON_VIEWPORT.length);
    console.log("markers on map ", MARKERS_ON_MAP.length);
    
    MARKERS_ON_VIEWPORT.sort((a, b) => {
        const dateA = new Date(a.feature.properties['UTC Time Observed']);
        const dateB = new Date(b.feature.properties['UTC Time Observed']);
        return dateB - dateA; // For descending order (newest first)
        // return dateA - dateB; for ascending order (oldest first)
    });
    MARKERS_ON_VIEWPORT.forEach(marker => {
        const properties = marker.feature.properties; 
        const itemDiv = document.createElement('div');
        const itemId = properties['Data Download'].split('/').pop().split('.')[0];
        itemDiv.className = "itemDiv";
        itemDiv.id = "itemDiv-"+itemId;
        const endpoint = `https://dev.ghg.center/api/raster/collections/emit-ch4plume-v1/items/${itemId}/preview.png?bidx=1&assets=ch4-plume-emissions&rescale=1%2C1500&resampling=bilinear&colormap_name=plasma`;
        itemDiv.innerHTML =createItemContent(marker, properties, endpoint);
        legendContainer.appendChild(itemDiv);
        const polygonFeature = ALLPOLYGONS.find((item) => item.id === itemId);
        if (!map.getLayer("fill-"+ itemId)){
            addOutline(itemId + "source-",itemId, polygonFeature.feature)
        }
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
        const coords = point.feature.geometry.coordinates
        const markerEl = document.createElement("div");
        markerEl.className = "marker";
        markerEl.id = `marker-${point.id}`;
        const marker = new mapboxgl.Marker(markerEl)
            .setLngLat([coords[0], coords[1]])
            .addTo(map);
        const location = point.feature.properties['Location'];
        const utcTimeObserved = point.feature.properties['UTC Time Observed'];
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
        marker.getElement().addEventListener("click", () => {
            map.flyTo({
                center: [coords[0], coords[1]], 
                zoom: ZOOM_THRESHOLD,
            });   
        });
    });   
};

async function getCoverageData() {
    const cacheName = "coverageDataCache";
    const cacheUrl = `${PUBLIC_URL}/data/coverage_data.json`;
    const cache = await caches.open(cacheName);

    const cachedResponse = await cache.match(cacheUrl);
    if (cachedResponse) {
        console.log("Loaded from Cache Storage");
        return await cachedResponse.json(); 
    }
    console.log("Fetching data from server");
    const networkResponse = await fetch(cacheUrl);
    await cache.put(cacheUrl, networkResponse.clone()); 
    return await networkResponse.json(); 
}

// async function main() {
//     map.on("load", async () => {  
//         addMeasurementSource(map);
//         document.querySelector(".toolbar").style.display = "block";
//         createColorbar(VMIN, VMAX);

//         let startDate = document.getElementById("start_date").value;
//         let endDate = document.getElementById("end_date").value;

//         coverageData =  getCoverageData();
    
//         addMeasurementLayer(map);
//         const polygons = methanMetadata.features
//         .filter((f) => f.geometry.type === "Polygon")
//         .map((f) => {
//             const id = f.properties["Data Download"].split('/').pop().split('.')[0]; // Extract "abc" from "http://.../abc.tif"
//             return {
//                 id: id,     
//                 feature: f
//             };
//         })
//         // Filter the data by dates and select only points
//         const points = filterByDates(methanMetadata,startDate, endDate, "plumes" ).features
//             .filter((f) => f.geometry.type === "Point")
//             .map((f) => {
//                 const id = f.properties["Data Download"].split('/').pop().split('.')[0]; // Extract "abc" from "http://.../abc.tif"
//                 return {
//                     id: id,     
//                     feature: f
//                 };
//             })

//         // Set the global vars when the map loads
//         ALLPOLYGONS = polygons;
//         MARKERS_ON_VIEWPORT = points;
//         viewportItemIds = MARKERS_ON_VIEWPORT.map(marker => 
//             marker.feature.properties['Data Download'].split('/').pop().split('.')[0]
//         );
//         removePrevPlumeLayers();
//         MARKERS_ON_MAP = points;
//         CURRENTCOVERAGE = coverageData;
//         // Initially display all plumes as markers
//         addPointsOnMap();
//     });
// }

async function main() {
    map.on("load", async () => {
        // Show loading spinner while fetching data
        document.getElementById("loading-spinner").style.display = "block";
        
        addMeasurementSource(map);
        document.querySelector(".toolbar").style.display = "block";
        createColorbar(VMIN, VMAX);

        let startDate = document.getElementById("start_date").value;
        let endDate = document.getElementById("end_date").value;

        try {
            // Fetch the coverage data and wait for it to resolve
            coverageData = await getCoverageData();

            // Proceed with the rest of the map setup after data is fetched
            addMeasurementLayer(map);

            const polygons = methanMetadata.features
                .filter((f) => f.geometry.type === "Polygon")
                .map((f) => {
                    const id = f.properties["Data Download"].split('/').pop().split('.')[0]; // Extract "abc" from "http://.../abc.tif"
                    return {
                        id: id,
                        feature: f
                    };
                });

            // Filter the data by dates and select only points
            const points = filterByDates(methanMetadata, startDate, endDate, "plumes").features
                .filter((f) => f.geometry.type === "Point")
                .map((f) => {
                    const id = f.properties["Data Download"].split('/').pop().split('.')[0]; // Extract "abc" from "http://.../abc.tif"
                    return {
                        id: id,
                        feature: f
                    };
                });

            // Set the global vars when the map loads
            ALLPOLYGONS = polygons;
            MARKERS_ON_VIEWPORT = points;
            viewportItemIds = MARKERS_ON_VIEWPORT.map(marker =>
                marker.feature.properties['Data Download'].split('/').pop().split('.')[0]
            );
            removePrevPlumeLayers();
            MARKERS_ON_MAP = points;

            // Initially display all plumes as markers
            addPointsOnMap();
        } catch (error) {
            console.error("Error loading coverage data:", error);
        } finally {
            // Hide the loading spinner once the data is loaded (or if an error occurred)
            document.getElementById("loading-spinner").style.display = "none";
        }
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
            const utcTimesObserved = MARKERS_ON_VIEWPORT.map(item => item.feature.properties['UTC Time Observed']);
            //const covTimes = CURRENTCOVERAGE.features.map(item => item.properties['start_time']);
            console.log("see cov", CURRENTCOVERAGE);
            document.getElementById("showCoverage").checked = true;
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
                    endDate = new Date(date).toISOString().slice(0, 16);
                    document.getElementById("end_date").value = endDate;
                    updateDatesandData(); 
                    //if you dont want cummulative
                    startDate= endDate
                    document.getElementById("start_date").value = endDate;
                },
            });
            const timelineElement = timeline.onAdd(map);
            document.getElementById('toolbar').appendChild(timelineElement);
            addTimelineMarkers(utcTimesObserved, start_date, end_date,'#20068f');
            //addTimelineMarkers(covTimes, start_date, end_date, 'red');
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
