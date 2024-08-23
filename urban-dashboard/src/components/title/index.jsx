import React from 'react';
import Typography from '@mui/material/Typography';
import { UrbanSelector } from './helper/urbanSelector.jsx';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate } from '@fortawesome/free-solid-svg-icons';
// import FontAwesomeIcon from 'font-awesome/css/font-awesome.min.css';

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
                <FontAwesomeIcon
                    onClick={handleZoomOut}
                    icon={faRotate}
                    style={{ color: "white", fontSize: 20 }}
                />
                {/* <ZoomOutMapIcon onClick={handleZoomOut} */}
                {/* sx={{ color: 'white', fontSize: 40 }} /> */}
            </div>
        </div>

    );
}
