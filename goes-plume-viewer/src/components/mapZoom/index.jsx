import { useEffect } from "react";

import { useMapbox } from "../../context/mapContext";

export const MapZoom = ({ zoomLocation }) => {
    const { map } = useMapbox();

    useEffect(() => {
        if (!map || !zoomLocation.length) return;

        const [lon, lat] = zoomLocation;
        map.flyTo({
            center: [lon, lat], // Replace with the desired latitude and longitude
            offset: [-250, 0],
            zoom: 8.5,
        });

    }, [map, zoomLocation]);

    return null;
}
