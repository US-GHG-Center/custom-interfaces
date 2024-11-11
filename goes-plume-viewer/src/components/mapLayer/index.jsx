import { useEffect } from "react";
import { useMapbox } from "../../context/mapContext";
import { addSourceLayerToMap, getSourceId, getLayerId, layerExists, sourceExists } from "../../utils";

export const MapLayer = ({ plume }) => {
    const { map } = useMapbox();

    useEffect(() => {
        if (!map || !plume) return;

        const feature = plume.data;
        // first one is the representing tiff among subdaily
        const sourceId = getSourceId(0);
        const layerId = getLayerId(0);
        addSourceLayerToMap(map, feature, sourceId, layerId);
        map.setLayoutProperty(layerId, 'visibility', 'visible');

        return () => {
            // cleanups
            if (map) {
                if (layerExists(map, layerId)) map.removeLayer(layerId);
                if (sourceExists(map, sourceId)) map.removeSource(sourceId);
            }
        }
    }, [plume, map]);

    return null;
}
