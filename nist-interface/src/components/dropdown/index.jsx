import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import "./index.css";

export function SelectGHG({selectedGHG, setSelectedGHG, style}) {
  // collectionId format: <agency>_<data_category>_<region>_<sitecode>_<ghg>_<frequency>_concentrations
  // need to have GHGs that are used and available in the collectionId

  const GHGs = {
    "co2": "Carbon Dioxide",
    "ch4": "Methane"
  }

  const handleChange = (event) => {
    setSelectedGHG(event.target.value);
  };

  return (
    <Box id="GHG-dropdown" sx={{ minWidth: 120, maxWidth: 240 }} style={style}>
      <FormControl fullWidth>
        <Select
          value={selectedGHG}
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          { Object.keys(GHGs).map(ghg => (
              <MenuItem key={ghg} value={ghg}>{GHGs[ghg]}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
    </Box>
  );
}