import React, { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faMapLocation } from '@fortawesome/free-solid-svg-icons';

import { URBAN_REGIONS } from "../../assets/geojson/index";

// const { urbanRegions } = 
// const { total: totalPopulation, urban: urbanPopulation, rural: ruralPopulation } = populationData;



ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function PopulationCard({ selection, urbanRegions }) {
  const [population, setPopulation] = useState("N/A");
  const [area, setArea] = useState("N/A");

  //adds commas in population number 
  const formatNumberWithCommas = (number) => {
    return new Intl.NumberFormat().format(number);
  }

  useEffect(() => {
    const geoJsonData = urbanRegions.find(region => region.name == selection).geojson;
    if (geoJsonData) {
      const feature = geoJsonData.features[0];
      const populationValue = feature.properties.Total_Population
      setPopulation(formatNumberWithCommas(populationValue) || "N/A");

      const areaValue = (feature.properties.ALAND / 1000000) * 0.386102;
      setArea(areaValue.toFixed(2) || "N/A");
    }
  }, [selection]);

  return (
    <div className="population-container">
      <div className="population-item">
        <div className="population-icon">
          <FontAwesomeIcon
            icon={faUsers}
            style={{ color: "white", fontSize: 20 }}
          />
        </div>
        <div className="population-info">
          <p className="population-label">Population</p>
          <p className="population-value">{population}</p>
        </div>
      </div>
      <div className="population-item">
        <div className="population-icon">
          <FontAwesomeIcon
            icon={faMapLocation}
            style={{ color: "white", fontSize: 20 }}
          />
        </div>
        <div className="population-info">
          <p className="population-label">Area</p>
          <p className="population-value">{area} mi²</p>
        </div>
      </div>
    </div>
  );
}
