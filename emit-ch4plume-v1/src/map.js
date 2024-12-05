// map.js
import mapboxgl from "mapbox-gl";
import {
    //variables
    measureVariables,
    //functions
    addMeasurementControls,
    //classes
    MapControls,
  } from "./measureToolHelper";
import { ZOOM_THRESHOLD } from './index.js';
mapboxgl.accessToken = process.env.MAP_ACCESS_TOKEN;
const MAP_STYLE = process.env.MAP_STYLE;

let map = null; 

class HomeButtonControl {
  onClick() {
      // Set the map's center and zoom to the desired location
      map.flyTo({
          center: [-98, 39], // Replace with the desired latitude and longitude
          zoom: 4,
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
          '<button id="refresh">' +
          '<span class="mapboxgl-ctrl-icon btn fa fa-home" aria-hidden="true" title="Reset To USA"></span>' +
          "</button>" +
          "</div>";
      return this.container;
  }
  onRemove() {
      this.container.parentNode.removeChild(this.container);
      this.map = undefined;
  }
}
export var layerToggled = true;
class LayerButtonControl extends MapControls {
  onClick() {
    // Toggle the icon between eye and eye-slash
    $("#layer-eye").toggleClass("fa-eye fa-eye-slash");

    // Toggle the layer visibility state
    layerToggled = !layerToggled;

    // Get the layers from the map style
    const layers = this.map.getStyle().layers;

    // Loop through all layers
    layers.forEach((layer) => {
      // Check if the layer id starts with 'raster-'
      if (layer.id.startsWith('raster-')) {
        // If layerToggled is true, make it visible, else hide it
        const visibility = layerToggled ? 'visible' : 'none';
        map.setLayoutProperty(layer.id, 'visibility', visibility);
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
  
}

export var plumeListManuallyHidden = false;
class legendToggle {
  onClick() {
    if (map.getZoom() >= ZOOM_THRESHOLD) {
      const legendContainer = document.getElementById("plegend-container");
      const mapControls = document.querySelector('.mapboxgl-ctrl-top-right');
      if (legendContainer.style.right === '-380px' || legendContainer.style.right === '') {
        legendContainer.style.right = '10px';
        mapControls.style.right = '380px';
        plumeListManuallyHidden = false;
      } else {
        legendContainer.style.right = '-380px';
        mapControls.style.right = '10px';
        plumeListManuallyHidden = true;
      }
    }
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
          '<span class="mapboxgl-ctrl-icon btn fa fa-bars" aria-hidden="true" title="Toggle Plumes List"></span>' +
          "</button>" +
          "</div>";
      return this.container;
  }
  onRemove() {
      this.container.parentNode.removeChild(this.container);
      this.map = undefined;
  }
}

class ChangeMapUnit extends MapControls {
  constructor(mapScale) {
    super();
    this.mapScale = mapScale; 
  }

  onClick() {
    if (measureVariables.scale === "km") {
      measureVariables.scale = "miles";
    } else {
      measureVariables.scale = "km";
    }
    measureVariables.scaleText =
      measureVariables.scale === "miles" ? "mi" : "km";
    const mapScaleUnit =
    measureVariables.scale === "miles" ? "imperial" : "metric";
    this.mapScale.setUnit(mapScaleUnit);
    this.container.innerHTML = ` <div id="units-icon">
      <button>
      <span   class="mapboxgl-ctrl-icon" aria-hidden="true " title="Miles/Km">
      <i id="unit-icon-text" class=" " >
      ${measureVariables.scaleText}
        </i>
      </span>
      </button>
      </div>`;
  }
  onAdd(map) {
    this.map = map;
    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
    this.container.addEventListener("contextmenu", (e) => e.preventDefault());
    this.container.addEventListener("click", (e) => this.onClick());
    this.container.innerHTML = ` <div id="units-icon">
      <button>
      <span   class="mapboxgl-ctrl-icon" aria-hidden="true " title="Miles/Km">
      <i id="unit-icon-text" class=""  style="text-transform: none;" >
      ${measureVariables.scaleText}
        </i>
      </span>
      </button>
      </div>`;
    return this.container;
  }
}

// Function to initialize and return the map instance
export const getMapInstance = () => {
    if (!map) {
        map = new mapboxgl.Map({
            container: "map",
            style: MAP_STYLE,
            center: [-98, 39],
            zoom: 4,
        });

        // Disable map rotation using right-click drag and touch gestures
        map.dragRotate.disable();
        map.touchZoomRotate.disableRotation();

        // Add zoom and rotation controls to the top-right corner of the map
        const zoomControl = new mapboxgl.NavigationControl();
        let mapScale = new mapboxgl.ScaleControl({
            unit: measureVariables.scale === "miles" ? "imperial" : "metric",
          });
        map.addControl(new legendToggle());
        map.addControl(mapScale);
        map.addControl(new HomeButtonControl());
        map.addControl(new LayerButtonControl());
        map.addControl(zoomControl, "top-right");
        addMeasurementControls(map);
        map.addControl(new ChangeMapUnit(mapScale)); 
        //addClearControl(map);
    }
    return map;
};

export default mapboxgl;
