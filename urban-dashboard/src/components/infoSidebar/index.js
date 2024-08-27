import React from 'react';
import Card from '@mui/material/Card';
import CardContent from "@mui/material/CardContent";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faMapLocation } from '@fortawesome/free-solid-svg-icons';

import { Grap2pesDatasetCard, VulcanDatasetCard } from '../cards/dataset';
import { RootCard } from '../cards/root';
import "./index.css";
import { GasEmissionsCard } from '../cards/gasEmissions';
import { Typography } from '@mui/material';
import { PopulationCard } from '../cards/population';
import { SeasonalEmissionsCard } from '../cards/seasonalEmissions';
import { DataInsightsCard } from '../cards/dataInsights';
import { Title } from '../title';



export function InfoSidebar({
    selection,
    setSelection,
    handleZoomOut,
    dataset
}) {
    const briefSnippet = "Cities shown on the map have been selected based on their innovative GHG measurements and geographic diversity."

    return (
        <div className="info-sidebar">

            <Title
                selection={selection}
                setSelection={setSelection}
                handleZoomOut={handleZoomOut}
            />

            {selection && (
                <>
                    {/* Population and Area Card */}
                    <PopulationCard />

                    {/* Data Snippet Card */}
                    <Typography style={{ fontSize: '14px', color: '#1E1E1E' }}>
                        {briefSnippet}
                    </Typography>
                    {/* Primary separator line */}
                    <div className="info-border-primary" />
                    {/* Dataset Card */}
                    {dataset == "vulcan" && <VulcanDatasetCard />}
                    {dataset == "gra2pes" && <Grap2pesDatasetCard />}
                    {/* Secondary separator line */}
                    <div className="info-border-secondary" />
                    {/* Dataset Insights Card */}
                    <DataInsightsCard dataset={dataset} />

                </>
            )}

        </div>
    )
}
