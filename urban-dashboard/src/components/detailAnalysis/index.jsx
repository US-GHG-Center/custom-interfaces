import React from 'react';
import Container from '@mui/material/Container';
import { Typography } from '@mui/material';

import "./index.css";

export function DetailAnalysis() {
    const towerDataViewerUrl = "https://ghgc-custom-interfaces-develop.s3.us-west-2.amazonaws.com/ghgcenter/custom-interfaces/noaa-gggrn-ghg-concentrations-temp/index.html?ghg=co2&frequency=all&station_code=WGC";
    const airborneViewerUrl = "http://ghgc-custom-interfaces-develop-airborne-visualization.s3-website-us-west-2.amazonaws.com";

    return (
        <Container maxWidth="xl" className='detail-analysis-container'>
            <Typography variant="h4" component="h1" className="detail-analysis-head">
                Detail Analysis
            </Typography>
            <Typography variant='body' className="detail-analysis-body">
                The above is a brief overview of the urban area. The following analysis provides a more detailed look at the urban area. The analysis is broken down into the following sections:
                <div>
                    <a href={towerDataViewerUrl}>
                        <Typography variant="h6" display="block" gutterBottom className='detail-analysis-title'>
                            1. NOAA: Tower data Viewer
                        </Typography>
                    </a>
                    <iframe src={towerDataViewerUrl} width="100%" height="800px"></iframe>
                    <Typography variant="body1" display="block"s>
                            The tower data demonstrates the concentration of CO2 in the atmosphere. The data is collected from the tower located in the urban area. The data is collected at different heights and is used to monitor the concentration of CO2 in the atmosphere.
                    </Typography>
                </div>

                <div>
                    <a href={airborneViewerUrl}>
                        <Typography variant="h6" display="block" gutterBottom className='detail-analysis-title'>
                            2. NOAA: Airborne Viewer
                        </Typography>
                    </a>
                    <iframe src={airborneViewerUrl} width="100%" height="800px"></iframe>
                    <Typography variant="body1" display="block">
                        The airborne data demonstrates the concentration of CO2 in the atmosphere. The data is collected from the aircraft flying over the urban area. The data is collected at different heights and is used to monitor the concentration of CO2 in the atmosphere.
                    </Typography>
                </div>
            </Typography>
        </Container>
    );
}