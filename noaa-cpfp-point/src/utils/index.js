import stations_data from "../../stations";
import { GHG, CO2, CONTINUOUS, NON_CONTINIOUS, TYPES, FLASK, PFP, INSITU, SURFACE, TOWER, ALL} from "../enumeration.js";
import { instrumentsMapGraphs } from "./instrumentsMapGraphs";

/**
 * Retrieves stations metadata based on the provided query parameters. 
 * This functions similar to fetching data from a database.
 * Here, as a static site application, stations_data in station.js can be considered as a database.
 * 
 * The function accepts query parameters including greenhouse gas (ghg), type,
 * medium, and frequency. If any of these parameters are not provided, default
 * values are used. The function then retrieves stations metadata based on the
 * provided parameters.
 * 
 * Note: Put thing that is priority comparision in the top.
 *
 * @param {Object} queryParams - An object containing query parameters.
 * @param {string} [queryParams.ghg='co2'] - The greenhouse gas (CO2 or CH4).
 *                                          Possible values: 'co2', 'ch4'.
 * @param {string} [queryParams.type='flask'] - The type of data (insitu, flask, or pfp).
 *                                              Possible values: 'insitu', 'flask', 'pfp'.
 * @param {string} [queryParams.medium='surface'] - The medium of measurement (tower or surface).
 *                                                   Possible values: 'tower', 'surface'.
 * @param {string} [queryParams.frequency='continuous'] - The frequency of measurement (continuous or non-continuous).
 *                                                        Possible values: 'continuous', 'non-continuous', 'all'
 * NOTE: Unless frequency is skipped in query params, type and medium values are not considered 
 * @returns {Array<Object>} An array containing stations metadata based on the query parameters.
 * NOTE: If there are overlapping stations, i.e. the stations having multiple dataset collections:\
 *       The dataset_project (medium + type) of the overlapping stations\
 *       are added into that unique station as a new key `other_dataset_projects`.\
 *       Additionally, the dataset_name of the overlapping stations \
 *       are also added into the unique station as a new key `other_dataset_names`.\
 * ie. a new array is injected to the existing station objects.
 * @var {Array<String>} other_dataset_projects - An array of datasets_projects of overlapping stations.\
 *                                             - Empty array if no overlapping station.\
 * @var {Array<String>} other_dataset_names - An array of datasets_names of overlapping stations.\
 *                                          - Empty array if no overlapping station.\
 * @throws {Error} Throws an error if station data is not available.
 */
export function getStationsMeta(queryParams) {
    let {ghg, frequency, type, medium} = queryParams;

    let insituSurfaceStations = stations_data[ghg]["insitu"]["surface"];
    let insituTowerStations = stations_data[ghg]["insitu"]["tower"];
    let pfpSurfaceStations = stations_data[ghg]["pfp"]["surface"];
    let flaskSurfaceStations = stations_data[ghg]["flask"]["surface"];

    try {
        // frequency can be empty.
        // frequency has the higher precedence/priority among other query params
        if (frequency && frequency === CONTINUOUS) {
            // select insitu tower and surface
            let stations = getUniqueStations([...insituSurfaceStations, ...insituTowerStations]);
            return stations;
        }
        if (frequency && frequency === NON_CONTINIOUS) {
            // select flask surface and pfp surface
            let stations = getUniqueStations([...pfpSurfaceStations, ...flaskSurfaceStations]);
            return stations;
        }
        if (frequency && frequency === ALL) {
            // select flask surface and pfp surface
            let stations = getUniqueStations([...pfpSurfaceStations, ...flaskSurfaceStations, ...insituSurfaceStations, ...insituTowerStations]);
            return stations;
        }
        if (frequency) {
            // other frequency values not known
            let stations = [];
            return stations;
        }

        // When no frequency, compute the following
        if (type === INSITU && medium === SURFACE) {
            // return insitu surface
            let stations = getUniqueStations([...insituSurfaceStations]);
            return stations;
        }

        if (type === INSITU && medium === TOWER) {
            // return insitu tower
            let stations = getUniqueStations([...insituTowerStations]);
            return stations;
        }

        if (type === PFP && medium === SURFACE) {
            // return pfp surface
            let stations = getUniqueStations([...pfpSurfaceStations]);
            return stations;
        }

        if (type === FLASK && medium === SURFACE) {
            // return flask surface
            let stations = getUniqueStations([...flaskSurfaceStations]);
            return stations;
        }

        let stations = [];
        return stations;
    } catch (err) {
        return new Error("station data not available.");
    }
}

/**
 * Constructs a URL for fetching station data based on the provided parameters. Similar to a URL for getting a object from s3
 * 
 * @param {string} [ghg="ch4"] - The greenhouse gas (GHG) type. Default is "ch4".
 * @param {string} [type="flask"] - The type of data collection. Default is "flask".
 * @param {string} [medium="surface"] - The medium from which the data is collected. Default is "surface".
 * @param {string} datasetName - The name of the dataset. ref. to the station meta data
 * @returns {Array[string]} - The constructed URLs for fetching the station datas.
 */
