import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

import { CardContent } from "@mui/material";
import { OutlinedCard } from "./outlinedCard";
import { RootCard } from "./root";

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend);

export function SeasonalEmissionsCard() {
    const description = "CO₂ emissions from power generation can be higher in the winter when homes and businesses are being heated, or in the summer when we run the air conditioning."

    //break these into multiple states 
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

    return (
        <OutlinedCard>
            <RootCard title="CO₂ Emissions by Sector" description={description}>
                <CardContent>
                    <Line data={data} />
                </CardContent>
            </RootCard>
        </OutlinedCard>
    )
}
