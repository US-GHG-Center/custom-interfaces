let publicUrl = process.env.PUBLIC_URL;

export const nrtStations = [
    {
        stationName: "Mauna Loa, Hawaii",
        stationCode: "MLO",
        source: `${publicUrl}/data/raw/co2/insitu/surface/co2_mko_surface-insitu_1_ccgg_DailyData.txt`,
        label: "Observed CO₂ Concentration (MKO Station)",
        ghg: "co2",
        frequency: "custom"
    },
    {
        stationName: "Mauna Loa, Hawaii",
        stationCode: "MLO",
        source: "https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_daily_mlo.txt",
        label: "Observed CO₂ Concentration (Daily NRT)",
        ghg: "co2",
        frequency: "daily"
    },
    // {
    //     stationName: "Mauna Loa, Hawaii",
    //     stationCode: "MLO",
    //     source: "https://gml.noaa.gov/webdata/ccgg/trends/ch4/ch4_mm_gl.txt",
    //     label: "Observed CH₄ Concentration (Monthly NRT)",
    //     ghg: "ch4",
    //     frequency: "monthly"
    // }
];

