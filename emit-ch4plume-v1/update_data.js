// import fs
const fs = require("fs");
const COMBINED_METADATA_ENDPOINT = "https://earth.jpl.nasa.gov/emit-mmgis-lb/Missions/EMIT/Layers/coverage/combined_plume_metadata.json";
const STAC_ENDPOINT = "https://earth.gov/ghgcenter/api/stac/collections/emit-ch4plume-v1/items?limit=500";
const LAT_LON_TO_COUNTRY_ENDPOINT = "https://api.geoapify.com/v1/geocode/reverse"; //?lat=33.81&lon=-101.92&format=json"
const APIKEY = process.env.GEOAPIFY_APIKEY;
const COVERAGE_FILE_URL = "https://earth.jpl.nasa.gov/emit-mmgis/Missions/EMIT/Layers/coverage/coverage_pub.json";
var lon_lat_lookup = {};

const get_methane_geojson = async () => {
    var there_is_more_data = true;
    var endpoint = STAC_ENDPOINT;
    var methane_stac_geojson;
    var items = {};
    while (there_is_more_data) {
        methane_stac_geojson = await (await fetch(endpoint)).json();
        const stac_features = methane_stac_geojson.features
        stac_features.forEach(feature => {
            items[`${feature.id}.tif`] = {
                id: feature.id,
                bbox: feature.bbox
            }
        });
        let links = methane_stac_geojson.links;
        for (const link of links) {
            there_is_more_data = false;
            if (link.rel === "next") {
                there_is_more_data = true;
                endpoint = link.href;
                break;
            }
        }
    }
    return items
}

async function fetchAndProcessCoverage() {
    try {
        const response = await fetch(COVERAGE_FILE_URL);
        const coverageData = await response.json();

        const roundCoordinates = (geometry) => {
            if (geometry && geometry.coordinates) {
                geometry.coordinates = geometry.coordinates.map(polygon =>
                    polygon.map(coord =>
                        coord.map(value => Math.round(value * 100) / 100)// Round to 2 decimal places
                    )
                );
            }
            return geometry;
        };

        // Build a valid GeoJSON object
        const processedCoverage = {
            "type": "FeatureCollection",
            "features": coverageData.features.map(feature => ({
                "properties":{
                    "start_time": feature.properties["start_time"]
                },
                "geometry": roundCoordinates(feature.geometry)
            }))
        };

        fs.writeFileSync("./data/coverage_data.json", JSON.stringify(processedCoverage, null, 2));
        console.log("Coverage data saved successfully.");
    } catch (error) {
        console.error("Error fetching or processing coverage data:", error);
    }
}

async function similarrity_location_lookup(lat, lon) {
    let floor_lat = Number(lat.toFixed(1));
    let floor_lon = Number(lon.toFixed(1));
    let location = ""
    if (lon_lat_lookup[`${floor_lat}-${floor_lon}`] == undefined) {
        try {
            const response = await fetch(`${LAT_LON_TO_COUNTRY_ENDPOINT}?lat=${lat}&lon=${lon}&&apiKey=${APIKEY}`);
            const location_data = await response.json();
            let location_prpoperties = location_data.features[0].properties;
            let sub_location = location_prpoperties["city"] || location_prpoperties["county"] || "Unknown";
            let state = location_prpoperties["state"] ? `${location_prpoperties["state"]}, ` : ""
            location = `${sub_location}, ${state}${location_prpoperties["country"]}`;
            console.log("Sleeping some seconds");
            await sleep(250);
        } catch (error) {
            console.error(`Error fetching location for ${lat}, ${lon}:`, error);
            location = "Unknown";
        }
        lon_lat_lookup[`${floor_lat}-${floor_lon}`] = location
    }
    return location;
}

async function processFeatures(features) {
    const lookup_location = require('./lookups/plume_id_location.json');
    var change_lookup = false;
    for (const feature of features) {
        const lat = feature.properties["Latitude of max concentration"];
        const lon = feature.properties["Longitude of max concentration"];
        if (lookup_location[feature.properties['Plume ID']] != undefined) {
            feature.properties["Location"] = lookup_location[feature.properties['Plume ID']]
        } else {
            feature.properties["Location"] = await similarrity_location_lookup(lat, lon);
            lookup_location[feature.properties['Plume ID']] = feature.properties["Location"];
            change_lookup = true;
        }
    }
    if (change_lookup) {
        fs.writeFileSync("./lookups/plume_id_location.json", JSON.stringify(lookup_location, null, 2));
    }
    return features
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    // fetch data from the stac endpoint
    const methane_stac_data = await (await fetch(COMBINED_METADATA_ENDPOINT)).json();
    // Write the data to a file
    // Remove "crs" field
    delete methane_stac_data.crs;
    // Remove "style" field from each feature
    methane_stac_data.features.forEach(feature => {
        delete feature.properties.style;
        delete feature.properties.plume_complex_count;
        delete feature.properties.map_endtime;
        delete feature.properties.DCID;
        delete feature.properties["DAAC Scene Numbers"];
    });
    methane_stac_data.features = await processFeatures(methane_stac_data.features);
    fs.writeFileSync("./data/combined_plume_metadata.json", JSON.stringify(methane_stac_data, null, 2));
    // fetch data from https://ghg.center/api/stac/collections/emit-ch4plume-v1/items?limit=1000
    const methane_stac_geojson = await get_methane_geojson();
    // Write the data to a file
    fs.writeFileSync("./data/methane_stac.geojson", JSON.stringify(methane_stac_geojson, null, 2));
    // Download and process the coverage file
    await fetchAndProcessCoverage();
}
main()

