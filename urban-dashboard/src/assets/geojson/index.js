import { center as CHICenter, GeoJSON as CHIGeoJSON } from './CHI';
import { center as INCenter, GeoJSON as INGeoJSON } from './IN';
import { center as LACenter, GeoJSON as LAGeoJSON } from './LA';
import { center as NYCenter, GeoJSON as NYGeoJSON } from './NY';
import { center as SFCenter, GeoJSON as SFGeoJSON } from './SF';
import { center as SLCCenter, GeoJSON as SLCGeoJSON } from './SLC';

export const URBAN_REGIONS_NAME = ["Chicago", "Indianapolis", "Los Angeles", "New York", "San Francisco", "Salt Lake City"];

export const URBAN_REGIONS_COORDINATES = [CHICenter, INCenter, LACenter, NYCenter, SFCenter, SLCCenter];

export const URBAN_REGIONS_GEOJSONS = [CHIGeoJSON, INGeoJSON, LAGeoJSON, NYGeoJSON, SFGeoJSON, SLCGeoJSON];

export const URBAN_REGIONS = URBAN_REGIONS_NAME.map((name, idx) => ({
    name: name,
    center: URBAN_REGIONS_COORDINATES[idx],
    geojson: URBAN_REGIONS_GEOJSONS[idx]
}));