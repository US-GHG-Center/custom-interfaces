
// MapBoxViewerWrapper.jsx
import React from "react";
import { useConfig } from "../../context/configContext";
import { ConcentrationChart } from "./concentrationChart";

export default function ConcentrationChartWrapper(props) {
  const { config } = useConfig();
  return <ConcentrationChart {...props} config={config} />;
}
