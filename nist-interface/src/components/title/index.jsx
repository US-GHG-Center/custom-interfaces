import React from 'react';
import Typography from '@mui/material/Typography';

import './index.css';

export function Title ({ ghg, agency }) {
    return (
        <div id="title">
            <Typography variant='h5'>
                {agency.toUpperCase()}: {ghg.toUpperCase()} Concentration Measurements
            </Typography>
        </div>
    );
}