import React from 'react';
import { Typography } from '@mui/material';

import { DatasetCard } from '../cards/dataset';
import { PopulationCard } from '../cards/population';
import { DataInsightsCard } from '../dataInsights';
import { Title } from '../title';
import { ColorMapChart } from '../cards/colorMapChart';

import "./index.css";


export function InfoSidebar({
    urbanRegions,
    selection,
    setSelection,
    handleZoomOut,
    dataset
}) {

    let briefSnippet = "data is available for the contiguous United States. Locations indicated are for representative purposes only, based on the top 30 U.S. cities by population size, according to the 2021 U.S. Census Bureau figures and city “Place” boundaries.";
    if (dataset === "vulcan") {
        briefSnippet = `Vulcan ${briefSnippet}`
    } else if (dataset === "gra2pes") {
        briefSnippet = `GRA²PES ${briefSnippet}`
    }

    return (
        <>
            <div className={"info-sidebar " + (selection ? 'info-sidebar-full-height' : '')}>
                <div>
                    <Title
                        selection={selection}
                        setSelection={setSelection}
                        handleZoomOut={handleZoomOut}
                    />

                    {/* Data Snippet Card */}

                    {!selection && (
                        <>
                            <Typography style={{ fontSize: '14px', color: '#1E1E1E', marginTop: "5px" }}>
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
                </div>

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


        </>
    )
}
