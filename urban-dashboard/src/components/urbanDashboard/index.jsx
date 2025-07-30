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
}) {
  return (
    <ConfigProvider userConfig={config}>
      <CssBaseline />
      <DashboardContainer
        defaultZoomLevel={defaultZoomLevel}
        defaultZoomLocation={defaultZoomLocation}
        defaultDataset={defaultDataset}
      />
    </ConfigProvider>
  );
}

export function UrbanDashboardContainer({ defaultZoomLevel, defaultZoomLocation }) {
  const [searchParams] = useSearchParams();
  const dataset = searchParams.get("dataset"); //vulcan, gra2pes (default)
  const zoomLevel = defaultZoomLevel || searchParams.get("zoom-level");
  const zoomLocation = defaultZoomLocation || searchParams.get("zoom-location");
  return (
    <UrbanDashboard
      defaultZoomLevel={zoomLevel}
      defaultZoomLocation={zoomLocation}
      defaultDataset={dataset}
    />
  );
}
