import { ghgBlue, GHG, MEDIUM, TYPES, CONTINUOUS, NON_CONTINIOUS, ALL } from "../enumeration";

export const drawTitle = (queryParams) => {
    let {ghg, frequency, type, medium} = queryParams;

    // Add title of the NOAA according to the query params
    const titleContainer = document.getElementById("title");
    let title = `<strong> NOAA: ESRL Global Monitoring Laboratory: ${
        GHG[ghg].long
        }`;
    if (frequency && frequency == CONTINUOUS) {
        title += " Continuous Measurements (Surface In-Situ and Tower) </strong>";
    } else if (frequency && frequency == NON_CONTINIOUS) {
        title += " Non-Continuous Measurements (Flask and PFP)  </strong>"
    } else if (frequency && frequency == ALL) {
        // pass
        title +=  " Concentration Measurements</strong>";
    } else {
        title += ` (${MEDIUM[medium].long}-${TYPES[type].long}) </strong>`;
    }
    titleContainer.innerHTML = title;
    // style
    titleContainer.style.display = "block";
    titleContainer.style.color = ghgBlue;    
}