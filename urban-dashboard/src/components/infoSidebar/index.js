import React from 'react';

import { Grap2pesDatasetCard, VulcanDatasetCard } from '../cards/dataset';
import "./index.css";
import { Typography } from '@mui/material';
import { PopulationCard } from '../cards/population';
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

            {!selection && (
                <>
                    {/* Data Snippet Card */}
                    <Typography style={{ fontSize: '12px', color: '#1E1E1E' }}>
                        {briefSnippet}
                    </Typography>
                </>
            )}

            {selection && (
                <>
                    {/* Population and Area Card */}
                    <PopulationCard />
                </>
            )}

            {/* Primary separator line */}
            <div className="info-border-primary" />
            {/* Dataset Card */}
            {dataset == "vulcan" && <VulcanDatasetCard />}
            {dataset == "gra2pes" && <Grap2pesDatasetCard />}

            {selection && (
                <>

                    {/* Secondary separator line */}
                    <div className="info-border-secondary" />
                    {/* Dataset Insights Card */}
                    <DataInsightsCard dataset={dataset} />
                </>
            )}
        </div>
    )
}
