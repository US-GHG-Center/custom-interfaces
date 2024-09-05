import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, Filler, ArcElement } from 'chart.js';

import { Line, Pie } from 'react-chartjs-2';
import { Typography, Grid, Box } from '@mui/material';
import "./index.css";

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, Filler, ArcElement);

// const EmissionsBySectorCard = () => {
//     const [data, setData] = useState({
//         labels: [],
//         datasets: [{
//             data: [],
//             backgroundColor: [

//             ],
//             borderColor: [

//             ],
//         }]
//     });

//     useEffect(() => {
//         fetch("./data/sectoralEmissions.json")
//             .then(response => response.json())
//             .then(json => setData(json))
//             .catch(error => console.error("Error fetching sectoral emissions data"))
//     })

//     const options = {
//         plugins: {
//             title: {
//                 display: true,
//                 text: 'Emissions by Sector',
//             },
//             legend: {
//                 display: false,
//                 position: 'bottom',
//             },
//             tooltip: {
//                 mode: 'index',
//                 intersect: false,
//             },
//         },
//         responsive: true,
//         maintainAspectRation: false,
//         scales: {
//             x: {
//                 stacked: true,
//                 title: {
//                     display: true,
//                     text: "Year"
//                 }
//             },
//             y: {
//                 stacked: true,
//                 min: -2000,
//                 max: 8000,
//                 title: {
//                     display: true,
//                     text: "Emissions (metric tons)"
//                 },
//                 ticks: {
//                     stepSize: 1000,
//                 }
//             },
//         },
//     };

