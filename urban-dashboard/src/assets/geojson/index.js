import { center as CHICenter, GeoJSON as CHIGeoJSON } from './CHI';
import { center as INCenter, GeoJSON as INGeoJSON } from './IN';
import { center as LACenter, GeoJSON as LAGeoJSON } from './LA';
import { center as NYCenter, GeoJSON as NYGeoJSON } from './NY';
import { center as SFCenter, GeoJSON as SFGeoJSON } from './SF';
import { center as SLCCenter, GeoJSON as SLCGeoJSON } from './SLC';
import { center as ATLCenter, GeoJSON as ATLGeoJSON } from './Atlanta';
import { center as BaltimoreCenter, GeoJSON as BaltimoreGeoJSON } from './Baltimore';
import { center as WashingtonDCCenter, GeoJSON as WashingtonDCGeoJSON } from './Washington_D.C.';
import { center as KansasCityCenter, GeoJSON as KansasCityGeoJSON } from './Kansas_City';
import { center as MinneapolisCenter, GeoJSON as MinneapolisGeoJSON } from './Minneapolis';
import { center as PhoenixCenter, GeoJSON as PhoenixGeoJSON } from './Phoenix';
import { center as BostonCenter, GeoJSON as BostonGeoJSON } from './Boston';
import { center as BeaumontCenter, GeoJSON as BeaumontGeoJSON } from './Beaumont_Texas';
import { center as DallasCenter, GeoJSON as DallasGeoJSON } from './Dallas';
import { center as DenverCenter, GeoJSON as DenverGeoJSON } from './Denver';
import { center as PittsburghCenter, GeoJSON as PittsburghGeoJSON } from './Pittsburgh';
import { center as PhiladelphiaCenter, GeoJSON as PhiladelphiaGeoJSON } from './Philadelphia';

// List of urban regions available in this dashboard
export const AVAILABLE_REGIONS = [
    "Los Angeles",
    "New York",
    "San Francisco",
    "Indianapolis",
    "Chicago",
    "Salt Lake City",
    "Baltimore",
    "Atlanta",
    "Washington D.C.",
    "Kansas City",
    "Minneapolis",
    "Phoenix",
    "Boston",
    "Beaumont",
    "Dallas",
    "Denver",
    "Pittsburgh",
    "Philadelphia"
]

export const URBAN_REGIONS = [
    {
        name: "Indianapolis",
        center: INCenter,
        geojson: INGeoJSON
    },
    {
        name: "Los Angeles",
        center: LACenter,
        geojson: LAGeoJSON
    },
    {
        name: "New York",
        center: NYCenter,
        geojson: NYGeoJSON
    },
    {
        name: "San Francisco",
        center: SFCenter,
        geojson: SFGeoJSON
    },
    {
        name: "Salt Lake City",
        center: SLCCenter,
        geojson: SLCGeoJSON
    },
    {
        name: "Chicago",
        center: CHICenter,
        geojson: CHIGeoJSON
    },
    {
        name: "Atlanta",
        center: ATLCenter,
        geojson: ATLGeoJSON
    },
    {
        name: "Baltimore",
        center: BaltimoreCenter,
        geojson: BaltimoreGeoJSON
    },

    {
        name: "Washington D.C.",
        center: WashingtonDCCenter,
        geojson: WashingtonDCGeoJSON
    },
    {
        name: "Kansas City",
        center: KansasCityCenter,
        geojson: KansasCityGeoJSON
    },
    {
        name: "Minneapolis",
        center: MinneapolisCenter,
        geojson: MinneapolisGeoJSON
    },
    {
        name: "Phoenix",
        center: PhoenixCenter,
        geojson: PhoenixGeoJSON
    },
    {
        name: "Boston",
        center: BostonCenter,
        geojson: BostonGeoJSON
    },
    {
        name: "Beaumont",
        center: BeaumontCenter,
        geojson: BeaumontGeoJSON
    },
    {
        name: "Dallas",
        center: DallasCenter,
        geojson: DallasGeoJSON
    },
    {
        name: "Denver",
        center: DenverCenter,
        geojson: DenverGeoJSON
    },
    {
        name: "Pittsburgh",
        center: PittsburghCenter,
        geojson: PittsburghGeoJSON
    },
    {
        name: "Philadelphia",
        center: PhiladelphiaCenter,
        geojson: PhiladelphiaGeoJSON
    }
]

