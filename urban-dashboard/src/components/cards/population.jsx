import React, { useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faMapLocation } from '@fortawesome/free-solid-svg-icons';

import { RootCard } from "./root";
import { CardContent, Grid } from "@mui/material";
import { OutlinedCard } from "./outlinedCard";

import { meta } from "../../assets/data/metadata";
const { populationData } = meta;
const { total: totalPopulation, urban: urbanPopulation, rural: ruralPopulation } = populationData;

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function PopulationCard() {
  const [population, setPopulation] = useState("808,437");
  const [area, setArea] = useState("46.87");

  return (
    <div class="population-container">
      <div class="population-item">
        <div class="population-icon">
          <FontAwesomeIcon
            icon={faUsers}
            style={{ color: "white", fontSize: 17 }}
          />
        </div>
        <div class="population-info">
          <p class="population-label">Population</p>
          <p class="population-value">{population}</p>
        </div>
      </div>
      <div class="population-item">
        <div class="population-icon">
          <FontAwesomeIcon
            icon={faMapLocation}
            style={{ color: "white", fontSize: 17 }}
          />
        </div>
        <div class="population-info">
          <p class="population-label">Area</p>
          <p class="population-value">{area} mi<sup>2</sup></p>
        </div>
      </div>
    </div>
  );
}
