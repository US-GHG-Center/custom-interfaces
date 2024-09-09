import { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import './index.css';

import { BASEMAP_STYLES, BASEMAP_ID_DEFAULT, VULCAN_RASTER_URL, GRA2PES_RASTER_URL } from './helper';

import { URBAN_REGIONS } from '../../assets/geojson';

const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
const mapboxStyleBaseUrl = process.env.REACT_APP_MAPBOX_STYLE_URL;
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

        //TODO: Get custom basemap styles for the satellite-v9
        // right now these use basemap styles for covid-nasa map 
        // if (mapboxStyleBaseUrl) {
        //     let styleId = BASEMAP_STYLES.findIndex(style => style.id === BASEMAP_ID_DEFAULT);
        //     mapboxStyleUrl = `${mapboxStyleBaseUrl}/${BASEMAP_STYLES[styleId].mapboxId}`;
        // }

        const map = new mapboxgl.Map({
            container: 'mapbox-container',
            projection: "mercator",
            style: mapboxStyleUrl,
            center: [-99.676392, 39.106667], // Center of the USA
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

            map.moveLayer('country-label'); // Move city labels layer above
            map.moveLayer('state-label'); // Move city labels layer above
            map.moveLayer('settlement-major-label');
            map.moveLayer('settlement-minor-label');
            map.moveLayer('admin-1-boundary');
        })

        // show the whole map of usa and show all the urban areas
        this.plotUrbanRegions(map, URBAN_REGIONS);
    }

    componentDidMount() {
        this.plotMap();
    }

    // Trigger zoom out when zoomOut button is clicked.
    componentDidUpdate = (prevProps) => {
        if (prevProps.zoomOut !== this.props.zoomOut) {
            this.resetMapView();
        }

        if (prevProps.urbanRegion !== this.props.urbanRegion) {
            console.log("urban region changed to ", this.props.urbanRegion);

            const urbanRegion = URBAN_REGIONS.filter(item => item.name === this.props.urbanRegion)[0];
            if (urbanRegion) {
                console.log("selected region is: ", urbanRegion);
                const name = urbanRegion.center;
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
            this.state.selectedUrbanRegion = false; //giving this incorrect state will force it to reset
            this.plotMap();
        } else {
            console.log("Map instance not initialized yet...")
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
            // this.focusSelectedUrbanRegion(map, center, GeoJSON);
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
                {/* {this.state.selectedUrbanRegion
                    &&
                    <Insights
                        urbanRegion={this.props.urbanRegion}
                        dataset={this.props.dataset}
                    />
                } */}
            </Box>
        );
    }
}

