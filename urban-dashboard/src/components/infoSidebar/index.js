import React from 'react';
import { Typography } from '@mui/material';

import { DatasetCard, Grap2pesDatasetCard, VulcanDatasetCard } from '../cards/dataset';
import { PopulationCard } from '../cards/population';
import { DataInsightsCard } from '../dataInsights';
import { Title } from '../title';
import GradientChart, { ColorMapChart } from '../cards/colorMapChart';

import "./index.css";


export function InfoSidebar({
    urbanRegions,
    selection,
    setSelection,
    handleZoomOut,
    dataset
}) {

    let briefSnippet = "data is available for the contiguous United States. Locations indicated are for representative purposes only, based on the top 30 U.S. cities by population size, according the 2021 U.S. Census Bureau figures and city “Place” boundaries.";
    if (dataset === "vulcan") {
        briefSnippet = `Vulcan ${briefSnippet}`
    } else if (dataset === "gra2pes") {
        briefSnippet = `GRA2PES ${briefSnippet}`
    }

    return (
        <div>
            <div className="info-sidebar">

                <Title
                    selection={selection}
                    setSelection={setSelection}
                    handleZoomOut={handleZoomOut}
                />

                {/* Data Snippet Card */}

                {!selection && (
                    <>
                        <Typography style={{ fontSize: '12px', color: '#1E1E1E' }}>
                            {briefSnippet}
                        </Typography>
                    </>
                )}

                {/* Population and Area Card */}
                {selection && (
                    <>
                        <PopulationCard selection={selection} urbanRegions={urbanRegions} />
                    </>
                )}

                {/* Primary separator line */}
                <div className="info-border-primary" />

                {/* Dataset Card */}
                <DatasetCard dataset={dataset} />

                {/* Dataset Insights Card */}

                {selection && (
                    <>
                        {/* Secondary separator line */}
                        <div className="info-border-secondary" />
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