import React from 'react';
import { Typography } from '@mui/material';

import { DatasetCard } from '../cards/dataset';
import { PopulationCard } from '../cards/population';
import { DataInsightsCard } from '../dataInsights';
import { Title } from '../title';
import { ColorMapChart } from '../cards/colorMapChart';
import { DATASETS } from '../../constants';

import "./index.css";

const DataSnippet = ({ dataset }) => {
    let briefSnippet = "data is available for the contiguous United States. Locations indicated are for representative purposes only, based on the top 30 U.S. cities by population size, according to the 2021 U.S. Census Bureau figures and city “Place” boundaries.";
    if (dataset === DATASETS.VULCAN) {
        briefSnippet = `Vulcan ${briefSnippet}`
    } else if (dataset === DATASETS.GRA2PES) {
        briefSnippet = `GRA²PES ${briefSnippet}`
    }

    return (
        <>
            <Typography style={{ fontSize: '12px', color: '#1E1E1E', fontFamily: "Inter", marginTop: "5px" }}>
                {briefSnippet}
            </Typography>
        </>
    )
}

// TitlePopulationAndArea is a wrapper for Title, Data Snippet and Population Cards
const TitlePopulationAndArea = ({
    urbanRegions,
    selection,
    setSelection,
    handleZoomOut,
    dataset
}) => {
    return (
        <div>
            <Title
                selection={selection}
                setSelection={setSelection}
                handleZoomOut={handleZoomOut}
            />

            {!selection ? <DataSnippet dataset={dataset} />
                : <PopulationCard selection={selection} urbanRegions={urbanRegions} />}

        </div>
    )
}

// DataInsights plots charts on the info sidebar
const DataInsights = ({ dataset, selection }) => {
    return (
        <>
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
        </>
    )
}


export function InfoSidebar({
    urbanRegions,
    selection,
    setSelection,
    handleZoomOut,
    dataset
}) {

    return (
        <div>
            <div className={"info-sidebar " + (selection ? 'info-sidebar-full-height' : '')}>
                {/* Title, Data Snippet, Population & Area */}
                <TitlePopulationAndArea
                    urbanRegions={urbanRegions}
                    selection={selection}
                    setSelection={setSelection}
                    handleZoomOut={handleZoomOut}
                    dataset={dataset} />

                {/* Primary separator line */}
                <div className="info-border-primary" />

                {/* Dataset Card */}
                <DatasetCard dataset={dataset} />

                {/* Dataset Insights Card */}
                <DataInsights dataset={dataset} selection={selection} />

            </div>

            <ColorMapChart dataset={dataset} />
        </div>
    )
}
