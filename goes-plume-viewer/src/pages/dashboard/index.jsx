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

export function Dashboard({ dataTree, collectionId, metaData, zoomLevel, setZoomLevel }) {
  const [ regions, setRegions ] = useState([]);
  const [ plumes, setPlumes ] = useState([]);
  const [ selectedRegionId, setSelectedRegionId ] = useState(null); //string
  const [ selectedPlumes, setSelectedPlumes ] = useState([]);

  const [ filteredRegions, setFilteredRegions ] = useState([]);
  const [ filteredSelectedPlumes, setFilteredSelectedPlumes ] = useState([]);

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
    setPlumeIds(plumeIds); // for search
  }, [dataTree]);

  useEffect(() => {
    if (!dataTree || !selectedRegionId) return;
    const plumes = dataTree[selectedRegionId].plumes;
    setSelectedPlumes(plumes);
    setPlumesForAnimation([]); // reset the animation
  }, [dataTree, selectedRegionId]);

  return (
    <Box className="fullSize">
      <div id="dashboard-map-container">
        <Title>
          <HorizontalLayout>
            <Search
              ids={plumeIds}
              handleSelectedPlume={handleSelectedPlume}
            ></Search>
          </HorizontalLayout>
          <HorizontalLayout>
            <FilterByDate
              regions={regions}
              plumes={selectedPlumes}
              setFilteredRegions={setFilteredRegions}
              setFilteredSelectedPlumes={setFilteredSelectedPlumes}
            />
          </HorizontalLayout>
        </Title>
        <MainMap>
          <MarkerFeature
            regions={filteredRegions}
            setSelectedRegionId={handleSelectedRegion}
          ></MarkerFeature>
          <PlumeAnimation plumes={plumesForAnimation} />
          <MapLayers plumes={filteredSelectedPlumes} handleLayerClick={handleSelectedPlume}></MapLayers>
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
          <MeasurementLayer
            measureMode={measureMode}
            setMeasureMode={setMeasureMode}
            setClearMeasurementIcon={setClearMeasurementIcon}
            clearMeasurementLayer={clearMeasurementLayer}
            setClearMeasurementLayer={setClearMeasurementLayer}
            mapScaleUnit={mapScaleUnit}
          />
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
