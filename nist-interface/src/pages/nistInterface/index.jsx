import React from "react";
import { DashboardContainer } from "../dashboardContainer";
import { ConfigProvider } from "../../context/configContext";
import CssBaseline from "@mui/material/CssBaseline";

export function NistInterface({ config = {}, defaultZoomLevel }) {
  return (
    <ConfigProvider userConfig={config}>
       <CssBaseline />
      <DashboardContainer defaultZoomLevel={defaultZoomLevel} />
    </ConfigProvider>
  );
}
