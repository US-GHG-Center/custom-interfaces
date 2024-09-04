import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import "./index.css";

export function SelectGHG({selectedGHG, setSelectedGHG, style}) {
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
          <MenuItem value={"co2"}>Carbon Dioxide</MenuItem>
          <MenuItem value={"ch4"}>Methane</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}