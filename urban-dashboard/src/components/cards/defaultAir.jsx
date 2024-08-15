import React from "react";
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { RootCard } from "./root";
import { OutlinedCard } from "./outlinedCard";

import { meta } from "../../assets/data/metadata";
const { airQualityData } = meta;
const { aqi, ch4, co2 } = airQualityData;

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function AirQualityCard () {
    const data = {
        labels: ['co2', 'ch4'],
        datasets: [
          {
            label: 'co2 (ppm)',
            data: [co2],
            backgroundColor: 'lightskyblue',
          },
          {
            label: 'ch4 (ppm)',
            data: [0, ch4],
            backgroundColor: 'lightcoral',
          },
        ],
      };

      const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: false,
            beginAtZero: true,
            max: 500,
          },
        },
      };

    const description = "Air quality is a measure of how clean or polluted the air is. Monitoring air quality is important for health and the environment."

    return (
        <OutlinedCard>
            <RootCard title="Air Quality" description={description} subDescription="Air quality index and GHG" className="card">
                <CardContent>
                    <Typography variant="h4">
                        {`AQI ${aqi}`}
                    </Typography> (Moderate)
                    <Bar data={data} options={options} style={{ marginTop: "20px" }} />
                </CardContent>
            </RootCard>
        </OutlinedCard>
    );
}