export function constructStationDataSourceUrlsAndLabels(ghg="ch4", type="flask", medium="surface", datasetName) {
    let selectedFiles = [];
    let labels = [];
    if (type=="insitu" & medium=="surface-tower"){
        let graphsdatasrc = instrumentsMapGraphs(ghg, type, "surface", datasetName);
        let selectedFileSurface = graphsdatasrc["insitu"].map((graph => graph.dataSource));
        let labelSurface = graphsdatasrc["insitu"].map(graph => graph.label);

        graphsdatasrc = instrumentsMapGraphs(ghg, type, "tower", datasetName);
        let selectedFileTower = graphsdatasrc["insitu"].map((graph => graph.dataSource));
        let labelTower = graphsdatasrc["insitu"].map(graph => graph.label)

        selectedFiles = [...selectedFileSurface, ...selectedFileTower];
        labels = [...labelSurface, ...labelTower];
    } else if (type=="insitu") {
        let graphsdatasrc = instrumentsMapGraphs(ghg, type, medium, datasetName);
        selectedFiles = graphsdatasrc["insitu"].map((graph => graph.dataSource));
        labels = graphsdatasrc["insitu"].map((graph => graph.label));
    } else if (type=="flask-pfp") {
        let graphsdatasrc = instrumentsMapGraphs(ghg, "flask", medium, datasetName);
        let selectedFileFlask = graphsdatasrc["flask"].map((graph => graph.dataSource));
        let labelFlask = graphsdatasrc["flask"].map(graph => graph.label);

        graphsdatasrc = instrumentsMapGraphs(ghg, "pfp", medium, datasetName);
        let selectedFilePFP = graphsdatasrc["pfp"].map((graph => graph.dataSource));
        let labelPFP = graphsdatasrc["pfp"].map(graph => graph.label)

        selectedFiles = [...selectedFileFlask, ...selectedFilePFP];
        labels = [...labelFlask, ...labelPFP];
    } else {
        let graphsdatasrc = instrumentsMapGraphs(ghg, type, medium, datasetName);
        selectedFiles = graphsdatasrc[type].map((graph => graph.dataSource));
        labels = graphsdatasrc[type].map((graph => graph.label));
    }
    let result = { stationDataUrls: selectedFiles, stationDataLabels: labels };
    return result;
}

/**
 * Generates a data source URL for Data Access, based on the specified parameters.
 * 
 * @param {string} [ghg="ch4"] - The greenhouse gas (GHG) type. Default is "ch4".
 * @param {string} [type="flask"] - The type of station. Default is "flask".
 * @param {string} siteCode - The code identifying the specific monitoring site.
 * @returns {string} - The data source URL for accessing the specified data.
 */
export function constructDataAccessSourceUrl(ghg="ch4", type="flask", siteCode) {
    // get the data source for access
    const dataSourceBaseUrl = "https://gml.noaa.gov/dv/data/index.php"
    let frequency = "Discrete";
    if (type == "insitu") {
        frequency="continuous"
    }
    const dataSourceQueryParams = `?type=${TYPES[type].long.replace(" ", "%2B")}&frequency=${frequency}&site=${siteCode}&amp;parameter_name=${GHG[ghg].long.replace(" ", "%2B")}`
    const dataSource = dataSourceBaseUrl + dataSourceQueryParams;
    return dataSource
}

/**
 * Asynchronously fetches station data from the specified URLs.
 * 
 * @param {string} url - The URL from which to fetch the station data.
 * @returns {Promise<Response>} - A Promise that resolves with the fetched data,
 *                                 or rejects with an error if the URL is invalid.
 * @throws {Error} - If the URL is invalid.
 */
export async function getStationDatas(urls) {
    // fetch datas from the hosted paths and then returns it.
    try {
        let promises = urls.map(url => fetch(url));
        let datas = await Promise.all(promises);
        return datas;
    } catch (err) {
        console.log("Invalid file path");
        return new Error("Invalid file path");
    }
}

// helper

/**
 * Retrieves a list of unique stations from the given array of stations.
 *
 * This function takes in a list of stations meta object.\
 * NOTE: If there are overlapping stations:\
 *       the dataset_project (medium + type) of the overlapping stations\
 *       are added into that unique station as a new key `other_dataset_projects`.\
 *       Additionally, the dataset_name of the overlapping stations \
 *       are also added into the unique station as a new key `other_dataset_names`.\
 * ie. a new array is injected to the existing station objects.
 * @var {Array<String>} other_dataset_projects - An array of datasets_projects of overlapping stations.\
 *                                            - Empty array if no overlapping station.\
 * @var {Array<String>} other_dataset_names - An array of datasets_names of overlapping stations.\
 *                                          - Empty array if no overlapping station.\
 *
 * @param {Array<Object>} stations - An array of station objects.
 * @returns {Array<Object>} An array containing unique station objects.
 */
function getUniqueStations(stations) {
    // Map to store unique stations based on their site_code
    const uniqueSitesMap = new Map();
    stations.forEach(station => {
        // Check if the site_code already exists in the Map
        if (!uniqueSitesMap.has(station.site_code)) {
            // If station is not added (unique station), add the current object to the Map
            uniqueSitesMap.set(station.site_code, { ...station, other_dataset_projects: [], other_dataset_names: [] });
        } else {
            // if the station is already there (not a unique station), we need to let know what else is tied with this station meta
            let temp = uniqueSitesMap.get(station.site_code);
            if (temp.dataset_project !== station.dataset_project) {
                // To ignore the same stations having same measurement type but different data frequencies.
                // Eg. Insitu-tower-daily and Insitu-tower-monthly are same. So dont count them as different measurement type.
                temp.other_dataset_projects.push(station.dataset_project);
                temp.other_dataset_names.push(station.dataset_name)
                let onlyUnique = (value, index, array) => array.indexOf(value) === index;
                temp.other_dataset_projects = temp.other_dataset_projects.filter(onlyUnique); //extra ensurity
                temp.other_dataset_names = temp.other_dataset_names.filter(onlyUnique); //extra ensurity
                uniqueSitesMap.set(station.site_code, { ...temp });
            }
        }
    });
    const uniqueSites = Array.from(uniqueSitesMap.values());
    return uniqueSites;
}