import * as React from 'react';
import { useState, useEffect } from 'react';

import { Select, MenuItem, Typography, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { AVAILABLE_REGIONS } from '../../../assets/geojson';

function DropdownIconComponent(props) {
  return (
    <>
      <FontAwesomeIcon
        icon={faChevronDown}
        {...props}
        style={{
          color: "#3d4551",
          fontSize: 20,
          cursor: "pointer",
          verticalAlign: "middle"
        }} />
    </>
  )
}


export function UrbanSelector({ urbanRegion, setUrbanRegion }) {
  const [selectedRegion, setSelectedRegion] = useState(urbanRegion);

  const urbanRegions = AVAILABLE_REGIONS;

  //update the selector value based upon the changes in urbanRegion
  useEffect(() => {
    setSelectedRegion(urbanRegion)
  }, [urbanRegion]);

  const handleSelect = (event) => {
    const selectedValue = event.target.value;
    setSelectedRegion(selectedValue);
    setUrbanRegion(selectedValue);
  }

  return (
    <React.Fragment>
      <Select
        id="demo-simple-select-standard"
        value={selectedRegion}
        variant='standard'
        disableUnderline={true}
        onChange={handleSelect}
        IconComponent={(props) => (<DropdownIconComponent {...props} />)}
        renderValue={(selected) => (
          <Typography sx={{
            fontSize: "20px",
            marginRight: 3
          }}>
            {selected}
          </Typography>
        )}
        sx={{
          display: 'flex',
          alignItems: 'center',
          maxHeight: '80vh'
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: "50vh",
              padding: 0,
            }
          }
        }}
      >
        {urbanRegions.map((region) => (
          <MenuItem
            value={region}
            key={region}
          >
            <Box display="flex" alignItems="center">
              <Typography sx={{
                mr: 3,
                color: "#1B1B1B",
                fontSize: "14px",
                cursor: "pointer"
              }}>{region}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </React.Fragment>
  );
}
