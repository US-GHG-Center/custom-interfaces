import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useMapbox } from "../../context/mapContext";
import { addSourceLayerToMap, addSourcePolygonToMap, getSourceId, getLayerId, layerExists, sourceExists } from "../../utils";

export const MapLayer = ({ plume, handleLayerClick, plumeId }) => {
    const { map } = useMapbox();

    useEffect(() => {
        if (!map || !plume) return;

        const feature = plume;
        const id = uuidv4();
        const rasterSourceId = getSourceId(id);
        const rasterLayerId = getLayerId(id);
        const polygonSourceId = getSourceId("polygon"+id);
        const polygonLayerId = getLayerId("polygon"+id);

        addSourceLayerToMap(map, feature, rasterSourceId, rasterLayerId);
        addSourcePolygonToMap(map, feature, polygonSourceId, polygonLayerId);

        const onClickHandler = (e) => {
            handleLayerClick(plumeId);
        }
        map.setLayoutProperty(rasterLayerId, 'visibility', 'visible');
        map.on("click", polygonLayerId, onClickHandler);

        return () => {
            // cleanups
            if (map) {
                if (layerExists(map, rasterLayerId)) map.removeLayer(rasterLayerId);
                if (sourceExists(map, rasterSourceId)) map.removeSource(rasterSourceId);
                if (layerExists(map, polygonLayerId)) map.removeLayer(polygonLayerId);
                if (sourceExists(map, polygonSourceId)) map.removeSource(polygonSourceId);
                map.off("click", "clusters", onClickHandler);
            }
        }
    }, [plume, map, handleLayerClick, plumeId]);

    return null;
}


export const MapLayers = ({ plumes, handleLayerClick }) => {
    const { map } = useMapbox();
    if (!map || !plumes.length) return;

    return (<>
        {plumes && plumes.length && plumes.map((plume) => <MapLayer key={plume.id} plumeId={plume.id} plume={plume.representationalPlume} handleLayerClick={handleLayerClick}></MapLayer>)}
        </>
    );
}