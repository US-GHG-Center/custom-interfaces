import React, { useState, useEffect } from 'react';
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
        const formattedCity = city.replace(/\s+/g, '_');
        return `./data/vulcan/${formattedCity}_PLACE_AggregatedSectors_2013_2021.json`;
    }

    const colorMap = {
        "Aviation": { borderColor: 'purple', backgroundColor: 'rgba(128, 0, 128, 0.5)' },
        "Industry": { borderColor: 'brown', backgroundColor: 'rgba(165, 42, 42, 0.5)' },
        "Commercial": { borderColor: 'yellow', backgroundColor: 'rgba(255, 255, 0, 0.5)' },
        "Power": { borderColor: 'blue', backgroundColor: 'rgba(0, 0, 255, 0.5)' },
        "Onroad": { borderColor: 'green', backgroundColor: 'rgba(0, 255, 0, 0.5)' },
        "Residential": { borderColor: 'orange', backgroundColor: 'rgba(255, 165, 0, 0.5)' },
        "Railroad": { borderColor: 'darkblue', backgroundColor: 'rgba(0, 0, 139, 0.5)' },
    };

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
                        data: jsonData.map(item => item['Aviation']),
                        borderColor: colorMap["Aviation"].borderColor,
                        backgroundColor: colorMap["Aviation"].backgroundColor,
                        fill: true,
                    },
                    {
                        label: 'Industry',
                        data: jsonData.map(item => item['Industry']),
                        borderColor: colorMap["Industry"].borderColor,
                        backgroundColor: colorMap["Industry"].backgroundColor,
                        fill: true,
                    },
                    {
                        label: 'Commercial',
                        data: jsonData.map(item => item['Commercial']),
                        borderColor: colorMap["Commercial"].borderColor,
                        backgroundColor: colorMap["Commercial"].backgroundColor,
                        fill: true,
                    },
                    {
                        label: 'Power',
                        data: jsonData.map(item => item['Power']),
                        borderColor: colorMap["Power"].borderColor,
                        backgroundColor: colorMap["Power"].backgroundColor,
                        fill: true,
                    },
                    {
                        label: 'Onroad',
                        data: jsonData.map(item => item['Onroad']),
                        borderColor: colorMap["Onroad"].borderColor,
                        backgroundColor: colorMap["Onroad"].backgroundColor,
                        fill: true,
                    },
                    {
                        label: 'Residential',
                        data: jsonData.map(item => item['Residential']),
                        borderColor: colorMap["Residential"].borderColor,
                        backgroundColor: colorMap["Residential"].backgroundColor,
                        fill: true,
                    },
                    {
                        label: 'Railroad',
                        data: jsonData.map(item => item['Railroad']),
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
    }, [selection]);

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
                    text: "metric tons of CO₂"
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

    // const gases = ["CO2", "CO", "NOX", "SOX", "PM2.5"]
    const sectors = [
        "Airports Mass",
        "Residential Buildings Mass",
        "Commercial Buildings Mass",
        "Industrial Buildings Mass",
        "Power Plants Mass",
        "Onroad Gas Mass",
    ]

    const LegendItems = [
        { color: 'rgb(255, 99, 132)', label: 'Airport Mass' },
        { color: 'rgb(54, 162, 235)', label: 'Residential Buildings Mass' },
        { color: 'rgb(250, 192, 192)', label: 'Commerical Buildings Mass' },
        { color: 'rgb(150, 192, 192)', label: 'Industrial Buildings Mass' },
        { color: 'rgb(153, 102, 255)', label: 'Power Plants Mass' },
        { color: 'rgb(155, 118, 83)', label: 'Onroad Gas Mass' },
    ]

    useEffect(() => {
        fetch(`./data/gra2pes/2021_${selection}_species_sector_totals.json`)
            .then(resp => resp.json())
            .then(json => {
                // const gases = json.map(entry => entry.Species);
                const sectorsData = json.map(entry => {
                    return {
                        label: entry.Species,
                        data: sectors.map(sector => parseFloat(entry[sector])),
                        backgroundColor: [
                            'rgb(255, 99, 132)',  // Color for "Airports Mass"
                            'rgb(54, 162, 235)',  // Color for "Residential Buildings Mass"
                            'rgb(250, 192, 192)',  // Color for "Commercial Buildings Mass"
                            'rgb(150, 192, 192)',  // Color for "Industrial Buildings Mass"
                            'rgb(153, 102, 255)', // Color for "Power Plants Mass"
                            'rgb(155, 118, 83)'   // Color for "Onroad Gas Mass"
                        ],
                    }
                });

                setData({
                    labels: sectors,
                    datasets: sectorsData
                });
            })
            .catch(error => console.error("error fetching emissions by sector for gra2pes", error));
    }, [selection]);


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
    const description = "Different industries emit different amounts of CO₂ based on fossil fuel type and use. Long-term data offers a view of how industries change over time."

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


