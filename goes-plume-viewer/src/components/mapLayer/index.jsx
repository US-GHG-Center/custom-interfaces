import { useEffect } from "react";
import { useMapbox } from "../../context/mapContext";
import { addSourceLayerToMap, addSourcePolygonToMap, getSourceId, getLayerId, layerExists, sourceExists } from "../../utils";

export const MapLayer = ({ plume, handleLayerClick, plumeId, hoveredPlumeId, setHoveredPlumeId }) => {
    const { map } = useMapbox();

    useEffect(() => {
        if (!map || !plume) return;

        const feature = plume;
        const rasterSourceId = getSourceId("raster"+plumeId);
        const rasterLayerId = getLayerId("raster"+plumeId);
        const polygonSourceId = getSourceId("polygon"+plumeId);
        const polygonLayerId = getLayerId("polygon"+plumeId);

        addSourceLayerToMap(map, feature, rasterSourceId, rasterLayerId);
        addSourcePolygonToMap(map, feature, polygonSourceId, polygonLayerId);

        const onClickHandler = (e) => {
            handleLayerClick(plumeId);
        }

        const onHoverHandler = (e) => {
            setHoveredPlumeId(plumeId);
        }

        map.setLayoutProperty(rasterLayerId, 'visibility', 'visible');
        map.on("click", polygonLayerId, onClickHandler);
        map.on("mousemove", polygonLayerId, onHoverHandler);

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
    }, [plume, map, handleLayerClick, plumeId, setHoveredPlumeId]);

    useEffect(() => {
        if (!map || !hoveredPlumeId || !plumeId ) return;

        const polygonLayerId = getLayerId("polygon"+plumeId);
        const rasterLayerId = getLayerId("raster"+plumeId);

        if (hoveredPlumeId !== plumeId) {
            // when the plume is not hovered
            if (layerExists(map, polygonLayerId)) {
                map.setPaintProperty(polygonLayerId, 'fill-outline-color', '#20B2AA');
            }
            if (layerExists(map, rasterLayerId)) {
                map.setLayoutProperty(rasterLayerId, 'visibility', 'none');
            }
        }

        if (hoveredPlumeId === plumeId) {
            // when the plume is hovered
            if (layerExists(map, rasterLayerId)) {
                map.moveLayer(rasterLayerId);
            }
            if (layerExists(map, polygonLayerId)) {
                map.setPaintProperty(polygonLayerId, 'fill-outline-color', '#0000ff');
            }
        }
    }, [hoveredPlumeId, map, plumeId]);

    // console.log("layers>", map.getStyle().layers)

    return null;
}


export const MapLayers = ({ plumes, hoveredPlumeId, showPlumeLayers, handleLayerClick, setHoveredPlumeId }) => {
    const { map } = useMapbox();
    if (!map || !plumes.length) return;

    return (<>
        {showPlumeLayers && plumes && plumes.length && plumes.map((plume) => <MapLayer key={plume.id} plumeId={plume.id} plume={plume.representationalPlume} handleLayerClick={handleLayerClick} hoveredPlumeId={hoveredPlumeId} setHoveredPlumeId={setHoveredPlumeId}></MapLayer>)}
        </>
    );
}
