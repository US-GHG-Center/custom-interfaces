import { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import { VULCAN_RASTER_URL, GRA2PES_RASTER_URL, AOI_BOUNDS } from './helper';

import './index.css';

const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
const mapCenter = [-99.676392, 39.106667];

export class MapBoxViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentViewer: null,
            mapLoaded: false,
            selectedUrbanRegion: props.selectedUrbanRegion
        };
    }

    plotMap() {
        mapboxgl.accessToken = accessToken;
        const mapboxStyleUrl = 'mapbox://styles/covid-nasa/cldu1cb8f00ds01p6gi583w1m';

        const map = new mapboxgl.Map({
            container: 'mapbox-container',
            projection: 'mercator',
            style: mapboxStyleUrl,
            center: mapCenter,
            zoom: 4,
            zoomControl: true,
            pitchWithRotate: false,
            dragRotate: false,
            touchZoomRotate: false
        });

        this.setState({ currentViewer: map, mapLoaded: false });

        map.addControl(new mapboxgl.NavigationControl());

        map.on('load', () => {
            this.setState({ mapLoaded: true });

            // Add tile sources
            map.addSource('raster-tiles-vulcan', {
                type: 'raster',
                tiles: [VULCAN_RASTER_URL]
            });

            map.addSource('raster-tiles-gra2pes', {
                type: 'raster',
                tiles: [GRA2PES_RASTER_URL]
            });

            // Add dataset layer
            if (this.props.dataset === 'vulcan') {
                map.addLayer({
                    id: 'raster-layer',
                    type: 'raster',
                    source: 'raster-tiles-vulcan',
                    paint: { 'raster-opacity': 0.8 }
                });
            } else if (this.props.dataset === 'gra2pes') {
                map.addLayer({
                    id: 'raster-layer',
                    type: 'raster',
                    source: 'raster-tiles-gra2pes',
                    paint: { 'raster-opacity': 0.8 }
                });
            }

            // Move labels above raster layers
            const labelLayers = [
                'country-label',
                'state-label',
                'settlement-major-label',
                'settlement-minor-label',
                'admin-1-boundary'
            ];
            labelLayers.forEach(id => {
                if (map.getLayer(id)) map.moveLayer(id);
            });

            // show the whole map of usa and show all the urban areas
            this.plotUrbanRegions(map, this.props.urbanRegions);

            // Handle initial urban region selection or AOI bounds
            if (this.props.urbanRegion) {
                const selectedRegion = this.props.urbanRegions.find(
                    item => item.name === this.props.urbanRegion
                );
                if (selectedRegion) {
                    this.handleUrbanRegionSelection(
                        map,
                        this.props.urbanRegion,
                        selectedRegion.center,
                        selectedRegion.geojson
                    );
                }
            } else {
                this.applyAOIBounds(map);
            }
        });
    }

    componentDidMount() {
        this.plotMap();
    }

    componentDidUpdate(prevProps) {
        const { currentViewer, mapLoaded } = this.state;

        if (!mapLoaded || !currentViewer) return; // Guard until map is ready

        if (prevProps.zoomOut !== this.props.zoomOut) {
            this.resetMapView();
        }

        if (prevProps.urbanRegions !== this.props.urbanRegions) {
            this.plotMap();
        }

        if (prevProps.urbanRegion !== this.props.urbanRegion) {
            console.log('urban region changed to', this.props.urbanRegion);

            const selectedRegion = this.props.urbanRegions.find(
                item => item.name === this.props.urbanRegion
            );
            if (selectedRegion) {
                console.log('selected region is:', selectedRegion);
                this.handleUrbanRegionSelection(
                    currentViewer,
                    this.props.urbanRegion,
                    selectedRegion.center,
                    selectedRegion.geojson
                );
            }
        }

        if (prevProps.aoi !== this.props.aoi && !this.props.urbanRegion) {
            this.applyAOIBounds(currentViewer);
        }
    }

    resetMapView = () => {
        const { currentViewer } = this.state;
        if (!currentViewer) {
            console.log('Map instance not initialized yet...');
            return;
        }

        this.props.setSelection('');
        this.setState({ selectedUrbanRegion: false });

        currentViewer.flyTo({
            center: mapCenter,
            zoom: 4,
            speed: 1.2,
            curve: 1.42
        });

        if (currentViewer.getLayer('boundary-fill')) currentViewer.removeLayer('boundary-fill');
        if (currentViewer.getLayer('boundary-outline')) currentViewer.removeLayer('boundary-outline');
        if (currentViewer.getSource('urban-boundary')) currentViewer.removeSource('urban-boundary');
    };

    handleUrbanRegionSelection = (map, name, center, geojson) => {
        this.setState({ selectedUrbanRegion: name });
        this.props.setSelection(name);
        this.focusSelectedUrbanRegion(map, center, geojson);
    };

    plotUrbanRegions = (map, urbanRegions) => {
        urbanRegions.forEach(urbanRegion => {
            const { name, center, geojson } = urbanRegion;
            const [lon, lat] = center;
            const el = document.createElement('div');
            el.className = 'marker';

            const marker = this.addMarker(map, el, name, lon, lat);

            marker.getElement().addEventListener('click', () => {
                this.handleUrbanRegionSelection(map, name, center, geojson);
            });
        });
    };

    addMarker = (map, element, name, lon, lat) => {
        const marker = new mapboxgl.Marker(element).setLngLat([lon, lat]).addTo(map);

        const tooltipContent = `<strong>${name}</strong>`;
        const popup = new mapboxgl.Popup({
            closeButton: false,
            offset: [-3, -15],
            anchor: 'bottom'
        }).setHTML(tooltipContent);

        marker.setPopup(popup);
        marker.getElement().addEventListener('mouseenter', () => popup.addTo(map));
        marker.getElement().addEventListener('mouseleave', () => popup.remove());

        return marker;
    };

    focusSelectedUrbanRegion = (map, center, GeoJSON) => {
        const panMapToTheLeft = 0.3;

        map.flyTo({
            center: [center[0] - panMapToTheLeft, center[1]],
            zoom: 9,
            speed: 1.2,
            curve: 1.42
        });

        const sourceName = 'urban-boundary';
        if (map.getLayer('boundary-fill')) map.removeLayer('boundary-fill');
        if (map.getLayer('boundary-outline')) map.removeLayer('boundary-outline');
        if (map.getSource(sourceName)) map.removeSource(sourceName);

        map.addSource(sourceName, {
            type: 'geojson',
            data: GeoJSON
        });

        map.addLayer({
            id: 'boundary-fill',
            type: 'fill',
            source: sourceName,
            layout: {},
            paint: {
                'fill-color': '#FFFFFF',
                'fill-opacity': 0.1
            }
        });

        map.addLayer({
            id: 'boundary-outline',
            type: 'line',
            source: sourceName,
            layout: {},
            paint: {
                'line-color': '#082A63',
                'line-width': 3
            }
        });
    };

    applyAOIBounds = map => {
        const { aoi } = this.props;

        if (!aoi || !AOI_BOUNDS[aoi]) {
            console.log('No valid AOI specified or AOI not found in bounds');
            return;
        }

        const bounds = AOI_BOUNDS[aoi];
        const bbox = [
            bounds.southwest[0],
            bounds.southwest[1],
            bounds.northeast[0],
            bounds.northeast[1]
        ];

        console.log(`Applying AOI bounds for ${aoi}:`, bbox);

        map.fitBounds(bbox, {
            padding: 100
        });
    };

    render() {
        return (
            <Box component="main" className="map-section">
                <Grid container className="fullSize">
                    <Grid item xs={12}>
                        <div
                            id="mapbox-container"
                            className="fullSize"
                            style={{ position: 'absolute' }}
                        ></div>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}
