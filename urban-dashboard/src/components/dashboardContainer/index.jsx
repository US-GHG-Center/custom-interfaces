import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import { generateUrbanRegions } from "./helper";
import { Dashboard } from "../dashboard";
import { useConfig } from "../../context/configContext";

export function DashboardContainer({
  defaultZoomLevel,
  defaultZoomLocation,
  defaultDataset,
  selectedAoi,
  selectedUrbanRegion,
  updateURLParams
}) {
  const { config } = useConfig();
  const [dataset] = useState(defaultDataset || "gra2pes"); //vulcan, gra2pes (default)
  const [urbanRegions, setUrbanRegions] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(defaultZoomLevel);
  const [zoomLocation, setZoomLocation] = useState(defaultZoomLocation);
  useEffect(() => {
    const fetchUrbanRegions = async () => {
      const regions = await generateUrbanRegions(config);
      setUrbanRegions(regions);
    };

    fetchUrbanRegions();
  }, []);

  return (
    <>
      {urbanRegions.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            width: "100vw",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Dashboard
          zoomLevel={zoomLevel}
          zoomLocation={zoomLocation}
          dataset={dataset}
          urbanRegions={urbanRegions}
          selectedAoi={selectedAoi}
          selectedUrbanRegion={selectedUrbanRegion}
          updateURLParams={updateURLParams}
        />
      )}
    </>
  );
}
