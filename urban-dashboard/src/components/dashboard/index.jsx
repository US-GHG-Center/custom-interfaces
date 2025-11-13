import React, { useState } from 'react';
import Box from '@mui/material/Box';

import { MapBoxViewer } from '../mapboxViewer';
import { InfoSidebar } from '../infoSidebar';
// import { Banner } from '../banner';

// const BANNER_TEXT = "Due to the lapse in federal government funding, the U.S. Greenhouse Gas Center is not updating this website. We sincerely regret this inconvenience.";

export function Dashboard({ dataset, urbanRegions }) {
  const [urbanRegion, setUrbanRegion] = useState("");
  const [zoomOut, setZoomOut] = useState(false);

  const handleZoomOut = () => {
    setZoomOut(!zoomOut);
  };

  return (
    <Box
      className="fullSize"
      sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* <Banner text={BANNER_TEXT} /> */}
      <Box sx={{ flex: 1, position: 'relative', minHeight: 0 }}>
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
    </Box>
  );
}
