
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import { generateUrbanRegions } from './helper';
import { Dashboard } from "../dashboard";

export function DashboardContainer() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [dataset] = useState(searchParams.get("dataset") || "gra2pes"); //vulcan, gra2pes (default)
    const [aoi] = useState(searchParams.get("aoi")); // CONUS, state names, etc.
    const [urbanRegion] = useState(searchParams.get("region")); // Selected urban region
    const [urbanRegions, setUrbanRegions] = useState([]);

    useEffect(() => {
        const fetchUrbanRegions = async () => {
            const regions = await generateUrbanRegions();
            setUrbanRegions(regions);
        }

        fetchUrbanRegions();
    }, []);

    const updateURLParams = (newParams) => {
        const currentParams = new URLSearchParams(searchParams);
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') {
                currentParams.delete(key);
            } else {
                currentParams.set(key, value);
            }
        });
        setSearchParams(currentParams);
    };

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
                    dataset={dataset}
                    aoi={aoi}
                    urbanRegion={urbanRegion}
                    urbanRegions={urbanRegions}
                    updateURLParams={updateURLParams}
                />
            )}
        </>

    )
}
