// MapBoxViewerWrapper.jsx
import React from "react";
import { useConfig } from "../../context/configContext";
import { MapBoxViewer } from "./MapboxViewer";

export default function MapBoxViewerWrapper(props) {
  const { config } = useConfig();
  return <MapBoxViewer {...props} config={config} />;
}
