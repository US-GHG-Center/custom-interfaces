import stations_data from "../../stations";
import { TYPES, GHG} from '../enumeration.js';

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
        let stations = stations_data[ghg][type][medium];
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
 * @returns {string} - The constructed URL for fetching the station data.
 */
export function constructStationDataSourceUrl(ghg="ch4", type="flask", medium="surface", datasetName) {
    const selectedFile = `${publicUrl ? publicUrl : ""}/data/raw/${ghg}/${type}/${medium}/${datasetName}.txt`;
    return selectedFile;
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
 * Asynchronously fetches station data from the specified URL.
 * 
 * @param {string} url - The URL from which to fetch the station data.
 * @returns {Promise<Response>} - A Promise that resolves with the fetched data,
 *                                 or rejects with an error if the URL is invalid.
 * @throws {Error} - If the URL is invalid.
 */
export async function getStationData(url) {
    // fetch data from the hosted path and then returns it. 
    try {
        let data = await fetch(url);
        return data;
    } catch (err) {
        console.log("Invalid file path");
        return new Error("Invalid file path");
    }
}
