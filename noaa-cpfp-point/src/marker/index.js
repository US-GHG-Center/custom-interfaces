import { ghgBlue, GHG, CO2, CONTINUOUS, NON_CONTINIOUS, TYPES, FLASK, PFP, INSITU, SURFACE, TOWER, ALL} from "../enumeration.js";


export const addMarker = (map, station, queryParams) => {
    const markerEl = document.createElement("div");
    // Style
    const markerStyle = getMarkerStyle(station, queryParams);
    markerEl.className = markerStyle;
    // Adding the marker to the map
    try {
        const marker = new mapboxgl.Marker(markerEl)
            .setLngLat([station.site_longitude, station.site_latitude])
            .addTo(map);
        // Create a tooltip or popup content for the marker
        const tooltipContent = getMarkerToolTipContent({...station});
        const popup = new mapboxgl.Popup().setHTML(tooltipContent);
        marker.setPopup(popup);
        marker.getElement().addEventListener("mouseenter", () => {
            popup.addTo(map);
        });
        marker.getElement().addEventListener("mouseleave", () => {
            popup.remove();
        });
        return marker;
    } catch (error) {
        throw new Error(error);
    }
}

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
 * Note: The color are selected to enable Semantic Inferencing. Its done on the following basis:
 *  The logical ordering of all the insrument data is done in the following way:
 *	|_ALL DATA :: use :: marker-gold
 *		|_continuous (collection):: use :: gradient color 2 :: use :: marker-pink-red
 *			|_pfp surface :: use :: marker-red
 *			|_flask surface :: use :: marker-pink
 *		|_non-continuous (collection):: use :: gradient color 2 :: use :: marker-blue-purple
 *			|_insitu surface :: use :: marker-blue
 *			|_insitu tower :: use :: marker-purple
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

    // frequency can be empty. And
    /* frequency has the higher precedence/priority among other query params */
    if (frequency && frequency === ALL) {
        // color flask surface and pfp surface as one
        if (other_dataset_projects.length > 0 && hasHeterogenousInstrumentTypes([...other_dataset_projects, dataset_project])) { // and heterogenous collection
            let className = "marker marker-gold";
            return className;
        }
        // if homogenous group them inside one
        if (dataset_project.includes("flask") || dataset_project.includes("pfp")) {
            let className = "marker marker-pink-red";
            return className;
        }
        // color insitu surface and tower as one
        if (dataset_project === "tower-insitu" || dataset_project === "surface-insitu") {
            let className = "marker marker-blue-purple";
            return className;
        }
    }
    if (frequency && frequency === CONTINUOUS) {
        // selected insitu tower and surface
        // color surface insitu and tower insitu differently
        if (other_dataset_projects.length > 0) {
            let className = "marker marker-purple-blue";
            return className;
        }
        if (dataset_project.includes("tower")) {
            let className = "marker marker-purple";
            return className;
        }
        if (dataset_project.includes("surface")) {
            let className = "marker marker-blue";
            return className;
        }
    }
    if (frequency && frequency === NON_CONTINIOUS) {
        // selected flask surface and pfp surface
        if (other_dataset_projects.length > 0) {
            let className = "marker marker-pink-red";
            return className;
        }
        if (dataset_project.includes("flask")) {
            let className = "marker marker-pink";
            return className;
        }
        if (dataset_project.includes("pfp")) {
            let className = "marker marker-red";
            return className;
        }
    }

    /* When no frequency, compute the following */
    if (type === INSITU && medium === SURFACE) {
        // return insitu surface
        let className = "marker marker-blue";
        return className;
    }

    if (type === INSITU && medium === TOWER) {
        // return insitu tower
        let className = "marker marker-purple";
        return className;
    }

    if (type === PFP && medium === SURFACE) {
        // return pfp surface
        let className = "marker marker-red";
        return className;
    }

    if (type === FLASK && medium === SURFACE) {
        // return flask surface
        let className = "marker marker-pink";
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