import React from "react";
import { DashboardContainer } from "../dashboardContainer";
import { ConfigProvider } from "../../context/configContext"
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";



export function GoesInterface({
  config = {},
  defaultCollectionId,
  defaultZoomLocation,
  defaultZoomLevel,
}) {
  return (
    <ConfigProvider userConfig={config}>
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
