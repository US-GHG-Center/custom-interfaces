import { ghgBlue, GHG, CO2, CONTINUOUS, NON_CONTINIOUS, TYPES, FLASK, PFP, INSITU, SURFACE, TOWER, ALL, NRT} from "../enumeration.js";
import { nrtStations } from "../nrt/meta.js";
import { getStationIdx } from "../nrt/helper";
import { legendsDictionary } from "./meta.js";

/**
 * Generates tooltip content for a marker representing a station.
 * @param {Object} station - The station object containing information about the station.
 * @param {string} station.site_code - The code of the station.
 * @param {string} station.site_name - The name of the station.
 * @param {string} station.site_country - The country where the station is located.
 * @param {number} station.site_latitude - The latitude of the station.
 * @param {number} station.site_longitude - The longitude of the station.
 * @param {number} station.site_elevation - The elevation of the station.
 * @param {string} station.site_elevation_unit - The unit of elevation (e.g., meters).
 * @param {string} station.dataset_project - The project type of the dataset.
 * @param {string[]} station.other_dataset_projects - Other project types associated with the dataset.
 * @returns {string} The HTML content for the marker tooltip.
 */
export const getMarkerToolTipContent = (station) => {
    let { site_code, site_name, site_country, site_latitude, site_longitude, site_elevation, site_elevation_unit, dataset_project, other_dataset_projects } = station;
    if (other_dataset_projects.length > 0) {
        let measurementType = dataset_project;
        other_dataset_projects.forEach(project_type => {
            measurementType += " & " + project_type
        });
        dataset_project = measurementType;
    }

    return `<strong style="color: ${ghgBlue}">${site_code} : ${site_name}</strong><br>
            <strong> ${site_country} </strong><br>
            Latitude: ${site_latitude}<br>
            Longitude: ${site_longitude}<br>
            Elevation: ${site_elevation} ${site_elevation_unit}<br>
            Measurement Type: ${dataset_project}
            `;
}

/**
 * Determines the marker style for a station based on the provided query parameters and station metadata.
 * 
 * This function calculates the appropriate marker style for a station marker on the map, based on the
 * provided query parameters (ghg, frequency, type, medium) and the metadata of the station. It takes into
 * account various conditions and criteria to determine the marker style.
 * 
 * Note: Put thing that is priority comparision in the top.
 *
 * @param {Object} station - The metadata of the station.
 * @param {string} station.dataset_project - The project (<medium>_<type>) from which dataset was collected.
 * @param {Object} queryParams - An object containing query parameters.
 * @param {string} [queryParams.ghg] - The greenhouse gas (CO2 or CH4).
 * @param {string} [queryParams.frequency] - The frequency of measurement (continuous or non-continuous).
 * @param {string} [queryParams.type] - The type of data (insitu, flask, or pfp).
 * @param {string} [queryParams.medium] - The medium of measurement (tower or surface).
 * @returns {string} The CSS class name representing the marker style.
 */
