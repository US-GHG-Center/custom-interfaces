import { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import { MapRegionLegend } from '../legend';
import { LoadingSpinner } from '../loading';

import './index.css';

import { BASEMAP_STYLES, BASEMAP_ID_DEFAULT } from './config';
import { getLocationToZoom, getZoomLevel, getMeanCenterOfLocation, getToolTipContent, getUniqueRegions, getStationRegion } from "./helper";

const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
const mapboxStyleBaseUrl = process.env.REACT_APP_MAPBOX_STYLE_URL;

export class MapBoxViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentViewer: null,
            regions: {}
        }
        this.markerClasses = ["marker", "marker marker-blue", "marker marker-purple", "marker marker-pink", "marker marker-red" ];
        this.getLocationToZoom = getLocationToZoom;
        this.getMeanCenterOfLocation = getMeanCenterOfLocation;
        this.getToolTipContent = getToolTipContent;
        this.getUniqueRegions = getUniqueRegions;
        this.getStationRegion = getStationRegion;
        this.getZoomLevel = getZoomLevel;
    }

    componentDidMount() {
        mapboxgl.accessToken = accessToken;
        let mapboxStyleUrl = 'mapbox://styles/mapbox/streets-v12';
        if (mapboxStyleBaseUrl) {
            let styleId = BASEMAP_STYLES.findIndex(style => style.id === BASEMAP_ID_DEFAULT);
            mapboxStyleUrl = `${mapboxStyleBaseUrl}/${BASEMAP_STYLES[styleId].mapboxId}`;
        }

        const map = new mapboxgl.Map({
            container: 'mapbox-container',
            style: mapboxStyleUrl,
            center: [-98.585522, 1.8333333], // Centered on the US
            zoom: this.props.zoomLevel || 2,
            projection: 'equirectangular'
        });
        this.setState({currentViewer: map});
        
        // show the world map and show all the stations
        this.plotStations(map, this.props.stations, this.props.region, this.props.agency, this.props.stationCode);
    }

    componentDidUpdate(prevProps, prevState) {
        // on page refresh, show the whole map of usa and show all the NIST stations
        if (this.props.stationCode !== prevProps.stationCode || this.props.agency !== prevProps.agency ||
            this.props.region !== prevProps.region || this.props.stations !== prevProps.stations) {
            this.plotStations(this.state.currentViewer, this.props.stations, this.props.region, this.props.agency, this.props.stationCode);
        }
    }

    plotStations = (map, stations, region, agency, stationCode) => {
        let regions = this.getUniqueRegions(stations);
        this.setState({regions: regions});
        stations.forEach(station => {
            // get the station meta and show them
            const { id: stationId, properties } = station;
            const el = document.createElement('div');
            let stationRegion = this.getStationRegion(stationId);
            const markerStyleIndex = regions[stationRegion].index;
            el.className = this.getMarkerStyle(markerStyleIndex, this.markerClasses);

            let marker = this.addMarker(map, el, properties);

            marker.getElement().addEventListener('click', () => {
                this.props.setDisplayChart(true);
                this.props.setSelection(stationId);
            });
        });

        // zoom to certian place, based on region and agency
        let zoomLocation = this.getLocationToZoom(stations, stationCode);
        let zoomLevel = this.getZoomLevel(region, agency, stationCode, this.props.zoomLevel);
        if (zoomLocation) {
            map.flyTo({ center: zoomLocation, zoom: zoomLevel });
        }
    }

    // utils

    addMarker = (map, element, properties) => {
        const {longitude, latitude} = properties;
        let marker = new mapboxgl.Marker(element)
        .setLngLat([longitude, latitude])
        .addTo(map);

        const tooltipContent = this.getToolTipContent(properties);
        const popup = new mapboxgl.Popup({closeButton: false}).setHTML(tooltipContent);
        marker.setPopup(popup);
        marker.getElement().addEventListener("mouseenter", () => {
            popup.addTo(map);
        });
        marker.getElement().addEventListener("mouseleave", () => {
            popup.remove();
        });

        return marker;
    }

    getMarkerStyle = (index, markerClasses) => {
        // Index is unlimited but markerClasses array has limited items
        let idx = index % markerClasses.length;
        return markerClasses[idx];
    }

    render() {
        return (
            <Box component="main" className="map-section fullSize" sx={{ flexGrow: 1 }} style={this.props.style}>
                <Grid container className="fullSize">
                    <Grid item xs={12} sx={{ position: "relative" }}>
                        { this.props.stations.length < 1 && this.state.currentViewer && <LoadingSpinner /> }
                        <div id="mapbox-container" className='fullSize' style={{ position: "absolute" }}></div>
                    </Grid>
                </Grid>
                <MapRegionLegend regions={this.state.regions} markerStylesList={this.markerClasses}/>
            </Box>
        );    
    }
}