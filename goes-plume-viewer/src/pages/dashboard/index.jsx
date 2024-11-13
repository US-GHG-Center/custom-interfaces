import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import styled from "styled-components";

import MainMap from '../../components/mainMap';
import { MarkerFeature } from '../../components/mapMarker';
import { MapLayers } from '../../components/mapLayer';
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

export function Dashboard({ dataTree, collectionId, metaData, zoomLevel, setZoomLevel }) {
  const [ regions, setRegions ] = useState([]);
  const [ plumes, setPlumes ] = useState([]);
  const [ selectedPlumeId, setSelectedPlumeId ] = useState(null);
  const [ selectedRegionId, setSelectedRegionId ] = useState(null); //string

  const [ filteredDailyRepPlumes, setFilteredDailyRepPlumes ] = useState([]);
  const [ plumeIds, setPlumeIds ] = useState([]);
  const [ plumesForAnimation, setPlumesForAnimation ] = useState([]);
  const [ openDrawer, setOpenDrawer ] = useState(false);

  const [measureMode, setMeasureMode] = useState(false);
  const [clearMeasurementIcon, setClearMeasurementIcon] = useState(false)
  const [clearMeasurementLayer, setClearMeasurementLayer] = useState(false)
  const [mapScaleUnit, setMapScaleUnit] = useState(scaleUnits.MILES);

  const handleSelectedRegion = (regionId) => {
    if (!dataTree || !regionId) return;

    setSelectedRegionId(regionId);
    const region = dataTree[regionId];
    setZoomLevel(region.location);
  }

  const handleSelectedPlume = (plumeId) => {
    if (!plumes || !plumeId) return;

    const plume = plumes[plumeId];
    const { location } = plume;
    setSelectedPlumeId(plume);
    setPlumesForAnimation(plume.subDailyPlumes);
    setOpenDrawer(true);
    setZoomLevel(location);
    setSelectedRegionId(null); //to reset the plume that was shown
  }

  useEffect(() => {
    if (!dataTree) return;

    const plumes = {}; // plumes[string] = Plume
    const regions = []; // string[]
    const plumeIds = []; // string[] // for search
    Object.keys(dataTree).forEach(region => {
      regions.push(dataTree[region]);
      dataTree[region].plumes.forEach(plume => {
        // check what plume is in dataModels.ts
        plumes[plume.id] = plume;
        plumeIds.push(plume.id);
      });
    });
    setPlumes(plumes);
    setRegions(regions);
    // setFilteredDailyRepPlumes(dailyRepPlumes);
    setPlumeIds(plumeIds); // for search
  }, [dataTree]);

  // useEffect(() => {
  //   // helps the search feature to be on top of filter feature
  //   const dailyFilteredRepPlumeIds = filteredDailyRepPlumes.map(plume => plume.plumeId);
  //   setPlumeIds(dailyFilteredRepPlumeIds);
  // }, [filteredDailyRepPlumes]);

  return (
    <Box className="fullSize">
      <div id="dashboard-map-container">
        <Title>
          <HorizontalLayout>
            <Search
              ids={plumeIds}
              setSelectedPlumeId={handleSelectedPlume}
            ></Search>
          </HorizontalLayout>
          {/* <HorizontalLayout>
            <FilterByDate
              plumes={dailyRepPlumes}
              setFilteredPlumes={setFilteredDailyRepPlumes}
            />
          </HorizontalLayout> */}
        </Title>
        <MainMap>
          <MarkerFeature
            regions={regions}
            setSelectedRegionId={handleSelectedRegion}
          ></MarkerFeature>
          <PlumeAnimation plumes={plumesForAnimation} />

          <MapLayers region={selectedRegionId} dataTree={dataTree} handleLayerClick={handleSelectedPlume}></MapLayers>
          {/* 
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
          /> */}
          <MapZoom zoomLevel={zoomLevel} /> 
        </MainMap>
        {/* <PersistentDrawerRight
          open={openDrawer}
          setOpen={setOpenDrawer}
          selectedPlumeId={selectedPlumeId}
          collectionId={collectionId}
        /> */}
      </div>
    </Box>
  );
}
