

import React, { useState, useEffect, useMemo } from 'react';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, Filler, ArcElement } from 'chart.js';

import { Pie } from 'react-chartjs-2';
import { Typography, Grid, Box } from '@mui/material';

import { fetchGra2pesSectoralData } from '../../services/api/gra2pes';
import "./index.css";

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, Filler, ArcElement);

// GRA2PES Emissions by Sector 
export const Gra2pesGasEmissionsBySectorCard = ({ selection }) => {
    const [data, setData] = useState({
        labels: [],
        datasets: [{
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
                titleFont: {
                    size: 9,
                },
                bodyFont: {
                    size: 9,
                },
                // display percentage in the tooltip
                callbacks: {
                    label: function (tooltipItem) {
                        const dataset = tooltipItem.dataset;
                        const currentValue = dataset.data[tooltipItem.dataIndex];
                        const total = dataset.data.reduce((acc, value) => acc + value, 0);
                        const percentage = ((currentValue / total) * 100).toFixed(2);
                        return `${percentage}%`;
                    }
                }
            },
        },
    };

    const sectors = useMemo(() => ([
        "Industrial",
        "Onroad Transportation",
        "Power",
        "Nonroad Transportation",
        "Other",
        "Residential + Commercial",
    ]), []);

    const LegendItems = [
        { color: 'rgb(99, 205, 218)', label: 'Industrial' },
        { color: 'rgb(247, 215, 148)', label: 'Onroad Transportation' },
        { color: 'rgb(119, 139, 235)', label: 'Power' },
        { color: 'rgb(231, 127, 103)', label: 'Nonroad Transportation' },
        { color: 'rgb(207, 106, 135)', label: 'Other' },
        { color: 'rgb(120, 111, 166)', label: 'Residential + Commercial' },
    ]

    useEffect(() => {
        fetchGra2pesSectoralData(selection)
            .then(json => {
                // const gases = json.map(entry => entry.Species);
                const sectorsData = json.map(entry => {
                    return {
                        label: entry.Species,
                        data: sectors.map(sector => parseFloat(entry[sector])),
                        backgroundColor: [
                            'rgb(99, 205, 218)',  // Color for "Industrial"
                            'rgb(247, 215, 148)',  // Color for "Onroad Transportation"
                            'rgb(119, 139, 235)',  // Color for "Power"
                            'rgb(231, 127, 103)',  // Color for "Nonroad Transportation"
                            'rgb(207, 106, 135)',  // Color for "Other"
                            'rgb(120, 111, 166)'   // Color for "Residential + Commercial"
                        ],
                    }
                });

                setData({
                    labels: sectors,
                    datasets: sectorsData
                });
            })
            .catch(error => console.error("error fetching emissions by sector for gra2pes", error));
    }, [selection, sectors]);


    const Legend = () => {
        return (
            <Grid container spacing={0.3}>
                {LegendItems.map((item, index) => (
                    <Grid item xs={4} key={index} container direction="row" alignItems="center">
                        <Box
                            sx={{
                                width: 21,
                                height: 21,
                                backgroundColor: item.color,
                                marginRight: 1,
                            }}
                        />
                        <Typography sx={{
                            fontSize: "11px",
                            color: "#1B2631",
                            whiteSpace: "normal",
                            overflowWrap: "break-word",
                            maxWidth: "88px",
                            fontFamily: "Inter"
                        }}>{item.label}</Typography>
                    </Grid>
                ))}
            </Grid>
        )
    }

    return (
        <>
            <div style={{ marginBottom: 30 }}>
                <Legend />
            </div>
            <div>
                <Grid container alignItems="center" spacing={1.5}>
                    {data.datasets.map((item, idx) => (
                        <Grid item xs={6} key={idx}>
                            <div className='pie-chart-container'>
                                <div className='pie-chart'>
                                    <Pie data={{
                                        labels: data.labels,
                                        datasets: [item]
                                    }} options={options} />
                                </div>
                                <Typography sx={{
                                    fontSize: "11px",
                                    color: "#1B2631",
                                    fontFamily: "Inter",
                                    margin: "5px 0 5px 0",
                                    // marginBottom: "5px"
                                }}>
                                    {item.label}
                                </Typography>
                            </div>
                        </Grid>
                    ))}

                </Grid>
            </div>
        </>
    )
}
