import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { RootCard } from "./root";
import { CardContent, Grid } from "@mui/material";
import { OutlinedCard } from "./outlinedCard";

import { meta } from "../../assets/data/metadata";
const { populationData } = meta;
const { total: totalPopulation, urban: urbanPopulation, rural: ruralPopulation } = populationData;

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function PopulationCard() {
  const data = {
    labels: ['Population'],
    datasets: [
      {
        label: 'Urban',
        data: [urbanPopulation],
        backgroundColor: 'lightskyblue',
      },
      {
        label: 'Rural',
        data: [ruralPopulation],
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
        stacked: true,
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const description = "Nth largest city in the U.S. (by population)"

  return (
    <OutlinedCard>
      <RootCard title="" description={description} className="card">
        {/* <Bar data={data} options={options} /> */}
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>Population</Grid>
            <Grid item xs={6}><b>N.N</b> Million</Grid>
            <Grid item xs={6}>Area</Grid>
            <Grid item xs={6}><b>NN</b> square miles</Grid>
          </Grid>
        </CardContent>
      </RootCard>
    </OutlinedCard>
  );
}
