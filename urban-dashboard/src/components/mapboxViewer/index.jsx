import { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import { VULCAN_RASTER_URL, GRA2PES_RASTER_URL } from './helper';

import './index.css';

const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
// const mapboxStyleBaseUrl = process.env.REACT_APP_MAPBOX_STYLE_URL;
const mapCenter = [-99.676392, 39.106667];

export class MapBoxViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentViewer: null,
            selectedUrbanRegion: null
        }
    }

    plotMap() {
        mapboxgl.accessToken = accessToken;
        let mapboxStyleUrl = 'mapbox://styles/covid-nasa/cldu1cb8f00ds01p6gi583w1m';

        const map = new mapboxgl.Map({
            container: 'mapbox-container',
            projection: "mercator",
            style: mapboxStyleUrl,
            center: mapCenter, // Center of the USA
            zoom: 4, // Adjust zoom level to fit the USA
            zoomControl: true,
            pitchWithRotate: false,
            dragRotate: false,
            touchZoomRotate: false
        });

        this.setState({ currentViewer: map });

        // map.addControl(HomeButtonControl);
        map.addControl(new mapboxgl.NavigationControl());

        // add the tile sources 
        map.on("load", () => {
            map.addSource("raster-tiles-vulcan", {
                "type": "raster",
                "tiles": [VULCAN_RASTER_URL]
            })

            map.addSource("raster-tiles-gra2pes", {
                "type": "raster",
                "tiles": [GRA2PES_RASTER_URL]
            })

            if (this.props.dataset === "vulcan") {
                map.addLayer({
                    "id": "raster-layer",
                    "type": "raster",
                    "source": "raster-tiles-vulcan",
                    "paint": {
                        "raster-opacity": 0.8
                    }
                })
            } else if (this.props.dataset === "gra2pes") {
                map.addLayer({
                    "id": "raster-layer",
                    "type": "raster",
                    "source": "raster-tiles-gra2pes",
                    "paint": {
                        "raster-opacity": 0.8
                    }
                })
            }

            // Move label layers above raster layers
            map.moveLayer('country-label');
            map.moveLayer('state-label');
            map.moveLayer('settlement-major-label');
            map.moveLayer('settlement-minor-label');
            map.moveLayer('admin-1-boundary');
        })

        // show the whole map of usa and show all the urban areas
        this.plotUrbanRegions(map, this.props.urbanRegions);
    }

    componentDidMount() {
        this.plotMap();
    }

    // Trigger zoom out when zoomOut button is clicked.
    componentDidUpdate = (prevProps) => {
        if (prevProps.zoomOut !== this.props.zoomOut) {
            this.resetMapView();
        }

        if (prevProps.urbanRegions !== this.props.urbanRegions) {
            this.plotMap();
        }

        if (prevProps.urbanRegion !== this.props.urbanRegion) {

            const urbanRegion = this.props.urbanRegions.filter(item => item.name === this.props.urbanRegion)[0];
            if (urbanRegion) {
                // const name = urbanRegion.center;
                const center = urbanRegion.center;
                const geojson = urbanRegion.geojson;

                // update selected region 
                // this.setState({ selectedUrbanRegion: name });
                // this.props.setSelection(name);

                //focus on selected region 
                this.focusSelectedUrbanRegion(
                    this.state.currentViewer,
                    center,
                    geojson
                );
            }
        }
    }

    resetMapView = () => {
        const { currentViewer } = this.state;
        if (currentViewer) {
            this.props.setSelection("");
            this.setState({
                selectedUrbanRegion: false, //giving this incorrect state will force it to reset
            })

            // Zoom out and fly back to center and remove all the geoJSON layers
            const currentMap = this.state.currentViewer;
            currentMap.flyTo({
                center: mapCenter,
                zoom: 4,
                speed: 1.2,
                curve: 1.42
            })

            if (currentMap.getLayer('boundary-fill')) currentMap.removeLayer('boundary-fill');
            if (currentMap.getLayer('boundary-outline')) currentMap.removeLayer('boundary-outline');
            if (currentMap.getSource("urban-boundary")) currentMap.removeSource("urban-boundary");


        }
    }

    plotUrbanRegions = (map, urbanRegions) => {
        urbanRegions.forEach(urbanRegion => {
            const { name, center, geojson } = urbanRegion;
            const [lon, lat] = center;
            const el = document.createElement('div');
            el.className = 'marker';

            let marker = this.addMarker(map, el, name, lon, lat);

            // when clicked on a urban region, focus on it
            marker.getElement().addEventListener('click', () => {
                this.setState({ selectedUrbanRegion: name });
                this.props.setSelection(name);
                this.focusSelectedUrbanRegion(map, center, geojson);
            });
        });
    }

    addMarker = (map, element, name, lon, lat) => {
        let marker = new mapboxgl.Marker(element)
            .setLngLat([lon, lat])
            // .setPopup(new mapboxgl.Popup({ offset: 25 })
            // .setText(name)
            .addTo(map);

        const tooltipContent = `<strong>${name}<strong>`;
        const popup = new mapboxgl.Popup({
            closeButton: false,
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

    focusSelectedUrbanRegion = (map, center, GeoJSON) => {
        map.flyTo({
            center: center,
            zoom: 9,
            speed: 1.2,
            curve: 1.42
        })

        let sourceName = 'urban-boundary';

        if (map.getLayer('boundary-fill')) map.removeLayer('boundary-fill');
        if (map.getLayer('boundary-outline')) map.removeLayer('boundary-outline');
        if (map.getSource(sourceName)) map.removeSource(sourceName);

        map.addSource(sourceName, {
            'type': 'geojson',
            'data': GeoJSON
        });

        map.addLayer({
            'id': 'boundary-fill',
            'type': 'fill',
            'source': sourceName,
            'layout': {},
            'paint': {
                'fill-color': '#FFFFFF',
                'fill-opacity': 0.1,
            }
        });

        map.addLayer({
            'id': 'boundary-outline',
            'type': 'line',
            'source': sourceName,
            'layout': {},
            'paint': {
                'line-color': "#082A63",
                'line-width': 3
            }
        });
    }

    render() {
        return (
            <Box component="main" className="map-section">
                <Grid container className="fullSize">
                    <Grid item xs={12}>
                        <div id="mapbox-container" className='fullSize' style={{ position: "absolute" }}></div>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}

