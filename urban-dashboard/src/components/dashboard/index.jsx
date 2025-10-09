import React, { useState } from 'react';
import Box from '@mui/material/Box';

import { MapBoxViewer } from '../mapboxViewer';
import { InfoSidebar } from '../infoSidebar';

export function Dashboard({ dataset, aoi, urbanRegion: initialUrbanRegion, urbanRegions, updateURLParams }) {
  const [urbanRegion, setUrbanRegion] = useState(initialUrbanRegion || "");
  const [zoomOut, setZoomOut] = useState(false);

  const handleZoomOut = () => {
    setZoomOut(!zoomOut);
  };

  const handleUrbanRegionChange = (regionName) => {
    setUrbanRegion(regionName);
    updateURLParams({ region: regionName });
  };

  return (
    <Box
      className="fullSize">
      <InfoSidebar
        urbanRegions={urbanRegions}
        selection={urbanRegion}
        setSelection={handleUrbanRegionChange}
        handleZoomOut={handleZoomOut}
        dataset={dataset}
      />
      <MapBoxViewer
        urbanRegions={urbanRegions}
        urbanRegion={urbanRegion}
        setSelection={handleUrbanRegionChange}
        zoomOut={zoomOut}
        dataset={dataset}
        aoi={aoi}
      />
    </Box>
  );
}
