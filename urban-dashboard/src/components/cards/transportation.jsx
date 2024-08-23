import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { RootCard } from "./root";
import { OutlinedCard } from "./outlinedCard";

import { meta } from "../../assets/data/metadata";
const { transportationData } = meta;
const { year, car, foot, bus, bicycle } = transportationData;

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function TransportationCard () {
    const data = {
        labels: ['Car', 'Bus', 'Bicycle', 'Foot'],
        datasets: [
          {
            label: 'Car',
            data: [car],
            backgroundColor: 'lightskyblue',
          },
          {
            label: 'Bus',
            data: [0, bus],
            backgroundColor: 'lightcoral',
          },
          {
            label: 'Bicycle',
            data: [0, 0, bicycle],
            backgroundColor: 'lightgreen',
          },
          {
            label: 'Foot',
            data: [0, 0, 0, foot],
            backgroundColor: 'gold',
          },
        ],
      };

      const options = {
        responsive: true,
        plugins: {
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: false,
            beginAtZero: true,
            max: 100,
          },
        },
      };

    const description = "The transportation activity in the world has been increasing at a rapid rate. The car transportation has been increasing at a faster rate than the other modes of transportation. The car transportation is expected to increase to 80% by 2025."

    return (
        <OutlinedCard>
            <RootCard title="Transportation Activity" description={description} subDescription={`Year: ${year}`} className="card">
                <Bar data={data} options={options} />
            </RootCard>
        </OutlinedCard>
    );
}