import stations_data from "../../stations";
import { TYPES, GHG} from "../enumeration.js";
import { instrumentsMapGraphs } from "./instrumentsMapGraphs";

let publicUrl = process.env.PUBLIC_URL;

/**
 * Retrieves station meta data based on the specified parameters. Similar to fetching data from a database.
 * Here, as a static site application, stations_data in station.js can be considered as a database.
 * 
 * @param {string} [ghg="ch4"] - The greenhouse gas (GHG) type. Default is "ch4".
 * @param {string} [type="flask"] - The type of station. Default is "flask".
 * @param {string} [medium="surface"] - The medium from which the data is collected. Default is "surface".
 * @returns {Array} - The stations data corresponding to the provided parameters.
 * @throws {Error} - If station data is not available for the specified parameters.
 */
export function getStationsMeta(ghg="ch4", type="flask", medium="surface") {
    try {
        let stations = [];
        if (type == "insitu" & medium == "surface-tower") {
            /**
             * To show both surface and tower insitu, filter out unique one based of station_name (site_code)
             * also plant in medium value to do so.
            **/
            let surfaceStations = stations_data[ghg][type]["surface"].map(data => ({...data, medium: "surface"}));
            let towerStations = stations_data[ghg][type]["tower"].map(data => ({...data, medium: "tower"}));
            stations = getUniqueStations([...surfaceStations, ...towerStations]);
        } else if (type == "insitu") {
            /**
             * For a single station and a medium, there are daily, hourly and monthly
             * We can't plot them all. So, filter out unique one, based of station_name (site_code)
            **/
            stations = stations_data[ghg][type][medium];
            stations = getUniqueStations(stations);
        } else if (type == "flask-pfp" & medium == "surface") {
            /**
             * To show both flask and pfp, filter out unique one based of station_name (site_code)
             * also plant in type value to do so.
            **/
            let flaskStations = stations_data[ghg]["flask"][medium].map(data => ({...data, type: "flask"}));;
            let pfpStations = stations_data[ghg]["pfp"][medium].map(data => ({...data, type: "pfp"}));
            stations = getUniqueStations([...flaskStations, ...pfpStations]);
        } else {
            stations = stations_data[ghg][type][medium];
        }
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
 * publicUrl is the base URL of the server hosting the data files.
 * @returns {Array[string]} - The constructed URLs for fetching the station datas.
 */
export function constructStationDataSourceUrls(ghg="ch4", type="flask", medium="surface", datasetName) {
    let selectedFiles = [];
    if (type=="insitu" & medium=="surface-tower"){
        let graphsdatasrc = instrumentsMapGraphs(ghg, type, "surface", datasetName);
        let selectedFileSurface = graphsdatasrc["insitu"].map((graph => graph.dataSource));

        graphsdatasrc = instrumentsMapGraphs(ghg, type, "tower", datasetName);
        let selectedFileTower = graphsdatasrc["insitu"].map((graph => graph.dataSource));

        selectedFiles = [...selectedFileSurface, ...selectedFileTower]
    } else if (type=="insitu") {
        let graphsdatasrc = instrumentsMapGraphs(ghg, type, medium, datasetName);
        selectedFiles = graphsdatasrc["insitu"].map((graph => graph.dataSource));
    } else if (type=="flask-pfp") {
        let selectedFile = `${publicUrl ? publicUrl : ""}/data/raw/${ghg}/flask/${medium}/${datasetName}.txt`;
        selectedFiles.push(selectedFile);

        selectedFile = `${publicUrl ? publicUrl : ""}/data/raw/${ghg}/pfp/${medium}/${datasetName}.txt`;
        selectedFiles.push(selectedFile);
    } else {
        let selectedFile = `${publicUrl ? publicUrl : ""}/data/raw/${ghg}/${type}/${medium}/${datasetName}.txt`;
        selectedFiles.push(selectedFile);
    }
    return selectedFiles;
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
    const dataSourceQueryParams = `?type=${TYPES[type].long.replace(" ", "%2B")}&frequency=Discrete&site=${siteCode}&amp;parameter_name=${GHG[ghg].long.replace(" ", "%2B")}`
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

function getUniqueStations(stations) {
    // Map to store unique stations based on their site_code
    const uniqueSitesMap = new Map();
    stations.forEach(station => {
        // Check if the site_code already exists in the Map
        if (!uniqueSitesMap.has(station.site_code)) {
            // If not, add the current object to the Map
            uniqueSitesMap.set(station.site_code, station);
        }
    });
    const uniqueSites = Array.from(uniqueSitesMap.values());
    return uniqueSites;
}