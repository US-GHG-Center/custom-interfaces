import React, { useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Box from '@mui/material/Box';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { MapBoxViewer } from '../../components/mapboxViewer';
import { Title } from '../../components/title';
import { ConcentrationChart } from '../../components/chart';
import { SelectGHG } from '../../components/dropdown';

import "./index.css";

export function Dashboard({ stations, selectedStationId, setSelectedStationId, ghg, agency, region, stationCode, setSelectedGHG, zoomLevel, stationMetadata }) {
  const [ displayChart, setDisplayChart ] = useState(false);

  useEffect(() => {
    if (selectedStationId) {
      setDisplayChart(true);
    }
  }, [selectedStationId]); // only on selectedStationId prop change

  return (
    <Box className="fullSize">
        <Title ghg={ghg} agency={agency} region={region}/>
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
              { stations && <MapBoxViewer
                              stations={stations}
                              region={region}
                              agency={agency}
                              stationCode={stationCode}
                              zoomLevel={zoomLevel}
                              setSelection={setSelectedStationId}
                              setDisplayChart={setDisplayChart}
                              displayChart={displayChart}
                            />}
              { displayChart && <SelectGHG selectedGHG={ghg} setSelectedGHG={setSelectedGHG} /> }
            </div>
          </Panel>
              { displayChart &&
                <>
                  <PanelResizeHandle className='resize-handle'>
                    <DragHandleIcon title="Resize"/>
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
    </Box>
  );
}