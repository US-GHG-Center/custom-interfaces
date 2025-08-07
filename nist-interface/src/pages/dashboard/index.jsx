import React, { useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Box from "@mui/material/Box";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { Title } from "../../components/title";
import { SelectGHG } from "../../components/dropdown";
import "./index.css";
import MapBoxViewerWrapper from "../../components/mapboxViewer";
import ConcentrationChartWrapper from "../../components/chart";

export function Dashboard({
  stations,
  selectedStationId,
  setSelectedStationId,
  ghg,
  agency,
  region,
  stationCode,
  setSelectedGHG,
  zoomLevel,
  stationMetadata,
}) {
  const [displayChart, setDisplayChart] = useState(false);
  const logo = new URL("../../nist.png", import.meta.url);
  useEffect(() => {
    if (selectedStationId) {
      setDisplayChart(true);
    }
  }, [selectedStationId]); // only on selectedStationId prop change
  return (
    <Box className="fullSize">
      <Title ghg={ghg} agency={agency} region={region} />
      <img src={logo} alt="NIST" className="logo" />
      <PanelGroup direction="vertical" className="panel-wrapper">
        <Panel
          id="map-panel"
          maxSize={100}
          defaultSize={100}
          minSize={25}
          className="panel"
          order={1}
        >
          <div id="dashboard-map-container">
            {stations && (
              <MapBoxViewerWrapper
                stations={stations}
                region={region}
                agency={agency}
                stationCode={stationCode}
                zoomLevel={zoomLevel}
                setSelection={setSelectedStationId}
                setDisplayChart={setDisplayChart}
                displayChart={displayChart}
              />
            )}
            {displayChart && (
              <SelectGHG selectedGHG={ghg} setSelectedGHG={setSelectedGHG} />
            )}
          </div>
        </Panel>
        {displayChart && (
          <>
            <PanelResizeHandle className="resize-handle">
              <DragHandleIcon title="Resize" />
            </PanelResizeHandle>
            <Panel
              id="chart-panel"
              maxSize={75}
              minSize={40}
              className="panel panel-timeline"
              order={2}
            >
              <ConcentrationChartWrapper
                selectedStationId={selectedStationId}
                setSelectedStationId={setSelectedStationId}
                stationMetadata={stationMetadata}
                ghg={ghg}
                setDisplayChart={setDisplayChart}
              />
            </Panel>
          </>
        )}
      </PanelGroup>
    </Box>
  );
}
