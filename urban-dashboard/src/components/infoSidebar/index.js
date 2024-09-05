import React from 'react';

import { DatasetCard, Grap2pesDatasetCard, VulcanDatasetCard } from '../cards/dataset';
import "./index.css";
import { Typography } from '@mui/material';
import { PopulationCard } from '../cards/population';
import { DataInsightsCard } from '../dataInsights';
import { Title } from '../title';
import GradientChart, { ColorMapChart } from '../cards/colorMapChart';

export function InfoSidebar({
    selection,
    setSelection,
    handleZoomOut,
    dataset
}) {
    const briefSnippet = "Cities shown on the map have been selected based on their innovative GHG measurements and geographic diversity."

    return (
        <div className="info-sidebar-container">
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
                        <PopulationCard selection={selection} />
                    </>
                )}

                {/* Primary separator line */}
                <div className="info-border-primary" />
                {/* Dataset Card */}
                <DatasetCard dataset={dataset} />

                {selection && (
                    <>
                        {/* Secondary separator line */}
                        <div className="info-border-secondary" />
                        {/* Dataset Insights Card */}
                        <DataInsightsCard
                            dataset={dataset}
                            selection={selection}
                        />
                    </>
                )}


            </div>

            <ColorMapChart dataset={dataset} />
        </div>
    )
}
