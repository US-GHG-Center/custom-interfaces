import React from "react";
import { DashboardContainer } from "../dashboardContainer";
import { ConfigProvider } from "../../context/configContext";
import { useSearchParams } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

export function UrbanDashboard({
  config = {},
  defaultZoomLevel,
  defaultZoomLocation,
  defaultDataset,
  selectedAoi,
  selectedUrbanRegion,
  updateURLParams
}) {
  return (
    <ConfigProvider userConfig={config}>
      <CssBaseline />
      <DashboardContainer
        defaultZoomLevel={defaultZoomLevel}
        defaultZoomLocation={defaultZoomLocation}
        defaultDataset={defaultDataset}
        selectedAoi={selectedAoi}
        selectedUrbanRegion={selectedUrbanRegion}
        updateURLParams={updateURLParams}
      />
    </ConfigProvider>
  );
}

export function UrbanDashboardContainer({ defaultZoomLevel, defaultZoomLocation }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const dataset = searchParams.get("dataset"); //vulcan, gra2pes (default)
  const zoomLevel = defaultZoomLevel || searchParams.get("zoom-level");
  const zoomLocation = defaultZoomLocation || searchParams.get("zoom-location");
  const aoi = searchParams.get("aoi"); // CONUS, state names, etc.
  const urbanRegion = searchParams.get("region"); // Selected urban region

  const updateURLParams = (newParams) => {
    const currentParams = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
            currentParams.delete(key);
        } else {
            currentParams.set(key, value);
        }
    });
    setSearchParams(currentParams);
  };

  return (
    <UrbanDashboard
      defaultZoomLevel={zoomLevel}
      defaultZoomLocation={zoomLocation}
      defaultDataset={dataset}
      selectedAoi={aoi}
      selectedUrbanRegion={urbanRegion}
      updateURLParams={updateURLParams}
    />
  );
}