//     return (
//         <div>
//             <Line data={data} options={options} height={-400} />
//         </div>
//     )
// }

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
        return `./data/vulcan/${formattedCity}_PLACE_AllSectors_2013_2021.json`;
    }

    const colorMap = {
        "Airport": { borderColor: 'purple', backgroundColor: 'rgba(128, 0, 128, 0.5)' },
        "Cement": { borderColor: 'gray', backgroundColor: 'rgba(169, 169, 169, 0.5)' },
        "Commercial Marine Vessels": { borderColor: 'teal', backgroundColor: 'rgba(0, 128, 128, 0.5)' },
        "Electricity": { borderColor: 'blue', backgroundColor: 'rgba(0, 0, 255, 0.5)' },
        "Nonroad": { borderColor: 'cyan', backgroundColor: 'rgba(0, 255, 255, 0.5)' },
        "Onroad Gas": { borderColor: 'green', backgroundColor: 'rgba(0, 255, 0, 0.5)' },
        "Onroad Diesel": { borderColor: 'red', backgroundColor: 'rgba(255, 0, 0, 0.5)' },
        "Residential Buildings": { borderColor: 'orange', backgroundColor: 'rgba(255, 165, 0, 0.5)' },
        "Railroad": { borderColor: 'darkblue', backgroundColor: 'rgba(0, 0, 139, 0.5)' },
        "Commercial Buildings": { borderColor: 'yellow', backgroundColor: 'rgba(255, 255, 0, 0.5)' },
        "Commercial Point Sources": { borderColor: 'lightgreen', backgroundColor: 'rgba(144, 238, 144, 0.5)' },
        "Industrial Buildings": { borderColor: 'brown', backgroundColor: 'rgba(165, 42, 42, 0.5)' },
        "Industrial Point Sources": { borderColor: 'darkred', backgroundColor: 'rgba(139, 0, 0, 0.5)' }
    };

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
                        label: 'Airport',
                        data: jsonData.map(item => item['Airport']),
                        borderColor: colorMap["Airport"].borderColor,
                        backgroundColor: colorMap["Airport"].backgroundColor,
                        fill: true,
                    },
                    {
                        label: 'Cement',
                        data: jsonData.map(item => item['Cement']),
                        borderColor: colorMap["Cement"].borderColor,
                        backgroundColor: colorMap["Cement"].backgroundColor,
                        fill: true,
                    },
                    {
                        label: 'Commercial Marine Vessels',
                        data: jsonData.map(item => item['Commercial Marine Vessels']),
                        borderColor: colorMap["Commercial Marine Vessels"].borderColor,
                        backgroundColor: colorMap["Commercial Marine Vessels"].backgroundColor,
                        fill: true,
                    },
                    {
                        label: 'Electricity',
                        data: jsonData.map(item => item['Electricity']),
                        borderColor: colorMap["Electricity"].borderColor,
                        backgroundColor: colorMap["Electricity"].backgroundColor,
                        fill: true,
                    },
                    {
                        label: 'Nonroad',
                        data: jsonData.map(item => item['Nonroad']),
                        borderColor: colorMap["Nonroad"].borderColor,
                        backgroundColor: colorMap["Nonroad"].backgroundColor,
                        fill: true,
                    },
                    {
                        label: 'Onroad Gas',
                        data: jsonData.map(item => item['Onroad Gas']),
                        borderColor: colorMap["Onroad Gas"].borderColor,
                        backgroundColor: colorMap["Onroad Gas"].backgroundColor,
                        fill: true,
                    },
                    {
                        label: 'Onroad Diesel',
                        data: jsonData.map(item => item['Onroad Diesel']),
                        borderColor: colorMap["Onroad Diesel"].borderColor,
                        backgroundColor: colorMap["Onroad Diesel"].backgroundColor,
                        fill: true,
                    },
                    {
                        label: 'Residential Buildings',
                        data: jsonData.map(item => item['Residential Buildings']),
                        borderColor: colorMap["Residential Buildings"].borderColor,
                        backgroundColor: colorMap["Residential Buildings"].backgroundColor,
                        fill: true,
                    },
                    {
                        label: 'Railroad',
                        data: jsonData.map(item => item['Railroad']),
                        borderColor: colorMap["Railroad"].borderColor,
                        backgroundColor: colorMap["Railroad"].backgroundColor,
                        fill: true,
                    },
                    {
                        label: 'Commercial Buildings',
                        data: jsonData.map(item => item['Commercial Buildings']),
                        borderColor: colorMap["Commercial Buildings"].borderColor,
                        backgroundColor: colorMap["Commercial Buildings"].backgroundColor,
                        fill: true,
                    },
                    {
                        label: 'Commercial Point Sources',
                        data: jsonData.map(item => item['Commercial Point Sources']),
                        borderColor: colorMap["Commercial Point Sources"].borderColor,
                        backgroundColor: colorMap["Commercial Point Sources"].backgroundColor,
                        fill: true,
                    },
                    {
                        label: 'Industrial Buildings',
                        data: jsonData.map(item => item['Industrial Buildings']),
                        borderColor: colorMap["Industrial Buildings"].borderColor,
                        backgroundColor: colorMap["Industrial Buildings"].backgroundColor,
                        fill: true,
                    },
                    {
                        label: 'Industrial Point Sources',
                        data: jsonData.map(item => item['Industrial Point Sources']),
                        borderColor: colorMap["Industrial Point Sources"].borderColor,
                        backgroundColor: colorMap["Industrial Point Sources"].backgroundColor,
                        fill: true,
                    }
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
        <div style={{ height: '300px', width: '100%' }}>
            <Line data={chartData} options={options} height={300} />
        </div>
    );
};

