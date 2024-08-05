let publicUrl = process.env.PUBLIC_URL;

export const nrtStations = [
    {
        stationName: "Mauna Loa, Hawaii",
        stationCode: "MLO",
        source: `${publicUrl}/data/raw/co2/insitu/surface/co2_mko_surface-insitu_1_ccgg_DailyData.txt`, // treated as a nrt data for custom condition
        label: "Observed CO₂ Concentration (MKO Daily In-situ)",
        ghg: "co2",
        frequency: "customMKO",
        chartColor: "#FF7F50",
        notice: "Mauna Loa Observatory measurements were suspended from November 29, 2022 through July 4, 2023 due to the volcanic eruption. Measurements from the Mauna Kea observatory (21 miles to the north) are substituted during this time period to fill in the Mauna Loa record. The Mauna Kea quality-controlled measurments are noted using coral color. NRT data exist for the entire period."
    },
    {
        stationName: "Mauna Loa, Hawaii", // A Daily NRT for CO2 measured in MLO station
        stationCode: "MLO",
        source: "https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_daily_mlo.txt",
        label: "Observed CO₂ Concentration (Daily NRT)",
        ghg: "co2",
        frequency: "daily",
        chartColor: "blue",
        useAsDataAccess: true,
        useProxy: true,
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

