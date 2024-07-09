import { ALL, CONTINUOUS, FLASK, PFP, NON_CONTINIOUS, INSITU, SURFACE, TOWER, NRT } from "../../enumeration";
import { nrtStations } from "../../nrt/meta";
import { legendsDictionary } from "../meta";

/**
 * Retrieves legends based on the provided query parameters.
 * @param {Object} queryParams - The query parameters.
 * @param {string} queryParams.frequency - The frequency of measurements.
 * @param {string} queryParams.type - The type of measurement.
 * @param {string} queryParams.medium - The medium of measurement.
 * @returns {Object[]} An array of legend objects corresponding to the selected query parameters.
 */
export const getLegends = (queryParams) => {
    let { frequency, type, medium } = queryParams;

    // frequency can be empty. And
    /* frequency has the higher precedence/priority among other query params */
    if (frequency && frequency === ALL) {
        // add in continuous, non-continuous and all legends
        let nonContinuous = { ...legendsDictionary[NON_CONTINIOUS] };
        nonContinuous.text = "Non-Continuous Measurements";
        let all = { ...legendsDictionary[ALL] }; // also includes continuous
        all.text = "Continuous Measurements";
        let legends = [all, nonContinuous]
        return legends;
    }
    if (frequency && frequency === CONTINUOUS) {
        // add in insitu surface, insitu tower legends
        // and continuous legends: skip
        let continuous = { ...legendsDictionary[ALL] }; // also includes continuous
        continuous.text = "Continuous Measurements";
        let legends = [continuous];
        return legends;
    }
    if (frequency && frequency === NON_CONTINIOUS) {
        // add in flask surface, PFP surface and non-continuous legends
        let nonContinuous = { ...legendsDictionary[NON_CONTINIOUS] };
        nonContinuous.text = "Non-Continuous Measurements";
        let legends = [nonContinuous];
        return legends;
    }

    if (frequency) {
        return [];
    }

    /* When no frequency, compute the following */
    if (type === INSITU && medium === SURFACE) {
        // add in surface insitu legends
        let insituSurface = { ...legendsDictionary[INSITU][SURFACE] };
        let legend = [insituSurface];
        return legend;
    }

    if (type === INSITU && medium === TOWER) {
        // add in tower insitu legend
        let insituTower = { ...legendsDictionary[INSITU][TOWER] };
        let legend = [insituTower];
        return legend;
    }

    if (type === PFP && medium === SURFACE) {
        // add in surface insitu legend
        let pfpSurface = { ...legendsDictionary[PFP][SURFACE] };
        let legend = [ pfpSurface];
        return legend;
    }

    if (type === FLASK && medium === SURFACE) {
        // add in surface flask legend
        let flaskSurface = { ...legendsDictionary[FLASK][SURFACE] };
        let legend = [flaskSurface];
        return legend;
    }
    return [];
}

/**
 * Returns an array of legend objects (ref. legendsDictionary in meta) based on the provided query parameters.
 * In addition checks if there are NRT data available for the selected GHG, and if yes, adds NRT legend.
 *
 * @param {object} queryParams - The query parameters defining ghg.
 *
 * @returns {array} An array of legend objects.
 */
export const getLegendsWrapper = (queryParams) => {
    let legends = getLegends({ ...queryParams });
    // if (hasNRTdata(queryParams)) {
    //     let nrtLegend = { ...legendsDictionary[NRT] };
    //     legends.push(nrtLegend);
    // }
    return legends;
}

/**
 * Checks if the NRT data is available for the selected GHG (explained by the queryParam).
 *
 * @param {object} queryParams - The query parameters to check.
 * @returns {boolean} True if the query parameters contain NRT data, false otherwise.
 */
const hasNRTdata = (queryParams) => {
    // check if station and ghg has NRT data
    let { ghg } = queryParams;
    let ghgWithNRT = nrtStations.map(station => station.ghg);
    if ( ghgWithNRT.includes(ghg) ) {
        return true;
    }
    return false;
}