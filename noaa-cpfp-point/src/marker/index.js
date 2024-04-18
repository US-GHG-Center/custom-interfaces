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
    let { site_code, site_name, site_country, site_latitude, site_longitude, site_elevation, site_elevation_unit, dataset_project, other_dataset_project } = station;
    if (other_dataset_project.length > 0) {
        let measurementType = dataset_project;
        other_dataset_project.forEach(project_type => {
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
    let { dataset_project, other_dataset_project } = station;

    if (other_dataset_project.length > 0) {
        let className = "marker";
        return className;
    }

    // frequency can be empty. And
    /* frequency has the higher precedence/priority among other query params */
    if (frequency && frequency === CONTINUOUS) {
        // selected insitu tower and surface
        // color surface insitu and tower insitu differently
        if (dataset_project.includes("tower")) {
            let className = "marker-tower";
            return className;
        }
        if (dataset_project.includes("surface")) {
            let className = "marker-gold";
            return className;
        }
    }
    if (frequency && frequency === NON_CONTINIOUS) {
        // selected flask surface and pfp surface
        if (dataset_project.includes("flask")) {
            let className = "marker-tower";
            return className;
        }
        if (dataset_project.includes("pfp")) {
            let className = "marker-gold";
            return className;
        }
    }
    if (frequency && frequency === ALL) {
        // color flask surface and pfp surface as one
        if (dataset_project.includes("flask") || dataset_project.includes("pfp")) {
            let className = "marker-gold";
            return className;
        }
        // color insitu surface and tower as one
        if (dataset_project === "tower-insitu" || dataset_project === "surface-insitu") {
            let className = "marker-tower";
            return className;
        }
        // TODO: add for overlapping ones as well.
    }

    /* When no frequency, compute the following */
    if (type === INSITU && medium === SURFACE) {
        // return insitu surface
        let className = "marker-gold";
        return className;
    }

    if (type === INSITU && medium === TOWER) {
        // return insitu tower
        let className = "marker-tower";
        return className;
    }

    if (type === PFP && medium === SURFACE) {
        // return pfp surface
        let className = "marker-gold";
        return className;
    }

    if (type === FLASK && medium === SURFACE) {
        // return flask surface
        let className = "marker-gold";
        return className;
    }

    let className = "marker";
    return className;
}