import { ALL, CONTINUOUS, FLASK, PFP, NON_CONTINIOUS, INSITU, SURFACE, TOWER } from "../../enumeration";

const legendsDictionary = {
    [CONTINUOUS]: {
        color: "blue-purple",
        imageClass: "marker marker-blue-purple",
        text: "Surface and Tower In-situ"
    },
    [NON_CONTINIOUS]: {
        color: "pink-red",
        imageClass: "marker marker-pink-red",
        text: "Flask and PFP"
    },
    [ALL]: {
        color: "gold",
        imageClass: "marker marker-gold",
        text: "Flask, PFP and In-situ"
    },
    [FLASK]: {
        [SURFACE]: {
            color: "pink",
            imageClass: "marker marker-pink",
            text: "Flask"
        }
    },
    [PFP]: {
        [SURFACE]: {
            color: "red",
            imageClass: "marker marker-red",
            text: "PFP"
        }
    },
    [INSITU]: {
        [SURFACE]: {
            color: "blue",
            imageClass: "marker marker-blue",
            text: "Surface In-situ"
        },
        [TOWER]: {
            color: "purple",
            imageClass: "marker marker-purple",
            text: "Tower In-situ"
        }
    }
};

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
        // let continuous = { ...legendsDictionary[CONTINUOUS] };
        // continuous.text = "Continuous Measurements (Surface and Tower In-situ)";
        let nonContinuous = { ...legendsDictionary[NON_CONTINIOUS] };
        nonContinuous.text = "Non-Continuous Measurements (Flask and PFP)";
        let all = { ...legendsDictionary[ALL] };
        all.text = "Mixed Measurements (Flask, PFP and In-situ)";
        let legends = [nonContinuous, all]
        return legends;
    }
    if (frequency && frequency === CONTINUOUS) {
        // add in insitu surface, insitu tower legends
        // and continuous legends: skip
        let insituSurface = { ...legendsDictionary[INSITU][SURFACE] };
        let insituTower = { ...legendsDictionary[INSITU][TOWER] };
        let legends = [insituSurface, insituTower];
        return legends;
    }
    if (frequency && frequency === NON_CONTINIOUS) {
        // add in flask surface, PFP surface and non-continuous legends
        let flaskSurface = { ...legendsDictionary[FLASK][SURFACE] };
        let pfpSurface = { ...legendsDictionary[PFP][SURFACE] };
        let nonContinuous = { ...legendsDictionary[NON_CONTINIOUS] };
        let legends = [flaskSurface, pfpSurface, nonContinuous];
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