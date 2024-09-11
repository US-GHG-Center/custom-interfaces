
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import { generateUrbanRegions } from './helper';
import { Dashboard } from "../dashboard";

export function DashboardContainer() {
    const [searchParams] = useSearchParams();
    const [dataset] = useState(searchParams.get("dataset") || "gra2pes"); //vulcan, gra2pes (default)
    const [urbanRegions, setUrbanRegions] = useState([]);

    useEffect(() => {
        const fetchUrbanRegions = async () => {
            const regions = await generateUrbanRegions();
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
                    dataset={dataset}
                    urbanRegions={urbanRegions}
                />
            )}
        </>

    )
}
