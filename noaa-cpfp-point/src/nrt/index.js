import { nrtStations } from './meta.js';
import { parseData, getStationIdx } from './helper';

const proxyServerURL = process.env.PROXY_SERVER_URL || "https://corsproxy.io";

/**
 * Resolves NRT (Near Real-Time) data for a given station.
 *
 * @param {object} station - Station information.
 * @param {object} station.site_code - Site code of the station.
 * @param {object} queryParams - Query parameters.
 * @param {string} queryParams.stationCode - The code of the query requested station.
 * @param {string} queryParams.ghg - The greenhouse gas (CO2 or CH4).
 * @param {string} queryParams.type - The type of data (insitu, flask, or pfp).
 * @param {string} queryParams.medium - The medium of measurement (tower or surface).
 * @param {string} queryParams.frequency - The frequency of measurement (continuous or non-continuous).

 * @param {array} data - Array of already resolved data.
 * @param {array} labels - Array of already resolved label.
 *
 * @returns {array} A tuple containing the updated `data` and `labels` arrays.
 * Note: If no NRT data, the function will return the original `data` and `labels` arrays.
 */
export async function nrtResolver(station, queryParams, data, labels) {
    const { site_code } = station;
    const { ghg } = queryParams;

    let nrtStationCodes = nrtStations.map(station => station.stationCode);
    if (!nrtStationCodes.includes(site_code)) {
        return [data, labels];
    }

    let stationIdx = getStationIdx(nrtStations, ghg, site_code);
    if (stationIdx === -1) {
        return [data, labels];
    }

    let stationMeta = nrtStations[stationIdx];

    let dataSource = stationMeta.source;
    let dataLabel = stationMeta.label;
    let frequency = stationMeta.frequency;
    try {
        let stationDataRaw = "";
        if (dataSource.includes("localhost")) {
            console.log(">>>>>>", dataSource)
            stationDataRaw = await fetch(dataSource);
        } else {
            stationDataRaw = await fetch(`${proxyServerURL}?${encodeURIComponent(dataSource)}`);
        }
        let stationDataText = await stationDataRaw.text();
        let stationDataJSON = parseData(stationDataText, frequency);
        data.push(stationDataJSON);
        labels.push(dataLabel);
        return [data, labels];
    } catch (err) {
        return [data, labels];
    }
}