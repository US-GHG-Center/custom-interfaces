import React from 'react';

import { DATASETS } from '../../constants';
import "./index.css";
import { VulcanStackedAreaChart } from './vulcan';
import { Gra2pesGasEmissionsBySectorCard } from './gra2pes';

const Dataset = ({ title, description }) => {
    return (
        <>
            <div className="dataset-card">
                <h2>{title}</h2>
                <p>
                    {description}
                </p>
            </div>
        </>
    )
}


const VulcanInsightsCard = ({ selection }) => {
    const title = "Urban CO₂ Emissions by Sector";
    const description = "Different sectors emit different amounts of CO₂ based on fossil fuel type and use. Long-term data offers a view of how sectors change over time."

    return (
        <>
            <Dataset title={title} description={description} />
            <div className="stacked-chart-container">
                <VulcanStackedAreaChart selection={selection} />
            </div>

        </>
    )
}

const Gra2pesInsightsCard = ({ selection }) => {
    const title = "Emissions by Sector";
    const description = "Emissions for different sectors vary due to different types of fossil fuel use."

    return (
        <>
            <Dataset title={title} description={description} />
            <div>
                <Gra2pesGasEmissionsBySectorCard selection={selection} />
            </div>

        </>
    )
}

export function DataInsightsCard({ dataset, selection }) {
    return (
        <>
            {dataset === DATASETS.VULCAN && <VulcanInsightsCard selection={selection} />}
            {dataset === DATASETS.GRA2PES && <Gra2pesInsightsCard selection={selection} />}
        </>
    )
}
