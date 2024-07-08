let publicUrl = process.env.PUBLIC_URL;

export const nrtStations = [
    {
        stationName: "Mauna Loa, Hawaii",
        stationCode: "MLO",
        source: `${publicUrl}/data/raw/co2/insitu/surface/co2_mko_surface-insitu_1_ccgg_DailyData.txt`, // treated as a nrt data for custom condition
        label: "Observed CO₂ Concentration (MKO Daily In-situ)",
        ghg: "co2",
        frequency: "customMKO",
        skipProxy: true,
        chartColor: "#ff6868",
        notice: "Due to the eruption of the Mauna Loa Volcano, measurements from Mauna Loa Observatory were suspended as of Nov. 29, 2022. Observations from December 2022 to July 4, 2023 are from a site at the Maunakea Observatories, approximately 21 miles north of the Mauna Loa Observatory. Mauna Loa observations resumed in July 2023."
    },
    {
        stationName: "Mauna Loa, Hawaii",
        stationCode: "MLO",
        source: "https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_daily_mlo.txt",
        label: "Observed CO₂ Concentration (Daily NRT)",
        ghg: "co2",
        frequency: "daily",
        chartColor: "blue"
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

