import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import styled from "styled-components";

import MainMap from '../../components/mainMap';
import { MarkerFeature } from '../../components/mapMarker';
import { MapLayer } from '../../components/mapLayer';
import { PlumeAnimation } from '../../components/plumeAnimation';
import { MapControls } from "../../components/mapControls";
import { MapZoom } from '../../components/mapZoom';

import { PersistentDrawerRight } from "../../components/drawer";
import { Title } from "../../components/title";
import { extractRepPlumes, getRepPlume } from './helper';
import { Search } from "../../components/search";
import { FilterByDate } from '../../components/filter';

import "./index.css";
import { MeasurementLayer } from '../../components/measurementLayer';


const HorizontalLayout = styled.div`
    width: 90%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 15px;
`;

const scaleUnits = {
  KM: "km",
  MILES: "mi",
};

// // A representational plume for subdaily plumes
// interface dailyRepPlume {
//   id: string,
//   data: StacFeature, // object
//   location: [string, string] // lon, lat
//   dateTime: string // date of the plume
// }

export function Dashboard({
  dataTree,
  collectionId,
  metaData,
  zoomLevel,
  setZoomLevel,
}) {
  const [selectedPlume, setSelectedPlume] = useState(null); // plume id looks like BV1-1
  const [dailyRepPlumes, setDailyRepPlumes] = useState([]);
  const [filteredDailyRepPlumes, setFilteredDailyRepPlumes] = useState([]);
  const [dailyRepPlumeIds, setDailyRepPlumeIds] = useState([]);
  const [plumesForAnimation, setPlumesForAnimation] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);

  const [measureMode, setMeasureMode] = useState(false);
  const [clearMeasurementIcon, setClearMeasurementIcon] = useState(false);
  const [clearMeasurementLayer, setClearMeasurementLayer] = useState(false);
  const [mapScaleUnit, setMapScaleUnit] = useState(scaleUnits.MILES);

  const handleSelectedPlume = (dailyRepPlume) => {
    const { location, plumeId } = dailyRepPlume;
    setSelectedPlume(dailyRepPlume);
    setPlumesForAnimation(dataTree[plumeId]);
    setOpenDrawer(true);
    setZoomLevel(location);
  };

  const handleSearchSelectedPlumeId = (plumeId) => {
    const selectedPlume = getRepPlume(plumeId, dataTree);
    handleSelectedPlume(selectedPlume);
  };

  useEffect(() => {
    if (!dataTree) return;

    const dailyRepPlumes = extractRepPlumes(dataTree);
    const dailyRepPlumeIds = dailyRepPlumes.map((plume) => plume.plumeId);
    setDailyRepPlumes(dailyRepPlumes);
    setFilteredDailyRepPlumes(dailyRepPlumes);
    setDailyRepPlumeIds(dailyRepPlumeIds);
  }, [dataTree]);

  useEffect(() => {
    // helps the search feature to be on top of filter feature
    const dailyFilteredRepPlumeIds = filteredDailyRepPlumes.map(
      (plume) => plume.plumeId
    );
    setDailyRepPlumeIds(dailyFilteredRepPlumeIds);
  }, [filteredDailyRepPlumes]);

  return (
    <Box className="fullSize">
      <div id="dashboard-map-container">
        <MainMap>
          <Title>
            <HorizontalLayout>
              <Search
                ids={dailyRepPlumeIds}
                setSelectedPlumeId={handleSearchSelectedPlumeId}
              ></Search>
            </HorizontalLayout>
            <HorizontalLayout>
              <FilterByDate
                plumes={dailyRepPlumes}
                setFilteredPlumes={setFilteredDailyRepPlumes}
              />
            </HorizontalLayout>
            <HorizontalLayout>
              <PlumeAnimation plumes={plumesForAnimation} />
            </HorizontalLayout>
          </Title>
          <MarkerFeature
            plots={filteredDailyRepPlumes}
            setSelectedPlume={handleSelectedPlume}
          ></MarkerFeature>
          <MapLayer plume={selectedPlume}></MapLayer>
          <MeasurementLayer
            measureMode={measureMode}
            setMeasureMode={setMeasureMode}
            setClearMeasurementIcon={setClearMeasurementIcon}
            clearMeasurementLayer={clearMeasurementLayer}
            setClearMeasurementLayer={setClearMeasurementLayer}
            mapScaleUnit={mapScaleUnit}
          />
          <MapControls
            measureMode={measureMode}
            onClickHamburger={() => setOpenDrawer(true)}
            onClickMeasureMode={() => {
              setMeasureMode((measureMode) => !measureMode);
            }}
            onClickClearIcon={() => {
              setClearMeasurementLayer(true);
            }}
            clearMeasurementIcon={clearMeasurementIcon}
            mapScaleUnit={mapScaleUnit}
            setMapScaleUnit={setMapScaleUnit}
          />
          <MapZoom zoomLevel={zoomLevel} />
        </MainMap>
        <PersistentDrawerRight
          open={openDrawer}
          setOpen={setOpenDrawer}
          selectedPlume={selectedPlume}
          collectionId={collectionId}
        />
      </div>
    </Box>
  );
}
