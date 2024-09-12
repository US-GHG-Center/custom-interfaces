import React, { useState, useEffect, useMemo } from 'react';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, Filler, ArcElement } from 'chart.js';

import { Line, Pie } from 'react-chartjs-2';
import { Typography, Grid, Box } from '@mui/material';
import "./index.css";

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, Filler, ArcElement);

//For VULCAN sectoral stack plot
export const StackedAreaChart = ({ selection }) => {
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

    //function to format filepath according to city selection
    const formatFilePath = (city) => {
        const formattedCity = city.replace('/', '-').replace(/\s+/g, '_');
        return `./data/vulcan/${formattedCity}_PLACE_AggregatedSectors_2013_2021.json`;
    }

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
                            maxWidth: "88px"
                        }}>{label}</Typography>
                    </Grid>
                ))}
            </Grid>
        )
    }

    useEffect(() => {
        fetch(formatFilePath(selection))
            .then(resp => {
                return resp.json();
            })
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
                    text: "kilo tons of CO₂"
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

// GRA2PES Emissions by Sector 
const GasEmissionsBySectorCard = ({ selection }) => {
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
        { color: 'rgb(255, 99, 132)', label: 'Industrial' },
        { color: 'rgb(54, 162, 235)', label: 'Onroad Transportation' },
        { color: 'rgb(250, 192, 192)', label: 'Power' },
        { color: 'rgb(150, 192, 192)', label: 'Nonroad Transportation' },
        { color: 'rgb(153, 102, 255)', label: 'Other' },
        { color: 'rgb(155, 118, 83)', label: 'Residential + Commercial' },
    ]

    //function to format filepath according to city selection
    const formatFilePath = (city) => {
        const formattedCity = city.replace('/', '-').replace(/\s+/g, '_');
        return `./data/gra2pes/${formattedCity}_2021_Month07_species_sectoral_breakdown_conservative.json`;
    }

    useEffect(() => {
        fetch(formatFilePath(selection))
            .then(resp => resp.json())
            .then(json => {
                // const gases = json.map(entry => entry.Species);
                const sectorsData = json.map(entry => {
                    return {
                        label: entry.Species,
                        data: sectors.map(sector => parseFloat(entry[sector])),
                        backgroundColor: [
                            'rgb(255, 99, 132)',  // Color for "Industrial"
                            'rgb(54, 162, 235)',  // Color for "Onroad Transportation"
                            'rgb(250, 192, 192)',  // Color for "Power"
                            'rgb(150, 192, 192)',  // Color for "Nonroad Transportation"
                            'rgb(153, 102, 255)', // Color for "Other"
                            'rgb(155, 118, 83)'   // Color for "Residential + Commercial"
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
                            fontSize: "12px",
                            color: "#1B2631",
                            whiteSpace: "normal",
                            overflowWrap: "break-word",
                            maxWidth: "88px"
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
                                    fontSize: "12px",
                                    color: "#1B2631"
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

const VulcanInsightsCard = ({ selection }) => {
    const title = "Urban CO₂ Emissions by Sector";
    const description = "Different sectors emit different amounts of CO₂ based on fossil fuel type and use. Long-term data offers a view of how sectors change over time."

    return (
        <>
            <div className="dataset-card">
                <h2>{title}</h2>
                <p>
                    {description}
                </p>
            </div>
            <div className="stacked-chart-container">
                <StackedAreaChart selection={selection} />
            </div>

        </>
    )
}

const Gra2pesInsightsCard = ({ selection }) => {
    const title = "Emissions by Sector";
    const description = "Emissions for different sectors vary due to different types of fossil fuel use."

    return (
        <>
            <div className="dataset-card">
                <h2>{title}</h2>
                <p>
                    {description}
                </p>
            </div>
            <div>
                <GasEmissionsBySectorCard selection={selection} />
            </div>

        </>
    )
}




export function DataInsightsCard({ dataset, selection }) {
    return (
        <>
            {dataset === "vulcan" && <VulcanInsightsCard selection={selection} />}
            {dataset === "gra2pes" && <Gra2pesInsightsCard selection={selection} />}
        </>
    )
}



