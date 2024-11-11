import { useEffect } from "react";

import { useMapbox } from "../../context/mapContext";

export const MapZoom = ({ zoomLevel }) => {
    const { map } = useMapbox();

    useEffect(() => {
        if (!map || !zoomLevel.length) return;

        const [lon, lat] = zoomLevel;
        map.flyTo({
            center: [lon, lat], // Replace with the desired latitude and longitude
            offset: [-250, 0],
            zoom: 7.5,
        });

    }, [map, zoomLevel]);

    return null;
}