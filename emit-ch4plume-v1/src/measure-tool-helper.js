var measureToggled = false;

let scale = "miles";
const scaleText = scale === "miles" ? "mi" : scale;

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
const measurePointLayer = {
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

const linelayer = {
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
  const crosshair = totalPoints.length < 2 && measureToggled;
  map.getCanvas().style.cursor = crosshair ? "crosshair" : "pointer";
}

module.exports = {
  toggleMeasureIcon: toggleMeasureIcon,
  distancePoints: distancePoints,
  pointLayer: measurePointLayer,
  distanceLabel: distanceLabel,
  labelLayer: labelLayer,
  lineLayer: linelayer,
  linestring: linestring,
  distanceLabelAnchor: distanceLabelAnchor,
  measureLine: measureLine,
  scale: scale,
  scaleText: scaleText,
  measureToggled: measureToggled,
  onClearDistanceClick: onClearDistanceClick,
  changeCursor: changeCursor,
};
