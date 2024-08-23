import React, { Fragment } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import { ExploreData } from './helper/root';
import { AirQualityCard } from '../cards/defaultAir';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Card } from '@mui/material';


export function ExploreTowerData() {
    const towerDataViewerUrl = "https://ghgc-custom-interfaces-develop.s3.us-west-2.amazonaws.com/ghgcenter/custom-interfaces/noaa-gggrn-ghg-concentrations-temp/index.html?ghg=co2&frequency=all&station_code=WGC";

    const textContent = `The National Oceanic and Atmospheric Administration (NOAA) is a scientific agency within the United States Department of Commerce focused on the conditions of the oceans, major waterways, and the atmosphere. NOAA plays a vital role in everyday life, from weather forecasting and climate monitoring to supporting coastal and marine commerce. One of the key components of NOAA’s infrastructure is its network of observational towers, which provide critical data for various environmental monitoring and research activities.

NOAA’s observational towers are strategically placed to gather a wide array of data that contribute to our understanding of weather patterns, climate change, and atmospheric conditions. These towers are equipped with an array of instruments that measure parameters such as temperature, humidity, wind speed and direction, atmospheric pressure, solar radiation, and more. The data collected are essential for building accurate weather models, understanding local and regional climate patterns, and supporting research on environmental changes.

One of the most significant aspects of NOAA’s tower data is its role in weather forecasting. The towers provide real-time data that feed into sophisticated weather models, allowing meteorologists to predict weather conditions with greater accuracy. For example, data on wind speed and direction from these towers help in predicting the movement of weather fronts and storm systems. Temperature and humidity readings are critical for forecasting precipitation and severe weather events such as thunderstorms and hurricanes. This information is invaluable for public safety, as it helps in issuing timely weather warnings and advisories.

In addition to weather forecasting, NOAA’s tower data are crucial for climate research. Long-term data sets from these towers enable scientists to study trends and changes in climate over time. By analyzing patterns in temperature, humidity, and other atmospheric conditions, researchers can gain insights into the impacts of global warming and other climatic shifts. This information is vital for developing strategies to mitigate and adapt to climate change, such as understanding the frequency and intensity of heatwaves, droughts, and other extreme weather events.

Another important application of NOAA’s tower data is in air quality monitoring.`;

    return (
        <ExploreData embedLink={towerDataViewerUrl}>
            <Fragment>
                <Container>
                    <div className='explore-title'>
                        <Typography variant="h5">
                            Explore Tower Data
                        </Typography>
                    </div>
                    <div className='explore-body'>
                        <Card>
                            <Grid container spacing={2}>
                                <Grid xs={6}>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <AirQualityCard />
                                    </div>
                                </Grid>
                                <Grid xs={6} style={{ alignContent: "center" }}>
                                    <Typography variant="body1" style={{ marginRight:"35px", textAlign: "justify" }}>
                                        The NOAA Global Greenhouse Gas Reference Network (GGGRN) provides measurements of greenhouse gases at multiple sites around the world. The data is used to understand the global distribution of greenhouse gases and how they are changing over time. The data is also used to validate satellite observations of greenhouse gases and to improve our understanding of the processes that control their distribution in the atmosphere.
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Card>
                        <Card>
                            <Typography variant="body1" style={{ margin:"5px" }}>
                                {textContent}
                            </Typography>
                        </Card>
                    </div>
                </Container>
            </Fragment>
        </ExploreData>
    );
}