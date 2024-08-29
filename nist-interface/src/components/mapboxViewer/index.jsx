import { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import { LoadingSpinner } from '../loading';

import './index.css';

import { BASEMAP_STYLES, BASEMAP_ID_DEFAULT } from './helper';

const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
const mapboxStyleBaseUrl = process.env.REACT_APP_MAPBOX_STYLE_URL;

export class MapBoxViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentViewer: null
        }
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
        stations.forEach(station => {
            // get the station meta and show them
            const { id: stationId, properties } = station;
            const el = document.createElement('div');
            let stationRegion = this.getStationRegion(stationId);
            const markerStyleIndex = regions[stationRegion];
            el.className = this.getMarkerStyle(markerStyleIndex);

            let marker = this.addMarker(map, el, properties);

            marker.getElement().addEventListener('click', () => {
                this.props.setDisplayChart(true);
                this.props.setSelection(stationId);
            });
        });

        // zoom to certian place, based on region and agency
        let zoomLocation = this.getLocationToZoom(stations, stationCode);
        let zoomLevel = this.getZoomLevel(region, agency, stationCode);
        if (zoomLocation) {
            map.flyTo({ center: zoomLocation, zoom: zoomLevel });
        }
    }

    // utils

    getLocationToZoom = (stations, stationCode) => {
        if (stations.length<1) {
            return null;
        }
        if (stationCode) {
            let station = stations.find(station => station.id.includes(stationCode));
            if (station) {
                let { properties: {longitude, latitude} } = station;
                let location = [longitude, latitude];
                return location;
            }
        }
        // go through the stations and average the lat and lon to get the center
        let latSum = 0;
        let lonSum = 0;
        stations.forEach((station) => {
            let { properties: {longitude, latitude} } = station;
            latSum += latitude;
            lonSum += longitude;
        });
        let latCenter = latSum / stations.length;
        let lonCenter = lonSum / stations.length;
        return [lonCenter, latCenter];
    }

    getZoomLevel = (region, agency, stationCode) => {
        if (this.props.zoomLevel) {
            // zoom-level in queryParam has highest precedence
            return this.props.zoomLevel;
        }
        if (stationCode) {
            // station-code present in queryParam has second highest precedence
            return 6;
        }
        if (agency && region) {
            return 5;
        }
        if (agency === "nist" && !region) {
            // nist is for conus region, so zoom more to conus
            return 4;
        }
        return 2;
    }

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

    getToolTipContent = (stationProperties) => {
        const elevationUnit = "m";

        let { city, country, elevation_m, instrument_type, latitude_nwse, longitude_nwse,
              state, station_code, station_name, status, top_agl_m} = stationProperties;

        // siteCode acornym and full name
        let siteNameAddOn = station_name ? `: ${station_name}` : "";
        let siteNameRow = `<strong>${station_code.toUpperCase()}${siteNameAddOn}</strong><br>`;
        // site region
        let cityAddOn = city ? `${city},` : "";
        let regionAddOn = state ? `${cityAddOn} ${state},` : "";
        // siteCountry
        let addressRow = country ? `<i>${regionAddOn} ${country}</i><br>` : "";
        // longitude
        let longRow = longitude_nwse ? `Longitude: ${longitude_nwse}<br>` : "";
        // latitude
        let latRow = latitude_nwse ? `Latitude: ${latitude_nwse}<br>` : "";
        // elevation
        // let fifthRow = elevation ? `Elevation: ${Number(elevation).toFixed(2)} ${elevationUnit}<br>` : "";
        let elevationRow = elevation_m ? `Elevation: ${elevation_m} ${elevationUnit}<br>` : "";
        // sampling height
        let samplingHeightRow = top_agl_m ? `Sampling Height: ${top_agl_m} ${elevationUnit}<br>` : "";
        // instrumentType
        let instrumentRow = instrument_type ? `Instrument Type: ${instrument_type}<br>` : "";
        // stationStatus
        let stationStatusRow = status ? `Station Status: ${status}<br>` : "";
        // combine all the rows
        let result = siteNameRow + addressRow + "<hr>" + longRow + latRow + elevationRow + samplingHeightRow + instrumentRow + stationStatusRow;
        return result;
    }

    getMarkerStyle = (index) => {
        let markersClasses = ["marker", "marker marker-blue", "marker marker-purple", "marker marker-pink", "marker marker-red" ];
        return markersClasses[index];
    }

    getUniqueRegions = (stations) => {
        // got through all station. scrape out the region name from id
        // then make a hash of the unique regions.
        let memo = {};
        let idx = 0;
        for (let i=0; i<stations.length; i++) {
            let station = stations[i];
            // <agency>_<data_category>_<region>_<sitecode>_<ghg>_<frequency>_concentrations
            let regionName = this.getStationRegion(station.id);
            if (!(regionName in memo)) {
                memo[regionName] = idx;
                idx++;
            }
        }
        return memo;
    }

    getStationRegion = (stationId) => {
        return stationId.split("_")[2];
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
            </Box>
        );    
    }
}