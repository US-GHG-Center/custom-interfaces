import React, { useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Box from '@mui/material/Box';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { MapBoxViewer } from '../../components/mapboxViewer';
import { Title } from '../../components/title';
import { ConcentrationChart } from '../../components/chart';
import { SelectGHG } from '../../components/dropdown';

import "./index.css";

export function Dashboard({ stations, selectedStationId, setSelectedStationId, ghg, agency, region, stationCode, setSelectedGHG, zoomLevel }) {
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
            maxSize={100}
            defaultSize={100}
            className='panel'
          >
            { stations && <MapBoxViewer
                            stations={stations}
                            region={region}
                            agency={agency}
                            stationCode={stationCode}
                            zoomLevel={zoomLevel}
                            setSelection={setSelectedStationId}
                            setDisplayChart={setDisplayChart}
                          />}
            { displayChart && <SelectGHG selectedGHG={ghg} setSelectedGHG={setSelectedGHG} /> }
          </Panel>
              { displayChart &&
                <>
                  <PanelResizeHandle className='resize-handle'>
                    <DragHandleIcon title="Resize"/>
                  </PanelResizeHandle>
                  <Panel maxSize={75} minSize={40} defaultSize={40} className='panel panel-timeline'>
                    <ConcentrationChart
                      selectedStationId={selectedStationId}
                      setSelectedStationId={setSelectedStationId}
                      setDisplayChart={setDisplayChart}
                      ghg={ghg}
                    />
                  </Panel>
                </>
              }
        </PanelGroup>
    </Box>
  );
}