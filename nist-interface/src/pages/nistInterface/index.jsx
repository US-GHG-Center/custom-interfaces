import React from "react";
import { DashboardContainer } from "../dashboardContainer";
import { ConfigProvider } from "../../context/configContext";
import CssBaseline from "@mui/material/CssBaseline";
import { useSearchParams } from "react-router-dom";
import { zoom } from "chartjs-plugin-zoom";

export function NistInterface({
  config = {},
  defaultZoomLevel,
  agency,
  dataCategory,
  region,
  ghg,
  stationCode,
}) {
  return (
    <ConfigProvider userConfig={config}>
      <CssBaseline />
      <DashboardContainer
        defaultZoomLevel={defaultZoomLevel}
        stationCode={stationCode}
        ghg={ghg}
        region={region}
        dataCategory={dataCategory}
        agency={agency}
      />
    </ConfigProvider>
  );
}

export function NistInterfaceContainer({defaultZoomLevel}) {
  const [searchParams] = useSearchParams();
  const agency = searchParams.get("agency"); // nist, noaa, or nasa
  const dataCategory = searchParams.get("data-category"); // testbed
  const region = searchParams.get("region"); // lam or nec
  const ghg = searchParams.get("ghg"); // co2 or ch4
  const stationCode = searchParams.get("station-code"); // buc, smt, etc
  const [zoomLevel] = useState(searchParams.get("zoom-level")||defaultZoomLevel)
  return (
    <NistInterface
      defaultZoomLevel={zoomLevel}
      stationCode={stationCode}
      ghg={ghg}
      region={region}
      dataCategory={dataCategory}
      agency={agency}
    />
  );
}
