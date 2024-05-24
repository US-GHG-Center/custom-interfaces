// import fs
const fs = require("fs");

const COMBINED_METADATA_ENDPOINT = "https://earth.jpl.nasa.gov/emit-mmgis-lb/Missions/EMIT/Layers/coverage/combined_plume_metadata.json";
const STAC_ENDPOINT = "https://ghg.center/api/stac/collections/emit-ch4plume-v1/items?limit=500";

const get_methane_geojson = async () => {
var features = [];
var there_is_more_data = true;
var endpoint = STAC_ENDPOINT;
var methane_stac_geojson;
while (there_is_more_data) {

 methane_stac_geojson= await (
 await fetch(endpoint)
 ).json();

const slim_features = methane_stac_geojson.features.map(({ id, bbox }) => ({ id, bbox }));
features = features.concat(slim_features);
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

methane_stac_geojson.matched = methane_stac_geojson.context.matched
// deleting unecessary items
delete methane_stac_geojson.context;
delete methane_stac_geojson.type;
delete methane_stac_geojson.links;
methane_stac_geojson.features = features;
return methane_stac_geojson

}


async function main() {
// fetch data from the stac endpoint
const methane_stac_data = await (
  await fetch(COMBINED_METADATA_ENDPOINT)
  ).json();
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

fs.writeFileSync(
  "./data/combined_plume_metadata.json",
  JSON.stringify(methane_stac_data, null, 2)
  );


 // fetch data from https://ghg.center/api/stac/collections/emit-ch4plume-v1/items?limit=1000
 const methane_stac_geojson= await get_methane_geojson();

 // Write the data to a file
 fs.writeFileSync(
 "./data/methane_stac.geojson",
 JSON.stringify(methane_stac_geojson, null, 2)
 );

}

 main()


