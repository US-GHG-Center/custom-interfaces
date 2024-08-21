import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { MapBoxViewer } from '../mapboxViewer';
import { Title } from '../title';
import { DetailAnalysis } from '../detailAnalysis';

export function Dashboard({ dataset }) {
  const [urbanRegion, setUrbanRegion] = useState("");
  const [zoomOut, setZoomOut] = useState(false);

  const handleZoomOut = () => {
    setZoomOut(!zoomOut);
  };

  return (
    <Box
      className="fullSize">
      <Title
        selection={urbanRegion}
        setSelection={setUrbanRegion}
        handleZoomOut={handleZoomOut}
      />
      <MapBoxViewer
        urbanRegion={urbanRegion}
        setSelection={setUrbanRegion}
        zoomOut={zoomOut}
        dataset={dataset}
      />
      {/* <DetailAnalysis/>
        <Box marginBottom={8} sx={{ height: "5%" }} /> */}
    </Box>
  );
}
