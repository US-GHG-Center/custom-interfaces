import React, { createContext, useContext, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { BASEMAP_STYLES, BASEMAP_ID_DEFAULT } from '../config/mapConfig';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapboxContext = createContext();

const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
const mapboxStyleBaseUrl = process.env.REACT_APP_MAPBOX_STYLE_URL;

export const MapboxProvider = ({ children }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;

    let mapboxStyleUrl = 'mapbox://styles/mapbox/streets-v12';
    if (mapboxStyleBaseUrl) {
        let styleId = BASEMAP_STYLES.findIndex(style => style.id === BASEMAP_ID_DEFAULT);
        mapboxStyleUrl = `${mapboxStyleBaseUrl}/${BASEMAP_STYLES[styleId].mapboxId}`;
    }

    mapboxgl.accessToken = accessToken;
    map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapboxStyleUrl,
        center: [-98.771556, 32.967243], // Centered on the US
        zoom: 4,
        projection: 'equirectangular',
        options: {
            trackResize: true
        }
    });

    map.current.dragRotate.disable();
    map.current.touchZoomRotate.disableRotation();

    return () => map.current.remove();
  }, []);

  return (
    <MapboxContext.Provider value={{ map: map.current }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      {children}
    </MapboxContext.Provider>
  );
};

export const useMapbox = () => useContext(MapboxContext);
