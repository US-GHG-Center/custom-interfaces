import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

export function OutlinedCard({children}) {
    return (
      <Box sx={{ minWidth: 275 }}>
        <Card variant="outlined">{children}</Card>
      </Box>
    );
  }

OutlinedCard.prototype = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.element),
        PropTypes.element.isRequired
    ])
}