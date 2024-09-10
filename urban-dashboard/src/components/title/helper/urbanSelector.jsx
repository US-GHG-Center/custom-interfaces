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
          color: "#082A64",
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
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {urbanRegions.map((region) => (
          <MenuItem
            value={region}
            key={region}
          >
            <Box display="flex" alignItems="center">
              <Typography sx={{
                // width: "170px",
                mr: 3,
                paddingTop: 0.4,
                color: "#082A64",
                fontSize: "20px",
                lineHeight: "24.2px",
                cursor: "pointer"
              }}>{region}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </React.Fragment>
  );
}
