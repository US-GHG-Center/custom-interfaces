import React from 'react';
import Typography from '@mui/material/Typography';
import { UrbanSelector } from './helper/urbanSelector.jsx';

import './index.css';

export function Title({ children, selection, setSelection }) {
    if (!children) {
        children = (
            <>
                <Typography variant='h5'>
                    {!selection && <span>Urban Dashboard</span>}
                </Typography>

                <Typography variant='h5'>
                    {selection && <UrbanSelector urbanRegion={selection} setUrbanRegion={setSelection} />}
                </Typography>
            </>
        )
    }
    return (
        <div id="title">
            {children}
        </div>
    );
}
