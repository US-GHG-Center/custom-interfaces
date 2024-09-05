// import React, { useState, useEffect } from 'react';
// import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, Filler, ArcElement } from 'chart.js';

// import { Line, Pie } from 'react-chartjs-2';
// import { Typography, Grid, Box } from '@mui/material';

// ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, Filler, ArcElement);

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


// const GasEmissionsCard = () => {
//     const [data, setData] = useState({
//         labels: [],
//         datasets: [{
//             // label: "Emissions by Gas",
//             data: [],
//             backgroundColor: [],
//         }]
//     });

//     const options = {
//         plugins: {
//             legend: {
//                 display: false, // hide legends
//             },
//             tooltip: {
//                 enabled: true, // enable tooltips
//             },
//         },
//     };

//     useEffect(() => {
//         fetch("./data/gasEmissions.json")
//             .then(response => response.json())
//             .then(json => setData(json))
//             .catch(error => console.error("Error fetching emissions by gas data"))
//     }, []);


//     const Legend = () => {
//         const LegendItems = [
//             { color: 'rgb(255, 99, 132)', label: 'CO2' }, // Light blue for Carbon Dioxide
//             { color: 'rgb(54, 162, 235)', label: 'CO' },        // Red for Methane
//             { color: 'rgb(75, 192, 192)', label: 'PM2.5' },  // Dark blue for Nitrous Oxide
//             { color: 'rgb(250, 192, 192)', label: 'NOx' },
//             { color: 'rgb(150, 192, 192)', label: 'SOx' },
//         ]

//         return (
//             <Grid container direction="column" spacing={0.3}>
//                 {LegendItems.map((item, index) => (
//                     <Grid item key={index} container direction="row" alignItems="center">
//                         <Box
//                             sx={{
//                                 width: 21,
//                                 height: 21,
//                                 backgroundColor: item.color,
//                                 marginRight: 1,
//                             }}
//                         />
//                         <Typography sx={{ fontSize: "12px", color: "#1B2631" }}>{item.label}</Typography>
//                     </Grid>
//                 ))}
//             </Grid>
//         )
//     }

//     return (
//         <>
//             <Grid container alignItems="center" spacing={1.5}>

//                 <Grid item xs={6}>
//                     <div className='pie-chart-container'>
//                         <div className='pie-chart'>
//                             <Pie data={data} options={options} />
//                         </div>
//                         <Typography sx={{
//                             fontSize: "12px",
//                             color: "#1B2631"
//                         }}>
//                             Energy Production
//                         </Typography>
//                     </div>
//                 </Grid>

//                 <Grid item xs={6}>
//                     <Typography sx={{ fontSize: "12px", color: "#1B2631", marginBottom: "4px" }}>
//                         Legend
//                     </Typography>
//                     <Legend />
//                 </Grid>

//                 <Grid item xs={6}>
//                     <div className='pie-chart-container'>
//                         <div className='pie-chart'>
//                             <Pie data={data} options={options} />
//                         </div>
//                         <Typography sx={{
//                             fontSize: "12px",
//                             color: "#1B2631"
//                         }}>
//                             Manufacturing
//                         </Typography>
//                     </div>
//                 </Grid>

//                 <Grid item xs={6}>
//                     <div className='pie-chart-container'>
//                         <div className='pie-chart'>
//                             <Pie data={data} options={options} />
//                         </div>
//                         <Typography sx={{
//                             fontSize: "12px",
//                             color: "#1B2631"
//                         }}>
//                             Transportation
//                         </Typography>
//                     </div>
//                 </Grid>

//                 <Grid item xs={6}>
//                     <div className='pie-chart-container'>
//                         <div className='pie-chart'>
//                             <Pie data={data} options={options} />
//                         </div>
//                         <Typography sx={{
//                             fontSize: "12px",
//                             color: "#1B2631"
//                         }}>
//                             Agriculture
//                         </Typography>
//                     </div>
//                 </Grid>

//                 <Grid item xs={6}>
//                     <div className='pie-chart-container'>
//                         <div className='pie-chart'>
//                             <Pie data={data} options={options} />
//                         </div>
//                         <Typography sx={{
//                             fontSize: "12px",
//                             color: "#1B2631"
//                         }}>
//                             Land Use
//                         </Typography>
//                     </div>
//                 </Grid>
//             </Grid>
//         </>
//     )
// }

