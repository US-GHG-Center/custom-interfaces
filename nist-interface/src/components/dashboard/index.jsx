import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { MapBoxViewer } from '../mapboxViewer';
import { Title } from '../title';
import { ConcentrationChart } from '../chart';

export function Dashboard({ NISTStations, selectedStationId, setSelectedStationId }) {
  const [ displayChart, setDisplayChart ] = useState(false);

  useEffect(() => {
    if (selectedStationId) {
      setDisplayChart(true);
    }
  }, [selectedStationId]); // only on selectedStationId prop change

  return (
    <Box className="fullSize">
        <Title selection={selectedStationId}/>
        { NISTStations && <MapBoxViewer stations={NISTStations} setSelection={setSelectedStationId} setDisplayChart={setDisplayChart} />}
        { displayChart && <ConcentrationChart selectedStationId={selectedStationId} setDisplayChart={setDisplayChart}/> }
    </Box>
  );
}