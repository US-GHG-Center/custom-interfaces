import React from "react";
import { DashboardContainer } from "../dashboardContainer";
import { ConfigProvider } from "../../context/configContext";

export function NistInterface({ config = {} }) {
  return (
    <ConfigProvider userConfig={config}>
      <DashboardContainer />
    </ConfigProvider>
  );
}
