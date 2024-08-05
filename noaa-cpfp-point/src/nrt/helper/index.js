import { YearlyDataPreprocessor, MonthlyDataPreprocessor, DailyDataPreprocessor, CustomMKODataPreprocessor, CustomNRTMLODataPreprocessor } from "../dataPreprocessor";

/**
 * Parses the given CSV data and returns a visualization JSON object based on the specified data
frequency.
 *
 * @param {string} csvdata - The text (CSV) data to parse.
 * @param {string} frequency - The frequency at which the data was recorded ("yearly", "monthly",
or "daily").
 * @returns {Array<Object>} A array of visualization JSON object representing the parsed data.
 * example: [{ date: date1, value: value1 }, { date: date2, value: value2}, ...]
 */
export function parseData(csvdata, frequency) {
    let dp;
    if (frequency.toLowerCase() === "yearly") {
        dp = new YearlyDataPreprocessor(csvdata);
    } else if (frequency.toLowerCase() === "monthly") {
        dp = new MonthlyDataPreprocessor(csvdata);
    } else if (frequency.toLowerCase() === "daily") {
        dp = new DailyDataPreprocessor(csvdata);
    } else if (frequency.toLowerCase() === "customNRTMLO".toLowerCase()) {
        dp = new CustomNRTMLODataPreprocessor(csvdata);
    } else if (frequency.toLowerCase() === "customMKO".toLowerCase()) {
        // to handle mko station data inside mlo station
        dp = new CustomMKODataPreprocessor(csvdata);
    }
    let vizJSON = dp.getVizJSON();
    return vizJSON;
}

/**
 * Returns the index of a station in the `stations` array that matches the given `site_code` and
`ghg`.
 *
 * @param {Array<Station>} stations - The list of stations to search.
 * @param {string} ghg - The Greenhouse Gas code to match.
 * @param {string} site_code - The site code to match.
 * @returns {number} The index of the matching station, or -1 if no match is found.
 */
export function getStationIdx(stations, ghg, site_code) {
    for (let i=0; i < stations.length; i++) {
        if (stations[i].stationCode.toLowerCase() === site_code.toLowerCase() && stations[i].ghg.toLowerCase() === ghg.toLowerCase()) {
            return i;
        }
    }
    return -1;
}

/**
 * Returns the index of a station in the `stations` array that matches the given `site_code` and
`ghg` and from which source is to be used as data access url.
 *
 * @param {Array<Station>} stations - The list of stations to search.
 * @param {string} ghg - The Greenhouse Gas code to match.
 * @param {string} site_code - The site code to match.
 * @returns {number} The index of the matching station, or -1 if no match is found.
 */
export function getDataAccessStationIdx(stations, ghg, site_code) {
    for (let i=0; i < stations.length; i++) {
        if (stations[i].stationCode.toLowerCase() === site_code.toLowerCase() && stations[i].ghg.toLowerCase() === ghg.toLowerCase() && stations[i].useAsDataAccess) {
            return i;
        }
    }
    return -1;
}

/**
 * Returns the index of a station in the `stations` array that matches the given `site_code` and
`ghg`.
 *
 * @param {Array<Station>} stations - The list of stations to search.
 * @param {string} ghg - The Greenhouse Gas code to match.
 * @param {string} site_code - The site code to match.
 * @returns {number} The array of index of the matching station, or empty [] if no match is found.
 */
export function getStationIdxs(stations, ghg, site_code) {
    let idxs = [];
    for (let i=0; i < stations.length; i++) {
        if (stations[i].stationCode.toLowerCase() === site_code.toLowerCase() && stations[i].ghg.toLowerCase() === ghg.toLowerCase()) {
            idxs.push(i);
        }
    }
    return idxs;
}