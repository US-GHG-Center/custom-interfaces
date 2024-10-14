import React, { useState, useEffect, useMemo } from 'react';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, Filler, ArcElement } from 'chart.js';

import { Line } from 'react-chartjs-2';
import { Typography, Grid, Box } from '@mui/material';

import { fetchVulcanSectoralData } from '../../services/api/vulcan';
import "./index.css";

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, Filler, ArcElement);

//For VULCAN sectoral stack plot
export const VulcanStackedAreaChart = ({ selection }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [

            ],
            borderColor: [

            ],
        }]
    });

    const colorMap = useMemo(() => ({
        "Aviation": { borderColor: 'rgb(61, 193, 211)', backgroundColor: 'rgb(99, 205, 218)' },
        "Industry": { borderColor: 'rgb(245, 205, 121)', backgroundColor: 'rgb(247, 215, 148)' },
        "Commercial": { borderColor: 'rgb(84, 109, 229)', backgroundColor: 'rgb(119, 139, 235)' },
        "Power": { borderColor: 'rgb(225, 95, 65)', backgroundColor: 'rgb(231, 127, 103)' },
        "Onroad": { borderColor: 'rgb(196, 69, 105)', backgroundColor: 'rgb(207, 106, 135)' },
        "Residential": { borderColor: 'rgb(87, 75, 144)', backgroundColor: 'rgb(120, 111, 166)' },
        "Railroad": { borderColor: 'rgb(48, 57, 82)', backgroundColor: 'rgb(89, 98, 117)' },
    }), []);

    const Legend = () => {
        return (
            <Grid container spacing={0.3}>
                {Object.entries(colorMap).map(([label, colors], index) => (
                    <Grid item xs={4} key={index} container direction="row" alignItems="center">
                        <Box
                            sx={{
                                width: 21,
                                height: 21,
                                backgroundColor: colors.backgroundColor,
                                marginRight: 0.5,
                            }}
                        />
                        <Typography sx={{
                            fontSize: "12px",
                            color: "#1B2631",
                            whiteSpace: "normal",
                            overflowWrap: "break-word",
                            maxWidth: "88px",
                            fontFamily: "Inter"
                        }}>{label}</Typography>
                    </Grid>
                ))}
            </Grid>
        )
    }

    useEffect(() => {
        fetchVulcanSectoralData(selection)
            .then(jsonData => {
                const years = jsonData.map(item => item.YEAR);

                // Define the datasets for each category
                const datasets = [
                    {
                        label: 'Aviation',
                        data: jsonData.map(item => item['Aviation'] / 1000),
                        borderColor: colorMap["Aviation"].borderColor,
                        backgroundColor: colorMap["Aviation"].backgroundColor,
                        fill: true,
                    },
                    {
                        label: 'Industry',
                        data: jsonData.map(item => item['Industry'] / 1000),
                        borderColor: colorMap["Industry"].borderColor,
                        backgroundColor: colorMap["Industry"].backgroundColor,
                        fill: true,
                    },
                    {
                        label: 'Commercial',
                        data: jsonData.map(item => item['Commercial'] / 1000),
                        borderColor: colorMap["Commercial"].borderColor,
                        backgroundColor: colorMap["Commercial"].backgroundColor,
                        fill: true,
                    },
                    {
                        label: 'Power',
                        data: jsonData.map(item => item['Power'] / 1000),
                        borderColor: colorMap["Power"].borderColor,
                        backgroundColor: colorMap["Power"].backgroundColor,
                        fill: true,
                    },
                    {
                        label: 'Onroad',
                        data: jsonData.map(item => item['Onroad'] / 1000),
                        borderColor: colorMap["Onroad"].borderColor,
                        backgroundColor: colorMap["Onroad"].backgroundColor,
                        fill: true,
                    },
                    {
                        label: 'Residential',
                        data: jsonData.map(item => item['Residential'] / 1000),
                        borderColor: colorMap["Residential"].borderColor,
                        backgroundColor: colorMap["Residential"].backgroundColor,
                        fill: true,
                    },
                    {
                        label: 'Railroad',
                        data: jsonData.map(item => item['Railroad'] / 1000),
                        borderColor: colorMap["Railroad"].borderColor,
                        backgroundColor: colorMap["Railroad"].backgroundColor,
                        fill: true,
                    },
                ];

                setChartData({
                    labels: years,
                    datasets: datasets,
                });
            })
            .catch(error => console.error("error reading emissions data", error));
    }, [selection, colorMap]);

    const options = {
        plugins: {
            legend: {
                display: false,
                position: 'bottom',
            },
        },
        scales: {
            y: {
                stacked: true,
                ticks: {
                    stepSize: 5000,
                },
                title: {
                    display: true,
                    text: "metric kilotons of CO₂",
                }

            },
            x: {
                stacked: true,
                title: {
                    display: true,
                    text: "Year"
                }
            },
        },
    };

    return (
        <>
            <div style={{ marginBottom: 30 }}>
                <Legend />
            </div>
            <div style={{ height: '220', width: '100%' }}>
                <Line data={chartData} options={options} height={220} />
            </div>
        </>

    );
};
