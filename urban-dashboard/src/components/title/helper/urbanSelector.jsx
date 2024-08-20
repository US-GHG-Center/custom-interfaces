import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { Typography } from '@mui/material';

export function UrbanSelector({ urbanRegion, setUrbanRegion }) {
  const urbanRegions = ["Los Angeles", "New York", "San Francisco", "Indianapolis", "Chicago", "Salt Lake City"]

  const handleSelect = (event) => {
    setUrbanRegion(event.target.value);
  }

  return (
    <React.Fragment>
      <Select
        id="demo-simple-select-standard"
        defaultValue={urbanRegion}
        variant='standard'
        disableUnderline={true}
        onChange={handleSelect}
      >
        {urbanRegions.map((region) => (
          <MenuItem value={region}><Typography variant='h5'>{region}</Typography></MenuItem>
        ))}
      </Select>
    </React.Fragment>
  );
}
