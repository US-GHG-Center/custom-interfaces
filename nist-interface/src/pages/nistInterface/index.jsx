import React from "react";
import { DashboardContainer } from "../dashboardContainer";
import { ConfigProvider } from "../../context/configContext";

export function NistInterface({ config = {}, defaultZoomLevel }) {
  return (
    <ConfigProvider userConfig={config}>
      <DashboardContainer defaultZoomLevel={defaultZoomLevel} />
    </ConfigProvider>
  );
}
