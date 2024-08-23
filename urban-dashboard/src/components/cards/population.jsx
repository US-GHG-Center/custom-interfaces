import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { RootCard } from "./root";
import { OutlinedCard } from "./outlinedCard";

import { meta } from "../../assets/data/metadata";
const { populationData } = meta;
const { total: totalPopulation, urban: urbanPopulation, rural: ruralPopulation } = populationData;

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function PopulationCard () {
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

    const description = "The population of the world has been increasing at a rapid rate. The urban population has been increasing at a faster rate than the rural population. The urban population is expected to increase to 56% by 2025."

    return (
        <OutlinedCard>
            <RootCard title="Population" description={description} subDescription={`Total population is: ${totalPopulation}`} className="card">
                <Bar data={data} options={options} />
            </RootCard>
        </OutlinedCard>
    );
}