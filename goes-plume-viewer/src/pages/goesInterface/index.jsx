import React from "react";
import { DashboardContainer } from "../dashboardContainer";
import { ConfigProvider } from "../../context/configContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import CssBaseline from "@mui/material/CssBaseline";
import { useSearchParams } from "react-router-dom";

export function GoesInterface({
  config = {},
  defaultCollectionId,
  defaultZoomLocation,
  defaultZoomLevel,
}) {
  return (
    <ConfigProvider userConfig={config}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DashboardContainer
          defaultCollectionId={defaultCollectionId}
          defaultZoomLocation={defaultZoomLocation}
          defaultZoomLevel={defaultZoomLevel}
        />
      </LocalizationProvider>
    </ConfigProvider>
  );
}

export function GoesInterfaceContainer({
  defaultCollectionId,
  defaultZoomLocation,
  defaultZoomLevel,
}) {
  // get the query params
  const [searchParams] = useSearchParams();
  const zoomLocation = searchParams.get("zoom-location") || defaultZoomLocation;
  const zoomLevel = searchParams.get("zoom-level") || defaultZoomLevel;
  const collectionId = searchParams.get("collection-id") || defaultCollectionId;

  return (
    <GoesInterface
      defaultCollectionId={collectionId}
      defaultZoomLocation={zoomLocation}
      defaultZoomLevel={zoomLevel}
    />
  );
}
