import React from "react";
import { DashboardContainer } from "../dashboardContainer";
import { ConfigProvider } from "../../context/configContext";

export function GoesInterface({ config = {}, defaultCollectionId,
  defaultZoomLocation,
  defaultZoomLevel }) {
  return (
    <ConfigProvider userConfig={config}>
      <DashboardContainer defaultCollectionId={defaultCollectionId} defaultZoomLocation={defaultZoomLocation} defaultZoomLevel={defaultZoomLevel} />
    </ConfigProvider>
  );
}
