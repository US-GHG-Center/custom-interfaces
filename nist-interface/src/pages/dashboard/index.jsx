import React, { useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
// import { Banner } from '../../components/banner';
import Box from '@mui/material/Box';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { MapBoxViewer } from '../../components/mapboxViewer';
import { Title } from '../../components/title';
import { ConcentrationChart } from '../../components/chart';
import { SelectGHG } from '../../components/dropdown';
import { LoadingSpinner } from '../../components/loading';

import "./index.css";

// Banner text placeholder. Uncomment component, CSS changes and this line to enable banner.
// const BANNER_TEXT = "Placeholder banner text";

export function Dashboard({ stations, selectedStationId, setSelectedStationId, ghg, agency, region, stationCode, setSelectedGHG, zoomLevel, stationMetadata }) {
  const [displayChart, setDisplayChart] = useState(false);

  useEffect(() => {
    if (selectedStationId) {
      setDisplayChart(true);
    }
  }, [selectedStationId]); // only on selectedStationId prop change

  return (
    <Box className="fullSize">
      {/* <Banner text={BANNER_TEXT} /> */}
      <PanelGroup direction='vertical' className='panel-wrapper'>
        <Panel
          id='map-panel'
          maxSize={100}
          defaultSize={100}
          minSize={25}
          className='panel'
          order={1}
        >
          <div id="dashboard-map-container">
            {stations &&
              <div>
                <Title ghg={ghg} agency={agency} region={region} />        <img src={process.env.PUBLIC_URL + "/nist.png"} alt="NIST" className='logo' />
                <MapBoxViewer
                  stations={stations}
                  region={region}
                  agency={agency}
                  stationCode={stationCode}
                  zoomLevel={zoomLevel}
                  setSelection={setSelectedStationId}
                  setDisplayChart={setDisplayChart}
                  displayChart={displayChart}
                />
              </div>
            }
            {displayChart && <SelectGHG selectedGHG={ghg} setSelectedGHG={setSelectedGHG} />}
          </div>
        </Panel>
        {displayChart &&
          <>
            <PanelResizeHandle className='resize-handle'>
              <DragHandleIcon title="Resize" />
            </PanelResizeHandle>
            <Panel
              id='chart-panel'
              maxSize={75}
              minSize={40}
              className='panel panel-timeline'
              order={2}
            >
              <ConcentrationChart
                selectedStationId={selectedStationId}
                setSelectedStationId={setSelectedStationId}
                stationMetadata={stationMetadata}
                ghg={ghg}
                setDisplayChart={setDisplayChart}
              />
            </Panel>
          </>
        }
      </PanelGroup>
      {stations.length < 1 ? <LoadingSpinner /> : <></>}
    </Box>
  );
}