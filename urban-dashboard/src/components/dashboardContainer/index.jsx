
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import { generateUrbanRegions } from './helper';
import { Dashboard } from "../dashboard";
import { useConfig } from '../../context/configContext';

export function DashboardContainer({ defaultZoomLevel, defaultZoomLocation }) {
    const { config } = useConfig()
    const [searchParams] = useSearchParams();
    const [dataset] = useState(searchParams.get("dataset") || "gra2pes"); //vulcan, gra2pes (default)
    const [urbanRegions, setUrbanRegions] = useState([]);
    const [zoomLevel, setZoomLevel] = useState(
        searchParams.get('zoom-level') || defaultZoomLevel
    );
    const [zoomLocation, setZoomLocation] = useState(
        searchParams.get('zoom-location') || defaultZoomLocation
    );
    useEffect(() => {
        const fetchUrbanRegions = async () => {
            const regions = await generateUrbanRegions(config);
            setUrbanRegions(regions);
        }

        fetchUrbanRegions();
    }, []);

    return (
        <>
            {urbanRegions.length === 0 ? (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    width: '100vw'
                }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Dashboard
                    zoomLevel={zoomLevel}
                    zoomLocation={zoomLocation}
                    dataset={dataset}
                    urbanRegions={urbanRegions}
                />
            )}
        </>

    )
}
