import {GHG} from '../enumeration.js';
let publicUrl = process.env.PUBLIC_URL;

// a dictionary/mapping of instrument type and the graphs to be shown in the chart 
export const instrumentsMapGraphs = (ghg="ch4", type="flask", medium="surface", datasetName) => ({
    "insitu": [
        {
            "label": `Observed ${GHG[ghg].short} Concentration (Daily)`,
            "dataSource": `${publicUrl ? publicUrl : ""}/data/processed/${ghg}/${type}/${medium}/${getInsituFilename(datasetName, "daily")}.json`
        },
        {
            "label": `Observed ${GHG[ghg].short} Concentration (Monthly)`,
            "dataSource": `${publicUrl ? publicUrl : ""}/data/processed/${ghg}/${type}/${medium}/${getInsituFilename(datasetName, "monthly")}.json`
        }
    ]
});

// helper

function getInsituFilename(filename, frequency) {
    if (!filename) {
        return "";
    }
    let splitted_filename = filename.split("_");
    switch(frequency) {
        case "daily":
            splitted_filename[splitted_filename.length-1] = "DailyData";
            return splitted_filename.join("_");
        case "monthly":
            splitted_filename[splitted_filename.length-1] = "MonthlyData";
            return splitted_filename.join("_");
        case "hourly":
            splitted_filename[splitted_filename.length-1] = "HourlyData";
            return splitted_filename.join("_");
        default:
            splitted_filename[splitted_filename.length-1] = "DailyData";
            return splitted_filename.join("_");
    }
}