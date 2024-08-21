import React from 'react';
import Typography from '@mui/material/Typography';
import { UrbanSelector } from './helper/urbanSelector.jsx';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';

import './index.css';
import { Icon, Zoom } from '@mui/material';

export function Title({ children, selection, setSelection, handleZoomOut }) {

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
        <div>
            <div id="title-left">
                {children}
            </div>
            <div id="title-right">
                <ZoomOutMapIcon onClick={handleZoomOut} sx={{ color: 'white', fontSize: 40 }} />
            </div>
        </div>

    );
}
