import { getMarkerToolTipContent, getMarkerStyle } from "./helper.js";

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
