import React, { useState } from 'react';
import Box from '@mui/material/Box';

import { InfoSidebar } from '../infoSidebar';
import MapBoxViewerWrapper from '../mapboxViewer/MapboxViewerWrapper';

export function Dashboard({ dataset, urbanRegions, zoomLevel, zoomLocation }) {
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
      <MapBoxViewerWrapper
        urbanRegions={urbanRegions}
        urbanRegion={urbanRegion}
        setSelection={setUrbanRegion}
        zoomOut={zoomOut}
        dataset={dataset}
        zoomLevel={zoomLevel}
        zoomLocation={zoomLocation}
      />
    </Box>
  );
}
