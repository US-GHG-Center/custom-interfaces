import { ghgBlue } from "../enumeration";

export const addMarker = (map, station) => {
    const markerEl = document.createElement("div");
    // Style
    const markerStyle = getMarkerStyle(station);
    markerEl.className = markerStyle;
    // Adding the marker to the map
    try {
        const marker = new mapboxgl.Marker(markerEl)
            .setLngLat([station.site_longitude, station.site_latitude])
            .addTo(map);
        // Create a tooltip or popup content for the marker
        const tooltipContent = getMarkerToolTipContent(station);
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
    return `<strong style="color: ${ghgBlue}">${station.site_code} : ${station.site_name}</strong><br>
            <strong> ${station.site_country} </strong><br>
            Latitude: ${station.site_latitude}<br>
            Longitude: ${station.site_longitude}<br>
            Elevation: ${station.site_elevation} ${station.site_elevation_unit}
            `;
}

export const getMarkerStyle = (station) => {
    let className = "";
    // styling the marker
    if (station.dataset_name.includes("tower")) {
        className = "marker-tower";
    } else if (station.dataset_name.includes("flask")) {
        className = "marker-gold";
    } else {
        className = "marker";
    }
    return className;
}