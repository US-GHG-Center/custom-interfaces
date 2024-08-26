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
            zoom: 2,
            projection: 'equirectangular'
        });
        this.setState({currentViewer: map});
        
        // show the world map and show all the stations
        this.plotStations(map, this.props.stations, this.props.region, this.props.agency, this.props.stationCode);
    }

    componentDidUpdate(prevProps, prevState) {
        // on page refresh, show the whole map of usa and show all the NIST stations
        this.plotStations(this.state.currentViewer, this.props.stations, this.props.region, this.props.agency, this.props.stationCode);
    }

    plotStations = (map, stations, region, agency, stationCode) => {
        let regions = this.getUniqueRegions(stations);
        stations.forEach(station => {
            // get the station meta and show them
            const { id, title: name, location, properties } = station;
            const [lon,  lat] = location;
            const el = document.createElement('div');
            let stationRegion = this.getStationRegion(id);
            const markerStyleIndex = regions[stationRegion];
            el.className = this.getMarkerStyle(markerStyleIndex);

            let marker = this.addMarker(map, el, name, lon, lat, properties);

            marker.getElement().addEventListener('click', () => {
                this.props.setDisplayChart(true);
                this.props.setSelection(id);
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
                let { location } = station;
                return location;
            }
        }
        // go through the stations and average the lat and lon to get the center
        let latSum = 0;
        let lonSum = 0;
        stations.forEach((station) => {
            let { location } = station;
            let [lon, lat] = location;
            latSum += lat;
            lonSum += lon;
        });
        let latCenter = latSum / stations.length;
        let lonCenter = lonSum / stations.length;
        return [lonCenter, latCenter];
    }

    getZoomLevel = (region, agency, stationCode) => {
        if (stationCode) {
            return 6;
        } else if (agency && region) {
            return 5;
        } else if (agency === "nist" && !region) {
            // nist is for conus region, so zoom more to conus
            return 4;
        } else {
            return 2;
        }
    }

    addMarker = (map, element, name, lon, lat, properties) => {
        let marker = new mapboxgl.Marker(element)
        .setLngLat([lon, lat])
        // .setPopup(new mapboxgl.Popup({ offset: 25 })
        // .setText(name)
        .addTo(map);

        const tooltipContent = this.getToolTipContent(properties);
        const popup = new mapboxgl.Popup().setHTML(tooltipContent);
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
        let { siteCode, siteName, siteCountry, latitude, longitude,
            elevation, elevationUnit, instrumentType, region } = stationProperties;

        // making sure that they appear, for demo purpose. TODO: remove this 
        region = "<undefined>"; instrumentType = "<undefined>"; elevation = "<undefined>"; elevationUnit = "<undefined>";

        // siteCode acornym and full name
        let siteNameAddOn = siteName ? ` : ${siteName}` : "";
        let firstRow = `<strong>${siteCode.toUpperCase()}${siteNameAddOn}</strong><br>`;
        // site region
        let wildRow = region ? `Region: ${region}<br>` : "";
        // siteCountry
        let secondRow = siteCountry ? `<strong>${siteCountry}</strong><br>` : "";
        // latitude
        let thirdRow = latitude ? `Latitude: ${Number(latitude).toFixed(2)}<br>` : "";
        // longitude
        let fourthRow = longitude ? `Longitude: ${Number(longitude).toFixed(2)}<br>` : "";
        // elevation
        // let fifthRow = elevation ? `Elevation: ${Number(elevation).toFixed(2)} ${elevationUnit}<br>` : "";
        let fifthRow = elevation ? `Elevation: ${elevation} ${elevationUnit}<br>` : "";
        // instrumentType
        let sixthRow = instrumentType ? `Instrument Type: ${instrumentType}<br>` : "";
        // combine all the rows
        let result = firstRow + secondRow + wildRow + thirdRow + fourthRow + fifthRow + sixthRow;
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
            <Box component="main" className="map-section fullSize" sx={{ flexGrow: 1 }}>
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