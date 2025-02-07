import React, { useState } from 'react';
import Box from '@mui/material/Box';

import { MapBoxViewer } from '../mapboxViewer';

import { InfoSidebar } from '../infoSidebar';

export function Dashboard({ dataset, urbanRegions }) {
  const [urbanRegion, setUrbanRegion] = useState("");
  const [zoomOut, setZoomOut] = useState(false);

  const handleZoomOut = () => {
    setZoomOut(!zoomOut);
  };

  return (
    <Box
      className="fullSize">
      <InfoSidebar
        urbanRegions={urbanRegions}
        selection={urbanRegion}
        setSelection={setUrbanRegion}
        handleZoomOut={handleZoomOut}
        dataset={dataset}
      />
      <MapBoxViewer
        urbanRegions={urbanRegions}
        urbanRegion={urbanRegion}
        setSelection={setUrbanRegion}
        zoomOut={zoomOut}
        dataset={dataset}
      />
    </Box>
  );
}
