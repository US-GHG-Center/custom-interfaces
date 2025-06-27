import React from "react";
import { DashboardContainer } from "../dashboardContainer";
import { ConfigProvider } from "../../context/configContext";

export function UrbanDashboard({ config = {}, defaultZoomLevel, defaultZoomLocation }) {
  return (
    <ConfigProvider userConfig={config}>
      <DashboardContainer defaultZoomLevel={defaultZoomLevel} defaultZoomLocation={defaultZoomLocation} />
    </ConfigProvider>
  );
}
