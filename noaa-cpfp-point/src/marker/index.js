import { getMarkerToolTipContent, getMarkerStyle } from "./helper.js";

/**
 * Adds a marker to the map representing a station.
 * @param {mapboxgl.Map} map - The map to which the marker will be added.
 * @param {Object} station - The station object containing information about the station.
 * @param {string} station.site_code - The code of the station.
 * @param {string} station.site_name - The name of the station.
 * @param {string} station.site_country - The country where the station is located.
 * @param {number} station.site_latitude - The latitude of the station.
 * @param {number} station.site_longitude - The longitude of the station.
 * @param {number} station.site_elevation - The elevation of the station.
 * @param {string} station.site_elevation_unit - The unit of elevation (e.g., meters).
 * @param {string} station.dataset_project - The project type of the dataset.
 * @param {string[]} station.other_dataset_projects - Other project types associated with the dataset. Custom created
 * @param {Object} queryParams - The query parameters.
 * @param {string} queryParams.ghg - The type of greenhouse gas.
 * @param {string} queryParams.frequency - The frequency of measurements.
 * @param {string} queryParams.type - The type of measurement.
 * @param {string} queryParams.medium - The medium of measurement.
 * @returns {mapboxgl.Marker} The marker object representing the station on the map.
 * @throws {Error} If an error occurs while adding the marker to the map.
 */
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
