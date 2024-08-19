export const dataPreprocess = (collections, agency, ghg, dataCategory, region, sitecode) => {
    // filter the stations that belong with respect to the query params
    let nistCollection = collections.map((collection) => {
    if (collection && collection.id &&
        collection.id.includes(agency) && collection.id.includes(ghg) &&
        collection.id.includes(dataCategory) && collection.id.includes(region)
        ) {
        let bbox = collection["extent"]["spatial"]["bbox"][0];
        collection["location"] = [bbox[0], bbox[1]];
        return collection;
    }
    }).filter(elem => elem);
    // format data such that it has [lon, lat]
    return nistCollection;
}