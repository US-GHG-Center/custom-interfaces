import {GHG, CO2, CH4, INSITU} from "../enumeration";
let publicUrl = process.env.PUBLIC_URL;

/**
 * Retrieves data sources and labels for a station based on the provided station metadata and query parameters.
 * 
 * This function retrieves data sources and labels for a station (when clicked) based on the provided station metadata
 * and query parameters. It calculates the appropriate data sources and labels considering the station's
 * dataset_project, other_dataset_projects, ghg. It constructs an array
 * containing all data sources and labels for the station.
 * 
 * Note: This works off some base assumptions:
 * 1. The station.dataset_project will always be formatted in <medium>-<type>; in small case.
 * 2. Make sure that both other_dataset_names and other_dataset_projects will be aligned (in size and index). Ref. how it is formed in `getUniqueStations` method.
 * 
 * Note: GHG from query param and dataset_project, other_dataset_projects, dataset_name, other_dataset_names from station meta
 * are sufficient to exactily know what data we want.
 * 
 * @param {Object} station - The metadata of the station.
 * @param {string} station.dataset_project- The metadata information about which project the dataset is from.
 * @param {Array} station.other_dataset_projects - If the station has other datasets collected, a reference to that.
 * @param {string} station.dataset_name - The metadata information about the dataset name.
 * @param {Array} station.other_dataset_names - If the station has other datasets collected, a reference to those dataset_name
 * @param {Object} queryParams - An object containing query parameters.
 * @param {string} [queryParams.ghg] - The greenhouse gas (co2 or ch4).
 * @returns {Array<string>} An array containing data sources and labels for the station.
 */
export const getDataSourceAndLabels = (station, queryParams) => {
    const allDataSourceAndLabelsForStation = [];
    const { ghg } = queryParams;
    const { dataset_project, other_dataset_projects, dataset_name, other_dataset_names } = station;
    const datasourceAndLabelDict = getDataSourceAndLabelsRefDict(dataset_name)
    const [ medium, type ] = dataset_project.split("-"); // NOTE: with assumption that the dataset_project will always be <medium>-<type> and in small case.
    if (type == INSITU) {
        allDataSourceAndLabelsForStation.push(datasourceAndLabelDict[ghg][type][medium]["daily"]);
        allDataSourceAndLabelsForStation.push(datasourceAndLabelDict[ghg][type][medium]["monthly"]);
    } else {
        allDataSourceAndLabelsForStation.push(datasourceAndLabelDict[ghg][type][medium]);
    }

    other_dataset_projects.forEach((dataset_project, idx) => {
        let dataset_name = other_dataset_names[idx];
        let datasourceAndLabelDict = getDataSourceAndLabelsRefDict(dataset_name)
        const [ medium, type ] = dataset_project.split("-"); 
        if (type == INSITU) {
            allDataSourceAndLabelsForStation.push(datasourceAndLabelDict[ghg][type][medium]["daily"]);
            allDataSourceAndLabelsForStation.push(datasourceAndLabelDict[ghg][type][medium]["monthly"]);
        } else {
            allDataSourceAndLabelsForStation.push(datasourceAndLabelDict[ghg][type][medium]);
        }
    });

    return allDataSourceAndLabelsForStation;
}

// helper

/**
 * A dictionary containing data sources and labels within the dataset hierarchy.
 * 
 * This function constructs a dictionary containing data sources and labels for different types
 * of greenhouse gases (CO2 and CH4) and their corresponding data types (flask, pfp, insitu)
 * and measurement mediums (surface, tower). It generates URLs for data sources and labels
 * based on the provided dataset name and returns the constructed dictionary.
 * TODO: Make it DRY
 * 
 * @param {string} datasetName - The name of the dataset.
 * @returns {Object} A dictionary containing data sources and labels for different greenhouse gases, data types, and measurement mediums.
 */
const getDataSourceAndLabelsRefDict = (datasetName) => {
    return ({
        co2: {
            flask: {
                surface: {
                    datasource: `${publicUrl ? publicUrl : ""}/data/raw/co2/flask/surface/${datasetName}.txt`,
                    label: `Observed ${GHG[CO2].short} Concentration (Flask)`
                },
            },
            pfp: {
                surface: {
                    datasource: `${publicUrl ? publicUrl : ""}/data/raw/co2/pfp/surface/${datasetName}.txt`,
                    label: `Observed ${GHG[CO2].short} Concentration (PFP)`    
                }
            },
            insitu: {
                surface: {
                    daily: {
                        datasource: `${publicUrl ? publicUrl : ""}/data/processed/co2/insitu/surface/${getInsituFilename(datasetName, "daily")}.json`,
                        label: `Observed ${GHG[CO2].short} Concentration (Daily In-situ)`
                    },
                    monthly: {
                        datasource: `${publicUrl ? publicUrl : ""}/data/processed/co2/insitu/surface/${getInsituFilename(datasetName, "monthly")}.json`,
                        label: `Observed ${GHG[CO2].short} Concentration (Monthly In-situ)`
                    }
                },
                tower: {
                    daily: {
                        datasource: `${publicUrl ? publicUrl : ""}/data/processed/co2/insitu/tower/${getInsituFilename(datasetName, "daily")}.json`,
                        label: `Observed ${GHG[CO2].short} Concentration (Daily In-situ)`
                    },
                    monthly: {
                        datasource: `${publicUrl ? publicUrl : ""}/data/processed/co2/insitu/tower/${getInsituFilename(datasetName, "monthly")}.json`,
                        label: `Observed ${GHG[CO2].short} Concentration (Monthly In-situ)`
                    }
                }
                
            }
        },
        ch4: {
            flask: {
                surface: {
                    datasource: `${publicUrl ? publicUrl : ""}/data/raw/ch4/flask/surface/${datasetName}.txt`,
                    label: `Observed ${GHG[CH4].short} Concentration (Flask)`
                },
            },
            pfp: {
                surface: {
                    datasource: `${publicUrl ? publicUrl : ""}/data/raw/ch4/pfp/surface/${datasetName}.txt`,
                    label: `Observed ${GHG[CH4].short} Concentration (PFP)`    
                }
            },
            insitu: {
                surface: {
                    daily: {
                        datasource: `${publicUrl ? publicUrl : ""}/data/processed/ch4/insitu/surface/${getInsituFilename(datasetName, "daily")}.json`,
                        label: `Observed ${GHG[CH4].short} Concentration (Daily In-situ)`
                    },
                    monthly: {
                        datasource: `${publicUrl ? publicUrl : ""}/data/processed/ch4/insitu/surface/${getInsituFilename(datasetName, "monthly")}.json`,
                        label: `Observed ${GHG[CH4].short} Concentration (Monthly In-situ)`
                    }
                },
                tower: {
                    daily: {
                        datasource: `${publicUrl ? publicUrl : ""}/data/processed/ch4/insitu/tower/${getInsituFilename(datasetName, "daily")}.json`,
                        label: `Observed ${GHG[CH4].short} Concentration (Daily In-situ)`
                    },
                    monthly: {
                        datasource: `${publicUrl ? publicUrl : ""}/data/processed/ch4/insitu/tower/${getInsituFilename(datasetName, "monthly")}.json`,
                        label: `Observed ${GHG[CH4].short} Concentration (Monthly In-situ)`
                    }
                }
                
            }
        }
    })
};

/**
 * Generates a modified filename based on the provided filename and frequency.
 * @param {string} filename - The original filename.
 * @param {string} frequency - The frequency of the data (daily, monthly, hourly).
 * @returns {string} The modified filename based on the frequency.
 */
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