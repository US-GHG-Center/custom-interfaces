import { nrtStations } from './meta.js';
import { parseData, getStationIdxs } from './helper';
import { openNotice } from '../notice';

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
export async function nrtResolver(station, queryParams, data, labels, chartColors) {
    const { site_code } = station;
    const { ghg } = queryParams;

    let nrtStationCodes = nrtStations.map(station => station.stationCode);
    if (!nrtStationCodes.includes(site_code)) {
        return [data, labels, chartColors];
    }

    let stationIdxs = getStationIdxs(nrtStations, ghg, site_code);
    if (stationIdxs.length === 0) {
        return [data, labels, chartColors];
    }

    let notices = [];

    for await (const stationIdx of stationIdxs) {
        let stationMeta = nrtStations[stationIdx];

        let dataLabel = stationMeta.label;
        let frequency = stationMeta.frequency;
        let skipProxy = stationMeta.skipProxy;
        let dataSource = skipProxy ? stationMeta.source : `${proxyServerURL}?${encodeURIComponent(stationMeta.source)}`;
        try {
            let stationDataRaw = await fetch(dataSource);
            let stationDataText = await stationDataRaw.text();
            let stationDataJSON = parseData(stationDataText, frequency);
            data.push(stationDataJSON);
            labels.push(dataLabel);
            chartColors.push(stationMeta.chartColor);
            if (stationMeta.notice) {
                notices.push(stationMeta.notice);
            }
        } catch (err) {
            return [data, labels, chartColors];
        }
    }

    return [data, labels, chartColors, notices];
}