import { AVAILABLE_REGIONS } from "../../../assets/geojson";
import { CITY_CENTERS } from "../../../assets/geojson";

export const generateUrbanRegions = async () => {
    const URBAN_REGIONS_ARR = [];

    const fetchPromises = AVAILABLE_REGIONS.map(city => {
        //get file name
        const fileName = city.replace(/ /g, "_").replace(/\//g, "-") + ".json";

        return fetch(`${process.env.PUBLIC_URL}/data/cities/${fileName}`)
            .then(resp => resp.json())
            .then(geojson => {
                URBAN_REGIONS_ARR.push({
                    name: city,
                    geojson: geojson,
                    center: CITY_CENTERS[city]
                })
            }).catch(err => console.log(`error loading GEOJSON for ${city} : `, err));
    })

    await Promise.all(fetchPromises);
    return URBAN_REGIONS_ARR;
};
