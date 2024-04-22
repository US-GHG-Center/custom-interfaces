import { getLegends } from "./helper";

/**
 * Draws legends for the markers based on the provided query parameters.
 * @param {Object} queryParams - The query parameters.
 * @param {string} queryParams.frequency - The frequency of measurements.
 * @param {string} queryParams.type - The type of measurement.
 * @param {string} queryParams.medium - The medium of measurement.
 * @returns {void}
 */
export const drawLegend = (queryParams) => {
    let legends = getLegends({ ...queryParams });

    if (legends && legends.length == 0) {
        let legendContainer = document.getElementById("legend-container");
        legendContainer.style.display = "none";
        return
    }

    let legendsDOMString = `<div id="legend-head">Legends</div>
                            <div id="legend-line"></div>`;
    legends.forEach( legend => {
        let { text, imageClass } = legend;
        let elem = `
            <div class="legend-element">
                <div class="${imageClass}"></div>
                <span class="legend-text">${text}<span>
            </div>
        `;
        legendsDOMString += elem;
    });
    let legend = document.getElementById("legend");
    legend.innerHTML = legendsDOMString;
}