export const getMarkerStyle = (station, queryParams) => {
    let {ghg, frequency, type, medium} = queryParams;
    let { dataset_project, other_dataset_projects } = station;

    // let nrtMarker = getNRTMarker(station, queryParams);
    // if (!(nrtMarker === null)) {
    //     return nrtMarker;
    // }

    let continuousMarkerClassName = legendsDictionary[CONTINUOUS].className;
    let nonContinuousMarkerClassName = legendsDictionary[NON_CONTINIOUS].className;

    // frequency can be empty. And
    /* frequency has the higher precedence/priority among other query params */
    if (frequency && frequency === ALL) {
        // color flask surface and pfp surface as one
        if (other_dataset_projects.length > 0 && hasHeterogenousInstrumentTypes([...other_dataset_projects, dataset_project])) { // and heterogenous collection
            let className = continuousMarkerClassName; // continuous color
            return className;
        }
        // if homogenous group them inside one
        if (dataset_project.includes("flask") || dataset_project.includes("pfp")) {
            let className = nonContinuousMarkerClassName; // non-continuous color
            return className;
        }
        // color insitu surface and tower as one
        if (dataset_project === "tower-insitu" || dataset_project === "surface-insitu") {
            let className = continuousMarkerClassName;
            return className;
        }
    }
    if (frequency && frequency === CONTINUOUS) {
        // selected insitu tower and surface
        // color surface insitu and tower insitu differently
        return continuousMarkerClassName;
    }
    if (frequency && frequency === NON_CONTINIOUS) {
        // selected flask surface and pfp surface
        return nonContinuousMarkerClassName;
    }

    /* When no frequency, compute the following */
    if (type === INSITU && medium === SURFACE) {
        // return insitu surface
        let className = legendsDictionary[INSITU][SURFACE].className;
        return className;
    }

    if (type === INSITU && medium === TOWER) {
        // return insitu tower
        let className = legendsDictionary[INSITU][TOWER].className;
        return className;
    }

    if (type === PFP && medium === SURFACE) {
        // return pfp surface
        // let className = "marker marker-red";
        let className = legendsDictionary[PFP][SURFACE].className;
        return className;
    }

    if (type === FLASK && medium === SURFACE) {
        // return flask surface
        let className = legendsDictionary[FLASK][SURFACE].className;
        return className;
    }

    let className = "marker";
    return className;
}


/**
 * Checks if the instrument types represented by a list of dataset projects are homogenous.
 * Dataset projects represent the project (<medium>-<type>) from which the dataset was collected.
 *
 * @param {string[]} other_dataset_projects - Array of dataset project strings to be checked for homogeneity.
 * @returns {boolean} - True if the instrument types are heterogenous, false otherwise.
 *
 * @description
 * Possible values of dataset projects are:
 * - surface-insitu
 * - tower-insitu
 * - surface-flask
 * - surface-pfp
 *
 * In this context:
 * - surface-insitu and tower-insitu are considered of the same continuous (data collection frequency) category.
 * - surface-pfp and tower-pfp are considered of the same non-continuous (data collection frequency) category.
 *
 * Note: Only applicable while showing all stations. i.e. To confirm if a golden marker is needed to represent heterogenous data.
 * Because no other measurement frequency will have heterogenous category encounters. (Only multiple homogenous category encounter are possible)
 * Example: Say, if we want to only show non-continuous measurement and say some station has both the pfp and flask.
 * Then a color mix representing both pfp and flask can be used to represent the station.
 * In this example, no heterogenous check is needed.
 */
const hasHeterogenousInstrumentTypes = (other_dataset_projects) => {
    let isHeterogenous = null;
    let hashmap = new Map();
    other_dataset_projects.forEach(datasetProject => {
        // if value not available, add to the map/dict
        let category = "";
        if (datasetProject === "surface-insitu" || datasetProject === "tower-insitu") {
            category = "continuous";
        } else {
            category = "nonContinuous";
        }
        if (!hashmap.has(category)) {
            hashmap.set(category, 1);
        } else {
            let temp = hashmap.get(category);
            hashmap.set(category, temp+1);
        }
    });
    let categories = [...hashmap.keys()];
    if (categories.length === 1) {
        isHeterogenous = false;
    } else {
        isHeterogenous = true;
    }
    return isHeterogenous;
}

const getNRTMarker = (station, queryParams) => {
    // The NRT data marker style has highest priority check before all others
    let { ghg } = queryParams;
    const { site_code: siteCode } = station;

    // check if station and ghg has NRT data
    let stationIdx = getStationIdx(nrtStations, ghg, siteCode);
    if (stationIdx === -1) {
        return null;
    }
    // if yes, return the marker style for NRT data
    let NRTMarkerClassName = legendsDictionary[NRT].className;
    return NRTMarkerClassName;
};