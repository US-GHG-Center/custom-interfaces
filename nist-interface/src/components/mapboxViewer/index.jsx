// MapBoxViewerWrapper.jsx
import React from "react";
import { useConfig } from "../../context/configContext";
import { MapBoxViewer } from "./mapboxViewer";

export default function MapBoxViewerWrapper(props) {
  const { config } = useConfig();
  return <MapBoxViewer {...props} config={config} />;
}
