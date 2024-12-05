const measureVariables = {
    measureToggled: false,
    scale: "miles",
    scaleText: "mi",
  };
  
  function toggleMeasureIcon(measureToggled) {
    if (measureToggled) {
      $("#measure-icon i")
        .removeClass("fa-ruler-horizontal")
        .addClass("fa-arrows-left-right-to-line");
    } else {
      $("#measure-icon i")
        .removeClass("fa-arrows-left-right-to-line")
        .addClass("fa-ruler-horizontal");
    }
  }
  
  // GeoJSON object to hold  measurement features
  const distancePoints = {
    type: "FeatureCollection",
    features: [],
  };
  const measureLine = {
    type: "FeatureCollection",
    features: [],
  };
  //GeoJson object to hold distance label
  const distanceLabel = {
    type: "FeatureCollection",
    features: [],
  };
  
  // Used to draw a line between points
  const linestring = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [],
    },
  };
  const pointLayer = {
    id: "measure-points",
    type: "circle",
    source: "distancePoints",
    paint: {
      "circle-radius": 4.5,
      "circle-color": "#00BFFF",
    },
    filter: ["in", "$type", "Point"],
  };
  const labelLayer = {
    id: "measure-label",
    type: "symbol",
    source: "distanceLabel",
    layout: {
      "text-field": ["get", "description"],
      "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
      "text-size": 13,
      "text-letter-spacing": 0.1,
      "text-justify": "center",
      "symbol-spacing": 1000,
      "text-offset": [0, 1.5],
      "text-anchor": "bottom",
    },
    paint: {
      "text-color": "#fff",
      "text-halo-color": "#000",
      "text-halo-width": 2,
    },
  };
  
  const lineLayer = {
    id: "measure-line",
    type: "line",
    source: "measureLine",
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#00BFFF",
      "line-width": 2,
    },
    filter: ["in", "$type", "LineString"],
  };
  
  //distance label Symbol
  const distanceLabelAnchor = {
    type: "Feature",
    properties: {
      description: "",
    },
    geometry: {
      type: "LineString",
      coordinates: [],
    },
  };
  
  const onClearDistanceClick = (map) => {
    distancePoints.features.length = 0;
    measureLine.features.length = 0;
    distanceLabel.features.length = 0;
    map.getSource("distanceLabel").setData(distanceLabel);
    map.getSource("measureLine").setData(distanceLabel);
    map.getSource("distancePoints").setData(distancePoints);
    $("#clear-icon-main").removeClass("clicked");
  };
  
  function changeCursor(map) {
    const totalPoints = distancePoints.features.filter(
      (f) => f.geometry.type === "Point"
    );
    // Change the cursor to a pointer when hovering over a point on the map.
    // Otherwise cursor is a crosshair.
    const crosshair = totalPoints.length < 2 && measureVariables.measureToggled;
    map.getCanvas().style.cursor = crosshair ? "crosshair" : "pointer";
  }
  
  function addMeasurementAnchor(e, map) {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["measure-points"],
    });
    const totalPoints = distancePoints.features.filter(
      (f) => f.geometry.type === "Point"
    );
    // If a feature was clicked, remove it from the map.
    if (features.length) {
      const id = features[0].properties.id;
      distancePoints.features = distancePoints.features.filter(
        (point) => point.properties.id !== id
      );
      measureLine.features.length = 0;
    }
    if (totalPoints.length == 1 && features.length == 0) {
      distancePoints.features.length = 0;
      measureLine.features.length = 0;
      distanceLabel.features.length = 0;
    }
    if (totalPoints.length == 0 && features.length == 0) {
      const point = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [e.lngLat.lng, e.lngLat.lat],
        },
        properties: {
          id: String(new Date().getTime()),
        },
      };
      distancePoints.features.push(point);
    }
  
    if (distancePoints.features.length > 0) {
      $("#clear-icon-main").addClass("clicked");
    }
    if (distancePoints.features.length == 0) {
      $("#clear-icon-main").removeClass("clicked");
    }
    map.getSource("distanceLabel").setData(distanceLabel);
    map.getSource("distancePoints").setData(distancePoints);
    map.getSource("measureLine").setData(measureLine);
    map.moveLayer("measure-points");
    map.moveLayer("measure-label");
  }
  
  function disableMeasurementMode(map) {
    toggleMeasureIcon(measureVariables.measureToggled);
    onClearDistanceClick(map);
    $("#display_props").removeClass("hidden");
    $("#plume-id-search-box").removeClass("disabled");
    $(".date-range").removeClass("disabled");
    measureVariables.measureToggled = !measureVariables.measureToggled;
    changeCursor(map);
  }
  
  function addMeasurementSource(map) {
    map.addSource("distancePoints", {
      type: "geojson",
      data: distancePoints,
    });
    map.addSource("measureLine", {
      type: "geojson",
      data: measureLine,
    });
    map.addSource("distanceLabel", {
      type: "geojson",
      data: distanceLabel,
    });
  }
  
  function addMeasurementLayer(map) {
    map.addLayer(pointLayer);
    map.addLayer(labelLayer);
    map.addLayer(lineLayer);
  }
  
  function addMeasurementControls(map) {
    map.addControl(new MeasureDistance(map));
  }
  
  function addClearControl(map) {
    map.addControl(new ClearDistancePoints(map));
  }
  
  function createMeasuringLine(e, map) {
    measureLine.features.pop();
    const anchorPoint = distancePoints.features[0];
    const startCoordinates = anchorPoint.geometry.coordinates;
    const endCoordinates = [e.lngLat.lng, e.lngLat.lat];
    linestring.geometry.coordinates = [startCoordinates, endCoordinates];
    distanceLabelAnchor.geometry.coordinates = [endCoordinates, startCoordinates];
    // const value = document.createElement("pre");
    const turfUnits = measureVariables.scale === "miles" ? "miles" : "kilometers";
    const distance = turf.length(linestring, {
      units: turfUnits,
    });
    const labelUnit = measureVariables.scale === "miles" ? " miles" : " km";
    distanceLabelAnchor.properties.description = `${distance.toFixed(
      2
    )} ${labelUnit}`;
    distanceLabelAnchor.properties.icon = `${distance.toFixed(2)} ${labelUnit}`;
    measureLine.features.push(linestring);
    distanceLabel.features.push(distanceLabelAnchor);
    map.getSource("measureLine").setData(measureLine);
    map.getSource("distanceLabel").setData(distanceLabel);
    map.moveLayer("measure-line");
    map.moveLayer("measure-label");
  }
  class MapControls {
    onRemove() {
      this.container.parentNode.removeChild(this.container);
      this.map = undefined;
    }
  }
  class MeasureDistance extends MapControls {
    constructor(map) {
      super();
      this.onClick = this.onClick.bind(this);
      this.map = map;
    }
    onClick() {
      toggleMeasureIcon(measureVariables.measureToggled);
  
      measureVariables.measureToggled = !measureVariables.measureToggled;
      $("#display_props").toggleClass("hidden");
      $("#plume-id-search-box").toggleClass("disabled");
      $(".date-range").toggleClass("disabled");
  
      changeCursor(this.map);
      this.map.doubleClickZoom.disable();
    }
    onAdd(map) {
      this.map = map;
      this.container = document.createElement("div");
      this.container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
      this.container.addEventListener("contextmenu", (e) => e.preventDefault());
      this.container.addEventListener("click", (e) => this.onClick());
      this.container.innerHTML =
        '<div id="measure-icon-main">' +
        "<button>" +
        '<span id="measure-icon" class="mapboxgl-ctrl-icon" aria-hidden="true" title="Measure Tool">' +
        '<i class="fa-solid fa-arrows-left-right-to-line"></i>' +
        "</span>" +
        "</button>" +
        "</div>";
      return this.container;
    }
  }
  class ClearDistancePoints extends MapControls {
    constructor(map) {
      super();
      this.onClick = this.onClick.bind(this);
      this.map = map;
    }
    onClick() {
      onClearDistanceClick(this.map);
    }
    onAdd(map) {
      this.map = map;
      this.container = document.createElement("div");
      this.container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
      this.container.addEventListener("contextmenu", (e) => e.preventDefault());
      this.container.addEventListener("click", (e) => this.onClick());
      this.container.innerHTML =
        '<div id="clear-icon-main">' +
        "<button>" +
        '<span id="clear-icon" class="mapboxgl-ctrl-icon" aria-hidden="true" title="Measure Tool">' +
        '<i class="fa-solid fa-eraser"></i>' +
        "</span>" +
        "</button>" +
        "</div>";
      return this.container;
    }
  }
  
  module.exports = {
    //variables
    distancePoints: distancePoints,
    measureVariables: measureVariables,
    //methods
    addMeasurementAnchor: addMeasurementAnchor,
    disableMeasurementMode: disableMeasurementMode,
    createMeasuringLine: createMeasuringLine,
    addMeasurementSource: addMeasurementSource,
    addMeasurementLayer: addMeasurementLayer,
    addMeasurementControls: addMeasurementControls,
    addClearControl: addClearControl,
    //classes
    MapControls: MapControls,
  };
  