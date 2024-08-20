import { Component, Fragment } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

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
        
        // show the whole map of usa and show all the NIST stations
        this.plotStations(map, this.props.stations);
    }

    componentDidUpdate(prevProps, prevState) {
        // on page refresh, show the whole map of usa and show all the NIST stations
        this.plotStations(this.state.currentViewer, this.props.stations);
    }

    plotStations = (map, stations) => {
        stations.forEach(station => {
            // get the station meta and show them
            const { id, title: name, location, properties } = station;
            const [lon,  lat] = location;
            const el = document.createElement('div');
            el.className = 'marker';
            
            let marker = this.addMarker(map, el, name, lon, lat, properties);

            marker.getElement().addEventListener('click', () => {
                this.props.setDisplayChart(true);
                this.props.setSelection(id);
            });
        });
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
            elevation, elevationUnit, instrumentType } = stationProperties;
        let siteNameAddOn = siteName ? ` : ${siteName}` : "";
        let firstRow = `<strong>${siteCode.toUpperCase()}${siteNameAddOn}</strong><br>`;
        let secondRow = siteCountry ? `<strong>${siteCountry}</strong><br>` : "";
        let thirdRow = latitude ? `Latitude: ${Number(latitude).toFixed(2)}<br>` : "";
        let fourthRow = longitude ? `Longitude: ${Number(longitude).toFixed(2)}<br>` : "";
        let fifthRow = elevation ? `Elevation: ${Number(elevation).toFixed(2)} ${elevationUnit}<br>` : "";
        let sixthRow = instrumentType ? `Instrument Type: ${instrumentType}<br>` : "";
        let result = firstRow + secondRow + thirdRow + fourthRow + fifthRow + sixthRow;
        return result;
    }

    render() {
        return (
            <Box component="main" className="map-section fullSize" sx={{ flexGrow: 1 }}>
                <Grid container className="fullSize">
                    <Grid item xs={12} sx={{ position: "relative" }}>
                        <div id="mapbox-container" className='fullSize' style={{ position: "absolute" }}></div>
                    </Grid>
                </Grid>
            </Box>
        );    
    }
}