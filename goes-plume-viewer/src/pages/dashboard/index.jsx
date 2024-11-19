import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import styled from "styled-components";

import MainMap from '../../components/mainMap';
import { MarkerFeature } from '../../components/mapMarker';
import { MapLayers } from '../../components/mapLayer';
import { PlumeAnimation } from '../../components/plumeAnimation';
import { MapControls } from "../../components/mapControls";
import { MapZoom } from '../../components/mapZoom';
import { ColorBar } from '../../components/colorBar';
import { LoadingSpinner } from '../../components/loading';
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

export function Dashboard({ dataTree, collectionId, metaDataTree, plumeMetaData, zoomLevel, setZoomLevel, loadingData }) {
  // states for data
  const [ regions, setRegions ] = useState([]); // store all available regions
  const [ plumes, setPlumes ] = useState([]); // store all available plumes
  const [ selectedRegionId, setSelectedRegionId ] = useState(""); // region_id of the selected region (marker)
  const [ selectedPlumes, setSelectedPlumes ] = useState([]); // all plumes for the selected region (marker)
  const [ hoveredPlumeId, setHoveredPlumeId ] = useState(""); // plume_id of the plume which was hovered over

  const [ filteredRegions, setFilteredRegions ] = useState([]); // all regions with the filter applied
  const [ filteredSelectedPlumes, setFilteredSelectedPlumes ] = useState([]); // plumes for the selected region with the filter applied

  const [ plumeIds, setPlumeIds ] = useState([]); // list of plume_ids for the search feature.
  const [ plumesForAnimation, setPlumesForAnimation ] = useState([]); // list of subdaily_plumes used for animation

  // states for components/controls
  const [ openDrawer, setOpenDrawer ] = useState(false);
  const [ measureMode, setMeasureMode ] = useState(false);
  const [ clearMeasurementIcon, setClearMeasurementIcon ] = useState(false)
  const [ clearMeasurementLayer, setClearMeasurementLayer ] = useState(false)
  const [ mapScaleUnit, setMapScaleUnit ] = useState(scaleUnits.MILES);

  // handler functions
  const handleSelectedRegion = (regionId) => {
    if (!dataTree || !regionId) return;

    setSelectedRegionId(regionId);
    const region = dataTree[regionId];
    setZoomLevel(region.location);
    setOpenDrawer(true);
    setSelectedPlumes([]); // reset the plumes shown, to trigger re-evaluation of selected plume
  }

  const handleSelectedPlume = (plumeId) => {
    if (!plumes || !plumeId) return;

    const plume = plumes[plumeId];
    const { location } = plume;
    setPlumesForAnimation(plume.subDailyPlumes);
    setZoomLevel(location);
    setSelectedRegionId(""); //to reset the plume that was shown
    setFilteredSelectedPlumes([]) // to reset the all the plumes that were shown on region click
  }

  const handleSelectedPlumeSearch = (plumeId) => {
    // will react to update the metadata on the sidedrawer
    if (!plumes || !plumeId) return;
    const plume = plumes[plumeId];
    const { location } = plume;

    setSelectedPlumes([plume]);
    setOpenDrawer(true);
    setZoomLevel(location);
    setSelectedRegionId(""); //to reset the plume that was shown
    setFilteredSelectedPlumes([]); // to reset the all the plumes that were shown on region click
    setPlumesForAnimation([]); // to reset the previous animation
  }

  const handleResetHome = () => {
    setSelectedRegionId("");
    setHoveredPlumeId("");
    setFilteredSelectedPlumes([]);
    setFilteredRegions([]);
    setPlumesForAnimation([]);
    setOpenDrawer(false);
    // reset the zoom level. For now done internally.
    // TODO: Update it to be able to take in zoomlevel not just location
    // setZoomLevel([-98.771556, 32.967243]);
  }

  const handleResetToSelectedRegion = () => {
    setHoveredPlumeId("");
    setPlumesForAnimation([]);
    // reset the zoom level. For now done internally.
    // TODO: Update it to be able to take in zoomlevel not just location
    // setZoomLevel([-98.771556, 32.967243]);
  }

  // Component Effects
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

  // JSX
  return (
    <Box className="fullSize">
      <div id="dashboard-map-container">
        <Title>
          <HorizontalLayout>
            <Search
              ids={plumeIds}
              handleSelectedPlumeSearch={handleSelectedPlumeSearch}
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
          <MapLayers
            plumes={filteredSelectedPlumes}
            handleLayerClick={handleSelectedPlume}
            hoveredPlumeId={hoveredPlumeId}
            setHoveredPlumeId={setHoveredPlumeId}
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
            handleResetHome={handleResetHome}
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
        <PersistentDrawerRight
          open={openDrawer}
          setOpen={setOpenDrawer}
          selectedPlumes={filteredSelectedPlumes}
          plumeMetaData={plumeMetaData}
          metaDataTree={metaDataTree}
          collectionId={collectionId}
          plumesMap={plumes}
          handleSelectedPlumeCard={handleSelectedPlume}
          hoveredPlumeId={hoveredPlumeId}
          setHoveredPlumeId={setHoveredPlumeId}
        />
      </div>
      <ColorBar/>
      {loadingData && <LoadingSpinner/>}
    </Box>
  );
}
