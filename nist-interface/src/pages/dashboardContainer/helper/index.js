export const dataPreprocess = (collections, agency, ghg, dataCategory, region, sitecode) => {
    // filter the stations that belong with respect to the query params
    let nistCollection = collections.map((collection) => {
    if (collection && collection.id &&
        collection.id.includes(agency) && collection.id.includes(ghg) &&
        collection.id.includes(dataCategory) && collection.id.includes(region)
        ) {
        let bbox = collection["extent"]["spatial"]["bbox"][0];
        collection["location"] = [bbox[0], bbox[1]];
        // Add in additional meta properties to the station collection
        // TODO: remove later after the functionality is implemented in Features API directly.
        collection["properties"] = extractCollectionMeta(collection);
        return collection;
    }
    }).filter(elem => elem);
    // format data such that it has [lon, lat]
    return nistCollection;
}

const extractCollectionMeta = (collection) => {
    let bbox = collection["extent"]["spatial"]["bbox"][0];
    return {
        siteCode: collection.id.split("_")[3],
        siteName: "",
        siteCountry: "United States",
        latitude: bbox[1],
        longitude: bbox[0],
        elevation: 1100,
        elevationUnit: "m",
        instrumentType: "",
    }
}