// const VulcanInsightsCard = () => {
//     const title = "CO₂ Emissions by Sector";
//     const description = "Different industries emit different amount of CO₂ based on the types of fuel sources they use and how they burn that fuel. Industries also change in different ways over time!"

//     return (
//         <>
//             <div className="dataset-card">
//                 <h2>{title}</h2>
//                 <p>
//                     {description}
//                 </p>
//             </div>
//             <div>
//                 <StackedAreaChart />
//             </div>

//         </>
//     )
// }

// const Gra2pesInsightsCard = () => {
//     const title = "Emissions by Sector";
//     const description = "Different industries emit different greenhouse gases based on the types of fuel sources they use and how they burn that fuel."

//     return (
//         <>
//             <div className="dataset-card">
//                 <h2>{title}</h2>
//                 <p>
//                     {description}
//                 </p>
//             </div>
//             <div>
//                 <GasEmissionsCard />
//             </div>

//         </>
//     )
// }

// export const StackedAreaChart = () => {
//     const [chartData, setChartData] = useState({
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
//         fetch("./data/vulcan_emissions.json")
//             .then(resp => {
//                 return resp.json();
//             })
//             .then(jsonData => {
//                 const years = jsonData.map(item => item.YEAR);

//                 // Define the datasets for each category
//                 const datasets = [
//                     {
//                         label: 'Onroad Gas',
//                         data: jsonData.map(item => item['Onroad Gas']),
//                         borderColor: 'green',
//                         backgroundColor: 'rgba(0, 255, 0, 0.5)',
//                         fill: true,
//                     },
//                     {
//                         label: 'Onroad Diesel',
//                         data: jsonData.map(item => item['Onroad Diesel']),
//                         borderColor: 'red',
//                         backgroundColor: 'rgba(255, 0, 0, 0.5)',
//                         fill: true,
//                     },
//                     {
//                         label: 'Nonroad',
//                         data: jsonData.map(item => item['Nonroad']),
//                         borderColor: 'cyan',
//                         backgroundColor: 'rgba(0, 255, 255, 0.5)',
//                         fill: true,
//                     },
//                     {
//                         label: 'Electricity',
//                         data: jsonData.map(item => item['Electricity']),
//                         borderColor: 'blue',
//                         backgroundColor: 'rgba(0, 0, 255, 0.5)',
//                         fill: true,
//                     },
//                     {
//                         label: 'Residential Buildings',
//                         data: jsonData.map(item => item['Residential Buildings']),
//                         borderColor: 'orange',
//                         backgroundColor: 'rgba(255, 165, 0, 0.5)',
//                         fill: true,
//                     },
//                     {
//                         label: 'Commercial Buildings',
//                         data: jsonData.map(item => item['Commercial Buildings']),
//                         borderColor: 'yellow',
//                         backgroundColor: 'rgba(255, 255, 0, 0.5)',
//                         fill: true,
//                     },
//                     {
//                         label: 'Industrial Buildings',
//                         data: jsonData.map(item => item['Industrial Buildings']),
//                         borderColor: 'brown',
//                         backgroundColor: 'rgba(165, 42, 42, 0.5)',
//                         fill: true,
//                     },
//                     {
//                         label: 'Airport',
//                         data: jsonData.map(item => item['Airport']),
//                         borderColor: 'purple',
//                         backgroundColor: 'rgba(128, 0, 128, 0.5)',
//                         fill: true,
//                     },
//                 ];

//                 setChartData({
//                     labels: years,
//                     datasets: datasets,
//                 });
//             })
//             .catch(error => console.error("error reading emissions data", error));
//     }, []);

//     const options = {
//         plugins: {
//             legend: {
//                 display: false,
//                 // position: '',/
//             },
//         },
//         scales: {
//             y: {
//                 stacked: true,
//                 // beginAtZero: true,

//             },
//             x: {
//                 stacked: true,
//                 title: {
//                     display: true,
//                     text: "Year"
//                 }
//             },
//         },
//     };

//     return (
//         <div>
//             <Line data={chartData} options={options} />
//         </div>
//     );
// };


// export function DataInsightsCard({ dataset }) {
//     return (
//         <>
//             {dataset == "vulcan" && <VulcanInsightsCard />}
//             {dataset == "gra2pes" && <Gra2pesInsightsCard />}
//         </>
//     )
// }



