export const dataPreprocess = (features) => {
  const time = [];
  const concentration = [];
  features.forEach((feature) => {
    if (feature && feature.properties) {
      time.push(feature.properties.datetime);
      concentration.push(feature.properties.value);
    }
  });
  return { time, concentration };
};

export const getYAxisLabel = (ghg) => {
  let label =
    ghg === "ch4" ? "CH₄ Concentration (ppb)" : "CO₂ Concentration (ppm)";
  return label;
};

export const getChangedGHGStationId = (selectedStationId, changedGHG) => {
  // collectionId format: <agency>_<data_category>_<region>_<sitecode>_<ghg>_<frequency>_concentrations
  let stationId = selectedStationId.split("_");
  stationId[4] = changedGHG;
  let changedStationId = stationId.join("_");
  return changedStationId;
};

export const getStationCode = (stationId) => {
    // collectionId format: <agency>_<data_category>_<region>_<sitecode>_<ghg>_<frequency>_concentrations
  let stationIdParts = stationId.split("_");
  let stationCode = stationIdParts[3];
  return stationCode.toUpperCase();
};

export const isChartZoomed = (chart, initialScaleLimits) => {
  if (!chart || Object.keys(initialScaleLimits).length === 0) {
    return false;
  }
  const xScale = chart.scales["x"];
  const yScale = chart.scales["y"];
  return (
    xScale.min !== initialScaleLimits.x.min ||
    xScale.max !== initialScaleLimits.x.max ||
    yScale.min !== initialScaleLimits.y.min ||
    yScale.max !== initialScaleLimits.y.max
  );
};