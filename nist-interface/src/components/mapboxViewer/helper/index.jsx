export const getLocationToZoom = (stations, stationCode) => {
  if (stations.length<1) {
      return null;
  }
  if (stationCode) {
      let station = stations.find(station => station.id.includes(stationCode));
      if (station) {
          let { properties: {longitude, latitude} } = station;
          let location = [longitude, latitude];
          return location;
      }
  }
  // TODO: ideally, if variance is less, then take mean center else take mode center
  return getMeanCenterOfLocation(stations);
}

export const getZoomLevel = (region, agency, stationCode, zoomLevelInQueryParam) => {
  if (zoomLevelInQueryParam) {
      // zoom-level in queryParam has highest precedence
      return zoomLevelInQueryParam;
  }
  if (stationCode) {
      // station-code present in queryParam has second highest precedence
      return 6;
  }
  if (agency && region) {
      return 5;
  }
  if (agency === "nist" && !region) {
      // NIST dataset is for CONUS region, so zoom more to CONUS
      return 4;
  }
  return 2;
}

export const getMeanCenterOfLocation = (stations) => {
  // go through the stations and average the lat and lon to get the center
  let latSum = 0;
  let lonSum = 0;
  stations.forEach((station) => {
      let { properties: {longitude, latitude} } = station;
      latSum += latitude;
      lonSum += longitude;
  });
  let latCenter = latSum / stations.length;
  let lonCenter = lonSum / stations.length;
  return [lonCenter, latCenter];
}

export const getToolTipContent = (stationProperties) => {
  const elevationUnit = "m";

  let { city, country, elevation_m, instrument_type, latitude_nwse, longitude_nwse,
        state, station_code, station_name, status, top_agl_m} = stationProperties;

  if (top_agl_m.includes(",")) {
      // there are multiple heights, so add unit to each height
      let topAglArray = top_agl_m.replace(",", " m, ");
      top_agl_m = topAglArray
  }

  // siteCode acornym and full name
  let siteNameAddOn = station_name ? ` : ${station_name}` : "";
  let siteNameRow = `<strong>${station_code.toUpperCase()}${siteNameAddOn}</strong><br>`;
  // site region
  let cityAddOn = city ? `${city},` : "";
  let regionAddOn = state ? `${cityAddOn} ${state},` : "";
  // siteCountry
  let addressRow = country ? `<i>${regionAddOn} ${country}</i><br>` : "";
  // longitude
  let longRow = longitude_nwse ? `Longitude: ${longitude_nwse}<br>` : "";
  // latitude
  let latRow = latitude_nwse ? `Latitude: ${latitude_nwse}<br>` : "";
  // elevation
  // let fifthRow = elevation ? `Elevation: ${Number(elevation).toFixed(2)} ${elevationUnit}<br>` : "";
  let elevationRow = elevation_m ? `Elevation: ${elevation_m} ${elevationUnit}<br>` : "";
  // sampling height
  let samplingHeightRow = top_agl_m ? `Sampling Height: ${top_agl_m} ${elevationUnit}<br>` : "";
  // instrumentType
  let instrumentRow = instrument_type ? `Instrument Type: ${instrument_type}<br>` : "";
  // stationStatus
  let stationStatusRow = status ? `Station Status: ${status}<br>` : "";
  // combine all the rows
  let result = siteNameRow + addressRow + "<hr>" + longRow + latRow + elevationRow + samplingHeightRow + instrumentRow + stationStatusRow;
  return result;
}

export const getUniqueRegions = (stations) => {
  // got through all station. scrape out the region name from id
  // then make a hash of the unique regions.
  let memo = {};
  let idx = 0;
  for (let i=0; i<stations.length; i++) {
      let station = stations[i];
      // <agency>_<data_category>_<region>_<sitecode>_<ghg>_<frequency>_concentrations
      let regionName = getStationRegion(station.id);
      let regionFullName = station.properties.region;
      if (!(regionName in memo)) {
          memo[regionName] = { index: idx, fullName: regionFullName };
          idx++;
      }
  }
  return memo;
}

export const getStationRegion = (stationId) => {
  return stationId.split("_")[2];
}