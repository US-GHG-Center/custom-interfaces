import { styled as styledmui } from '@mui/material/styles';
import styled from "styled-components";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import { PlumeCard } from '../card';
import { useEffect, useState } from 'react';

import "./index.css";

const drawerWidth = "30rem";

const Main = styledmui('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    /**
     * This is necessary to enable the selection of content. In the DOM, the stacking order is determined
     * by the order of appearance. Following this rule, elements appearing later in the markup will overlay
     * those that appear earlier. Since the Drawer comes after the Main content, this adjustment ensures
     * proper interaction with the underlying content.
     */
    position: 'relative',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginRight: 0,
        },
      },
    ],
  }),
);

const DrawerHeader = styledmui('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

const HorizontalLayout = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 5px;
    margin-bottom: 5px;
`;

export function PersistentDrawerRight({open, setOpen, selectedPlumes, plumeMetaData, collectionId, metaDataTree, plumesMap, handleSelectedPlumeCard, setHoveredPlumeId, hoveredPlumeId}) {
  const [ selectedPlumeMetas, setSelectedPlumeMetas ] = useState([]);
  const [ location, setLocation ] = useState("USA");
  const [ numberOfPlumes, setNumberOfPlumes ] = useState(0);

  let VMIN = 0;
  let VMAX = 0.4;
  let colorMap = "plasma";

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if ( !plumeMetaData ) return;
    if ( !selectedPlumes.length ) {
      setSelectedPlumeMetas([]);
      setLocation("USA");
      setNumberOfPlumes(0);
      return;
    }

    try {
      const selectedMetas = selectedPlumes.map(plume => {
        if (!(plume.id in plumeMetaData)) {
          throw new Error(`plumeId: "${plume.id}" not found in metadata.`);
        }
        return plumeMetaData[plume.id]
      });
      setSelectedPlumeMetas(selectedMetas)

      const firstPlumeMeta = plumeMetaData[selectedPlumes[0].id];
      const { administrativeDivision, country } = firstPlumeMeta;
      const location = `${administrativeDivision}, ${country}`;
      const numberOfPlumes = selectedPlumes.length;
      setLocation(location);
      setNumberOfPlumes(numberOfPlumes);
    } catch (err) {
      console.error("Error getting data for the drawer.", err)
    }
  }, [plumeMetaData, selectedPlumes]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Main open={open}>
        <DrawerHeader />
      </Main>
      <Drawer
        sx={{
          width: drawerWidth,
          marginRight: "5px",
          marginTop: "5px",
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            marginRight: "5px",
            marginTop: "5px",
            height: 'calc(100vh - var(--colorbar-height) - 3.5%)', //colobar is up 3% from bottom
            borderRadius: '3px',
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <DrawerHeader className="drawer-head">
          <HorizontalLayout>
            <Typography
                  variant="h6"
                  component="div"
                  fontWeight="bold"
                  className='drawer-head-content'
            >
              { location }
            </Typography>
            <Typography
                  variant="subtitle1"
                  component="div"
                  className='drawer-head-content'
            >
              { numberOfPlumes + " Plumes"}
            </Typography>
          </HorizontalLayout>
        </DrawerHeader>
          { !!selectedPlumeMetas.length &&
            selectedPlumeMetas.map(selectedPlumeMeta => (
              <PlumeCard
                key={selectedPlumeMeta.id}
                plumeSourceId={selectedPlumeMeta.id}
                plumeSourceName={selectedPlumeMeta.id}
                imageUrl={`${process.env.REACT_APP_RASTER_API_URL}/collections/${collectionId}/items/${plumesMap[selectedPlumeMeta.id].representationalPlume.id}/preview.png?assets=rad&rescale=${VMIN}%2C${VMAX}&colormap_name=${colorMap}`}
                tiffUrl={`${process.env.REACT_APP_CLOUD_BROWSE_URL}/browseui/#${collectionId}/#q=${selectedPlumeMeta.id.split("_").slice(-1)}`}
                lon={selectedPlumeMeta.lon}
                lat={selectedPlumeMeta.lat}
                totalReleaseMass={selectedPlumeMeta.totalReleaseMass}
                colEnhancements={selectedPlumeMeta.colEnhancements}
                startDatetime={selectedPlumeMeta.startDatetime}
                endDatetime={selectedPlumeMeta.endDatetime}
                duration={selectedPlumeMeta.duration}
                handleSelectedPlumeCard={handleSelectedPlumeCard}
                hoveredPlumeId={hoveredPlumeId}
                setHoveredPlumeId={setHoveredPlumeId}
              />
            ))
          }
      </Drawer>
    </Box>
  );
}
