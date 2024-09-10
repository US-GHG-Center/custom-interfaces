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
    'Baltimore',
    'Louisville/Jefferson County',
    'Memphis',
    'Las Vegas',
    'Detroit',
    'Portland',
    'Boston',
    'Oklahoma City',
    'El Paso',
    'Nashville-Davidson',
    'Washington',
    'Denver',
    'Seattle',
    'Charlotte',
    'San Francisco',
    'Indianapolis',
    'Columbus',
    'Fort Worth',
    'Jacksonville',
    'Austin',
    'San Jose',
    'Dallas',
    'San Diego',
    'San Antonio',
    'Phoenix',
    'Philadelphia',
    'Houston',
    'Chicago',
    'Los Angeles',
    'New York'
]

export const CITY_CENTERS = {
    'Baltimore': [-76.61219, 39.29038],
    'Louisville/Jefferson County': [-85.75846, 38.25285],
    'Memphis': [-90.04898, 35.14953],
    'Las Vegas': [-115.13983, 36.16994],
    'Detroit': [-83.04575, 42.33143],
    'Portland': [-122.67621, 45.52345],
    'Boston': [-71.05888, 42.36008],
    'Oklahoma City': [-97.51643, 35.46756],
    'El Paso': [-106.48502, 31.76188],
    'Nashville-Davidson': [-86.78160, 36.16266],
    'Washington': [-77.03687, 38.90720],
    'Denver': [-104.99025, 39.73915],
    'Seattle': [-122.33207, 47.60621],
    'Charlotte': [-80.84313, 35.22709],
    'San Francisco': [-122.41942, 37.77493],
    'Indianapolis': [-86.15804, 39.76838],
    'Columbus': [-82.99879, 39.96118],
    'Fort Worth': [-97.33076, 32.75549],
    'Jacksonville': [-81.65565, 30.33218],
    'Austin': [-97.74306, 30.26715],
    'San Jose': [-121.88633, 37.33821],
    'Dallas': [-96.79699, 32.77666],
    'San Diego': [-117.16109, 32.71573],
    'San Antonio': [-98.49363, 29.42412],
    'Phoenix': [-112.07404, 33.44838],
    'Philadelphia': [-75.16522, 39.95258],
    'Houston': [-95.36980, 29.76043],
    'Chicago': [-87.62980, 41.87811],
    'Los Angeles': [-118.24368, 34.05223],
    'New York': [-73.935242, 40.730610]
};

// const generateUrbanRegions = () => {
//     const URBAN_REGIONS_ARR = [];

//     AVAILABLE_REGIONS.forEach(city => {
//         //get file name
//         const fileName = city.replace(/ /g, "_").replace(/\//g, "-") + ".json";
//         fetch(`./data/cities/${fileName}`)
//             .then(resp => resp.json())
//             .then(geojson => {
//                 URBAN_REGIONS_ARR.push({
//                     name: city,
//                     geojson: geojson,
//                     center: CITY_CENTERS[city]
//                 })
//             }).catch(err => console.log("error loading GEOJSON for ${city} : ", err));

//     })

//     console.log("the urban regions are: ", URBAN_REGIONS_ARR)
//     return URBAN_REGIONS_ARR;
// }

// export const URBAN_REGIONS = generateUrbanRegions();


// export const URBAN_REGIONS = [
//     {
//         name: "Indianapolis",
//         center: INCenter,
//         geojson: INGeoJSON
//     },
//     {
//         name: "Los Angeles",
//         center: LACenter,
//         geojson: LAGeoJSON
//     },
//     {
//         name: "New York",
//         center: NYCenter,
//         geojson: NYGeoJSON
//     },
//     {
//         name: "San Francisco",
//         center: SFCenter,
//         geojson: SFGeoJSON
//     },
//     {
//         name: "Salt Lake City",
//         center: SLCCenter,
//         geojson: SLCGeoJSON
//     },
//     {
//         name: "Chicago",
//         center: CHICenter,
//         geojson: CHIGeoJSON
//     },
//     {
//         name: "Atlanta",
//         center: ATLCenter,
//         geojson: ATLGeoJSON
//     },
//     {
//         name: "Baltimore",
//         center: BaltimoreCenter,
//         geojson: BaltimoreGeoJSON
//     },

//     {
//         name: "Washington D.C.",
//         center: WashingtonDCCenter,
//         geojson: WashingtonDCGeoJSON
//     },
//     {
//         name: "Kansas City",
//         center: KansasCityCenter,
//         geojson: KansasCityGeoJSON
//     },
//     {
//         name: "Minneapolis",
//         center: MinneapolisCenter,
//         geojson: MinneapolisGeoJSON
//     },
//     {
//         name: "Phoenix",
//         center: PhoenixCenter,
//         geojson: PhoenixGeoJSON
//     },
//     {
//         name: "Boston",
//         center: BostonCenter,
//         geojson: BostonGeoJSON
//     },
//     {
//         name: "Beaumont",
//         center: BeaumontCenter,
//         geojson: BeaumontGeoJSON
//     },
//     {
//         name: "Dallas",
//         center: DallasCenter,
//         geojson: DallasGeoJSON
//     },
//     {
//         name: "Denver",
//         center: DenverCenter,
//         geojson: DenverGeoJSON
//     },
//     {
//         name: "Pittsburgh",
//         center: PittsburghCenter,
//         geojson: PittsburghGeoJSON
//     },
//     {
//         name: "Philadelphia",
//         center: PhiladelphiaCenter,
//         geojson: PhiladelphiaGeoJSON
//     }
// ]

