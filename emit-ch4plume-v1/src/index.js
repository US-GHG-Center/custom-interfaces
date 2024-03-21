const mapboxgl = require("mapbox-gl");
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

const markerClickTracker = new Array(2)

const markerProps = new Object()

var counter_clicks_marker = 0

var layerToggled = true;
var polygons;



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

        console.log(layerToggled);

        // Set the map's center and zoom to the desired location
        RASTER_IDS_ON_MAP.forEach((raster_id_on_map) => {

        try {
            const layerID = "raster-layer-" + raster_id_on_map.id;
            const layerDate = new Date(raster_id_on_map.properties["UTC Time Observed"]);
            const startDate = new Date($("#slider-range").slider("values", 0) * 1000)
            const stopDate = new Date($("#slider-range").slider("values", 1) * 1000)
            const boolDisplay = layerToggled && layerDate >= startDate && layerDate <= stopDate;
            map.setLayoutProperty(
                layerID,
                "visibility",
                boolDisplay ?
                "visible" :
                "none"
            );
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

function removeLayers(sourceId, layersIds) {
  layersIds.forEach(layerId => {
    map.removeLayer(layerId)
  });
  map.removeSource(sourceId);
}


function addPolygon(polygonSourceId, polygonLayerId, polygonFeature) {

  if (!map.getSource(polygonSourceId)) {
            
    map.addSource(polygonSourceId, {
      type: "geojson",
      data: polygonFeature,
    });
  }          
    if(!map.getLayer(polygonLayerId)) {
      map.addLayer({
        id: polygonLayerId,
        type: "fill",
        source: polygonSourceId,

        layout: {},
        paint: {
          "fill-outline-color": "#ff0000",
          'fill-color': 'transparent'
        },
      });

       // Add a black outline around the polygon.
       map.addLayer({
        'id': `outline-${polygonLayerId}`,
        'type': 'line',
        'source': polygonSourceId,
        'layout': {},
        'paint': {
            'line-color': "#ff0000",
            'line-width': 3
        }
    });

      
    }
}

function addRaster(itemIds, feature, polygonId, fromZoom) {
    var props = feature.properties;
    const collection = "emit-ch4plume-v1";
    const assets = "ch4-plume-emissions";

    if (!IDS_ON_MAP.has(feature.id)) {
        var subset = itemIds.filter((item) =>
            props["Data Download"].includes(item.id)
        );

        subset.forEach(function(item) {
        const TILE_URL =
            "https://ghg.center/api/raster/stac/tiles/WebMercatorQuad/{z}/{x}/{y}@1x" +
            "?collection=" +
            collection +
            "&item=" +
            item.id +
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
            bounds: item.bbox,
        });
        const layer_id = "raster-layer-" + feature.id
        map.addLayer({
            id: layer_id,
            type: "raster",
            source: "raster-source-" + feature.id,
            paint: {},
        });

        // Check if the eye is open, if so add the layer
        map.setLayoutProperty(
            layer_id,
            "visibility",
            layerToggled ?
            "visible" :
            "none"
        );

        map.moveLayer(polygonId);
        RASTER_IDS_ON_MAP.add(feature);
        });

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








async function main() {



    map.on("load", async () => {

        const methanMetadata = await (
            await fetch(`${PUBLIC_URL}/data/combined_plume_metadata.json`)
          ).json();
          const methaneStacMetadata = await (
            await fetch(`${PUBLIC_URL}/data/methane_stac.geojson`)
          ).json();
        const features = methanMetadata.features;

        $("#lds-roller-id").css({'display': 'none'});


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



        // Filter and set IDs for points
        features
            .filter((f) => f.geometry.type === "Point")
            .map((f, i) => {
                f.id = i;
                return f;
            });

        const itemIds = methaneStacMetadata.features.map((feature) => feature);


        points.forEach(function(point) {
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
              polygon.feature

            );

            if (map.getSource("raster-source-" + point.feature.id)) {
              removeLayers(
                "raster-source-" + point.feature.id,
                ["raster-layer-" + point.feature.id]

              )
              RASTER_IDS_ON_MAP.delete(point.feature);
              IDS_ON_MAP.delete(point.feature.id)
            }
            else {
              addRaster(
                itemIds,
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
          polygon.feature
        )


        addRaster(
            itemIds,
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
                            markerProps[layerID].addTo(map)
                            MARKERS_ON_MAP.add(point);


                        } else {
                            markerProps[layerID].remove()
                            MARKERS_ON_MAP.delete(point);

                        }



                    }


                    for (const feature of RASTER_IDS_ON_MAP) {
                        let layerID = "raster-layer-" + feature.id;
                        let point_date = new Date(feature.properties["UTC Time Observed"]);
                        let boolDisplay = layerToggled && point_date >= startDate && point_date <= stopDate;
                        map.setLayoutProperty(
                            layerID,
                            "visibility",
                            boolDisplay ?
                            "visible" :
                            "none"
                        );
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

    if (isWithinBounds ) {
      $(`#marker-${marker.id}`).css({"visibility": "hidden"});
      const polygon = polygons[marker.id];
      addPolygon(
        `polygon-source-${polygon.id}`,
        `polygon-layer-${polygon.id}`,
        polygon.feature

      );
      POLYGON_ADDED.add(polygon);
    } 
  
  });  
  

  }

  else {
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
      $(`#marker-${polygonAdded.id}`).css({"visibility": "visible"});

    })
  }

}
)

main();
