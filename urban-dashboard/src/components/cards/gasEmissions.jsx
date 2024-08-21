import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, plugins } from 'chart.js';
import { Pie } from 'react-chartjs-2';

import { CardContent, Grid, Typography } from '@mui/material';

import { RootCard } from './root';
import { OutlinedCard } from "./outlinedCard";

ChartJS.register(ArcElement);

export function GasEmissionsCard() {
    const [data, setData] = useState({
        labels: [],
        datasets: [{
            // label: "Emissions by Gas",
            data: [],
            backgroundColor: [],
        }]
    });

    const options = {
        plugins: {
            legend: {
                display: false, // hide legends
            },
            tooltip: {
                enabled: true, // enable tooltips
            },
        },
    };

    useEffect(() => {
        fetch("./data/gasEmissions.json")
            .then(response => response.json())
            .then(json => setData(json))
            .catch(error => console.error("Error fetching emissions by gas data"))
    }, []);

    const description = "Different industries emit different greenhouse gases based on the types of fuel sources they use and how they burn that fuel."

    return (
        <OutlinedCard>
            <RootCard title="Emissions by Sector" description={description}>
                <CardContent>
                    {/* TODO: what could be the best way to accommodate 5 pie charts? */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Pie data={data} options={options} />
                            <Typography variant='h7'>
                                CO₂
                            </Typography>
                            <Pie data={data} options={options} />
                            <Typography variant='h7'>
                                CO
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </RootCard>
        </OutlinedCard>
    )
}
