import { ghgBlue, GHG, MEDIUM, TYPES, CONTINUOUS, NON_CONTINIOUS, ALL } from "../enumeration";

/**
 * Draws the title for the NOAA ESRL Global Monitoring Laboratory based on the provided query parameters.
 * @param {Object} queryParams - The query parameters.
 * @param {string} queryParams.ghg - The type of greenhouse gas.
 * @param {string} queryParams.frequency - The frequency of measurements.
 * @param {string} queryParams.type - The type of measurement.
 * @param {string} queryParams.medium - The medium of measurement.
 * @returns {void}
 */
export const drawTitle = (queryParams) => {
    let {ghg, frequency, type, medium} = queryParams;

    try {
        // Add title of the NOAA according to the query params
        const titleContainer = document.getElementById("title");
        let title = `<strong> NOAA: ESRL Global Monitoring Laboratory: ${
            GHG[ghg].long
            }`;
        if (frequency && frequency == CONTINUOUS) {
            title += " Continuous Measurements (Surface and Tower In-Situ) </strong>";
        } else if (frequency && frequency == NON_CONTINIOUS) {
            title += " Non-Continuous Measurements (Flask and PFP)  </strong>"
        } else if (frequency && frequency == ALL) {
            // pass
            title += " Concentration Measurements</strong>";
        } else {
            title += ` (${MEDIUM[medium].long}-${TYPES[type].long}) </strong>`;
        }
        titleContainer.innerHTML = title;
        // style
        titleContainer.style.display = "block";
        titleContainer.style.color = ghgBlue;
    } catch (e) {
        // console.log(e);
    }
}