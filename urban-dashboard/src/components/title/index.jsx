import React from 'react';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { UrbanSelector } from './helper/urbanSelector.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import './index.css';

const TitleHeader = () => {
    return (
        <div className="title-card-title">
            <Typography variant='h5' sx={{ fontFamily: "Inter" }}>
                <span>Urban Dashboard</span>
            </Typography>
        </div>
    )
}

const DropDownSelector = ({
    selection,
    setSelection,
    handleZoomOut
}) => {
    return (
        <>
            <div className="title-card-left">
                <UrbanSelector urbanRegion={selection} setUrbanRegion={setSelection} />
            </div>

            <div className="title-card-right">
                <Tooltip title="Reset">
                    <FontAwesomeIcon
                        onClick={handleZoomOut}
                        icon={faArrowLeft}
                        style={{ color: "#082A64", fontSize: 20, cursor: "pointer" }}
                    />
                </Tooltip>
            </div>

        </>
    )
}

export function Title({ children, selection, setSelection, handleZoomOut }) {
    return (
        <div className="title-card">
            {!selection ? <TitleHeader />
                : <DropDownSelector
                    selection={selection}
                    setSelection={setSelection}
                    handleZoomOut={handleZoomOut}
                />
            }
        </div>

    );
}
