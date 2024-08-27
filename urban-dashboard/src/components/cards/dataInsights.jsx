import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend } from 'chart.js';

import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend);

function EmissionsBySectorCard() {
    const [data, setData] = useState({
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [

            ],
            borderColor: [

            ],
        }]
    });

    useEffect(() => {
        fetch("./data/sectoralEmissions.json")
            .then(response => response.json())
            .then(json => setData(json))
            .catch(error => console.error("Error fetching sectoral emissions data"))
    })

    const chartOptions = {
        // plugins: {
        //     legend: {
        //         display: true,
        //         position: 'top',
        //     },
        //     tooltip: {
        //         callbacks: {
        //             label: function (tooltipItem) {
        //                 return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
        //             },
        //         },
        //     },
        // },
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    }

    return (
        <div>
            <Line data={data} options={chartOptions} />
        </div>
    )
}

function VulcanInsightsCard() {
    const title = "CO₂ Emissions by Sector";
    const description = "Different industries emit different amount of CO₂ based on the types of fuel sources they use and how they burn that fuel. Industries also change in different ways over time!"

    return (
        <div class="dataset-card">
            <h2>{title}</h2>
            <p>
                {description}
            </p>

            <EmissionsBySectorCard />
        </div>
    )
}

export function DataInsightsCard({ dataset }) {
    return (
        <>
            {dataset == "vulcan" && <VulcanInsightsCard />}
        </>
    )
}



