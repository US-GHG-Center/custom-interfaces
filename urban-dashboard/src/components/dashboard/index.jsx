import React, { useState } from 'react';
import Box from '@mui/material/Box';

import { InfoSidebar } from '../infoSidebar';
import MapBoxViewerWrapper from '../mapboxViewer/MapboxViewerWrapper';

export function Dashboard({
    dataset,
    urbanRegions,
    zoomLevel,
    zoomLocation,
    selectedAoi,
    selectedUrbanRegion,
    updateURLParams
  }) {
  const [urbanRegion, setUrbanRegion] = useState(selectedUrbanRegion);
  const [zoomOut, setZoomOut] = useState(false);
  const handleZoomOut = () => {
    setZoomOut(!zoomOut);
  };

  const handleUrbanRegionSelection = (region) => {
    updateURLParams({
      region: region
    });
    setUrbanRegion(region)
  }

  return (
    <Box
      className="fullSize">
      <div className="dashboard-container">
        <InfoSidebar
          urbanRegions={urbanRegions}
          selection={urbanRegion}
          setSelection={handleUrbanRegionSelection}
          handleZoomOut={handleZoomOut}
          dataset={dataset}
        />
        <MapBoxViewerWrapper
          urbanRegions={urbanRegions}
          urbanRegion={urbanRegion}
          setSelection={handleUrbanRegionSelection}
          zoomOut={zoomOut}
          dataset={dataset}
          zoomLevel={zoomLevel}
          zoomLocation={zoomLocation}
          selectedAoi={selectedAoi}
        />
      </div>
    </Box>
  );
}
