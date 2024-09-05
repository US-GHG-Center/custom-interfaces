import { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import { MapRegionLegend } from '../legend';
import { LoadingSpinner } from '../loading';

import './index.css';

import { BASEMAP_STYLES, BASEMAP_ID_DEFAULT } from './config';
import { getLocationToZoom, getZoomLevel, getMeanCenterOfLocation, getToolTipContent, getUniqueRegions, getStationRegion, getMarkerStyle } from "./helper";

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
        this.stationMarkers = [];
        // functions
        this.getLocationToZoom = getLocationToZoom;
        this.getMeanCenterOfLocation = getMeanCenterOfLocation;
        this.getToolTipContent = getToolTipContent;
        this.getUniqueRegions = getUniqueRegions;
        this.getStationRegion = getStationRegion;
        this.getZoomLevel = getZoomLevel;
        this.getMarkerStyle = getMarkerStyle;
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
            projection: 'equirectangular',
            options: {
                trackResize: true
            }
        });
        this.setState({currentViewer: map});
        
        // show the world map and show all the stations
        this.plotStations(map, this.props.stations, this.props.region, this.props.agency, this.props.stationCode);
    }

    componentDidUpdate(prevProps, prevState) {
        // on page refresh, show the whole map of usa and show all the stations
        if (this.props.stationCode !== prevProps.stationCode || this.props.agency !== prevProps.agency ||
            this.props.region !== prevProps.region || this.props.stations !== prevProps.stations) {
            this.plotStations(this.state.currentViewer, this.props.stations, this.props.region, this.props.agency, this.props.stationCode);
        }
        if (!this.props.displayChart && this.state.currentViewer) {
            // when the chart panel is closed, resize the map to take full container space
            this.state.currentViewer.resize();
        }
    }

    componentWillUnmount() {
        // clean all the event listeners
        this.stationMarkers.forEach(marker => {
            let elem = marker.getElement();
            // clone won't have the event listeners, so previous will be garbage collected
            elem.replaceWith(elem.cloneNode(true));
        });
    }

    plotStations = (map, stations, region, agency, stationCode) => {
        let regions = this.getUniqueRegions(stations);
        this.setState({regions: regions});
        let stationMarkers = stations.map(station => {
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

            return marker;
        });
        this.stationMarkers = this.stationMarkers.concat(stationMarkers);

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
        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            offset: [0, -15],
            anchor: 'bottom'
        }).setHTML(tooltipContent);
        marker.setPopup(popup);
        marker.getElement().addEventListener("mouseenter", () => {
            popup.addTo(map);
        });
        marker.getElement().addEventListener("mouseleave", () => {
            popup.remove();
        });

        return marker;
    }



    render() {
        return (
            <Box component="main" className="map-section fullSize" sx={{ flexGrow: 1 }} style={this.props.style}>
                <Grid container className="fullSize">
                    <Grid item xs={12} sx={{ position: "relative" }} style={{height: "100%"}}>
                        { this.props.stations.length < 1 && this.state.currentViewer && <LoadingSpinner /> }
                        <div id="mapbox-container" className='fullSize' style={{ position: "absolute" }}></div>
                    </Grid>
                </Grid>
                <MapRegionLegend regions={this.state.regions} markerStylesList={this.markerClasses}/>
            </Box>
        );    
    }
}