const GasEmissionsCard = () => {
    const [data, setData] = useState({
        labels: [],
        datasets: [{
            // label: "Emissions by Gas",
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
            },
        },
    };

    useEffect(() => {
        fetch("./data/gasEmissions.json")
            .then(response => response.json())
            .then(json => setData(json))
            .catch(error => console.error("Error fetching emissions by gas data"))
    }, []);


    const Legend = () => {
        const LegendItems = [
            { color: 'rgb(255, 99, 132)', label: 'CO2' }, // Light blue for Carbon Dioxide
            { color: 'rgb(54, 162, 235)', label: 'CO' },        // Red for Methane
            { color: 'rgb(75, 192, 192)', label: 'PM2.5' },  // Dark blue for Nitrous Oxide
            { color: 'rgb(250, 192, 192)', label: 'NOx' },
            { color: 'rgb(150, 192, 192)', label: 'SOx' },
        ]

        return (
            <Grid container direction="column" spacing={0.3}>
                {LegendItems.map((item, index) => (
                    <Grid item key={index} container direction="row" alignItems="center">
                        <Box
                            sx={{
                                width: 21,
                                height: 21,
                                backgroundColor: item.color,
                                marginRight: 1,
                            }}
                        />
                        <Typography sx={{ fontSize: "12px", color: "#1B2631" }}>{item.label}</Typography>
                    </Grid>
                ))}
            </Grid>
        )
    }

    return (
        <>
            <Grid container alignItems="center" spacing={1.5}>

                <Grid item xs={6}>
                    <div className='pie-chart-container'>
                        <div className='pie-chart'>
                            <Pie data={data} options={options} />
                        </div>
                        <Typography sx={{
                            fontSize: "12px",
                            color: "#1B2631"
                        }}>
                            Energy Production
                        </Typography>
                    </div>
                </Grid>

                <Grid item xs={6}>
                    <Typography sx={{ fontSize: "12px", color: "#1B2631", marginBottom: "4px" }}>
                        Legend
                    </Typography>
                    <Legend />
                </Grid>

                <Grid item xs={6}>
                    <div className='pie-chart-container'>
                        <div className='pie-chart'>
                            <Pie data={data} options={options} />
                        </div>
                        <Typography sx={{
                            fontSize: "12px",
                            color: "#1B2631"
                        }}>
                            Manufacturing
                        </Typography>
                    </div>
                </Grid>

                <Grid item xs={6}>
                    <div className='pie-chart-container'>
                        <div className='pie-chart'>
                            <Pie data={data} options={options} />
                        </div>
                        <Typography sx={{
                            fontSize: "12px",
                            color: "#1B2631"
                        }}>
                            Transportation
                        </Typography>
                    </div>
                </Grid>

                <Grid item xs={6}>
                    <div className='pie-chart-container'>
                        <div className='pie-chart'>
                            <Pie data={data} options={options} />
                        </div>
                        <Typography sx={{
                            fontSize: "12px",
                            color: "#1B2631"
                        }}>
                            Agriculture
                        </Typography>
                    </div>
                </Grid>

                <Grid item xs={6}>
                    <div className='pie-chart-container'>
                        <div className='pie-chart'>
                            <Pie data={data} options={options} />
                        </div>
                        <Typography sx={{
                            fontSize: "12px",
                            color: "#1B2631"
                        }}>
                            Land Use
                        </Typography>
                    </div>
                </Grid>
            </Grid>
        </>
    )
}

const VulcanInsightsCard = ({ selection }) => {
    const title = "CO₂ Emissions by Sector";
    const description = "Different industries emit different amount of CO₂ based on the types of fuel sources they use and how they burn that fuel. Industries also change in different ways over time!"

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

const Gra2pesInsightsCard = () => {
    const title = "Emissions by Sector";
    const description = "Different industries emit different greenhouse gases based on the types of fuel sources they use and how they burn that fuel."

    return (
        <>
            <div className="dataset-card">
                <h2>{title}</h2>
                <p>
                    {description}
                </p>
            </div>
            <div>
                <GasEmissionsCard />
            </div>

        </>
    )
}




export function DataInsightsCard({ dataset, selection }) {
    return (
        <>
            {dataset == "vulcan" && <VulcanInsightsCard selection={selection} />}
            {dataset == "gra2pes" && <Gra2pesInsightsCard />}
        </>
    )
}



