import React, { createContext, useContext, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { BASEMAP_STYLES, BASEMAP_ID_DEFAULT } from '../config/mapConfig';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapboxContext = createContext();

export const MapboxProvider = ({ children, config }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const accessToken = config?.mapboxToken
    ? config.mapboxToken
    : process.env.REACT_APP_MAPBOX_TOKEN;
  const mapboxStyleBaseUrl = config?.mapboxStyle
    ? config.mapboxStyle
    : process.env.REACT_APP_MAPBOX_STYLE_URL;
  const BASEMAP_STYLES_MAPBOX_ID = config?.basemapStyle
    ? config.basemapStyle
    : process.env.REACT_APP_BASEMAP_STYLES_MAPBOX_ID ||
      'cldu1cb8f00ds01p6gi583w1m';

  useEffect(() => {
    if (map.current) return;

    // Validate required environment variables
    if (!accessToken) {
      console.error(
        'Mapbox access token is not set. Please set REACT_APP_MAPBOX_TOKEN in your environment variables.'
      );
      return;
    }

    let mapboxStyleUrl = 'mapbox://styles/mapbox/streets-v12';
    if (mapboxStyleBaseUrl) {
      mapboxStyleUrl = `${mapboxStyleBaseUrl}/${BASEMAP_STYLES_MAPBOX_ID}`;
    }

    try {
      // Set Mapbox access token
      mapboxgl.accessToken = accessToken;
      // Initialize map instance
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapboxStyleUrl,
        center: [-98.771556, 32.967243], // Centered on the US
        zoom: 4,
        projection: 'equirectangular',
        options: {
          trackResize: true,
        },
      });

      // Disable rotation interactions after style is loaded
      map.current.on('style.load', () => {
        map.current.dragRotate.disable();
        map.current.touchZoomRotate.disableRotation();
      });

      // Handle style loading errors
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    // Cleanup map instance on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <MapboxContext.Provider value={{ map: map.current }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      {children}
    </MapboxContext.Provider>
  );
};


export const useMapbox = () => useContext(MapboxContext);
