import { GHG, CONTINUOUS, NON_CONTINIOUS, FLASK, PFP, INSITU, SURFACE } from "../../enumeration.js";

/**
 * Constructs the data access source URL based on the provided station and query parameters.
 * @param {Object} station - The station object containing information about the station.
 * @param {Object} station.site_code - The station code.
 * @param {Object} queryParams - The query parameters.
 * @param {string} queryParams.ghg - The type of greenhouse gas.
 * @param {string} queryParams.frequency - The frequency of measurements.
 * @param {string} queryParams.type - The type of measurement.
 * @param {string} queryParams.medium - The medium of measurement.
 * @returns {string} The constructed data access source URL.
 */
export function constructDataAccessSourceUrl(station, queryParams) {
    let { ghg, frequency, type, medium } = queryParams;
    const { site_code: siteCode } = station;

    // default params construct
    const GMLBaseUrl = "https://gml.noaa.gov/dv/data/index.php"; // query params of GML is case sensitive
    const parameterName = `${GHG[ghg].long.replace(" ", "%2B")}`;
    const category = "Greenhouse Gases".replace(" ", "%2B");
    const default_queryParams = `category=${category}&parameter_name=${parameterName}`;

    // var declrn
    const hourly_averages = "Hourly Averages".replace(" ", "%2B");
    const discrete = "Discrete";

    // frequency can be empty. And
    /* frequency has the higher precedence/priority among other query params */
    if (frequency && frequency === CONTINUOUS) {
        // frequency = Hourly%2BAverages (for continuous)
        // will for sure have hourly data in continuous.
        let GMLQueryParams = `?site=${siteCode}&frequency=${hourly_averages}&${default_queryParams}`;
        let dataAccessUrl = GMLBaseUrl + GMLQueryParams;
        return dataAccessUrl;
    }
    if (frequency && frequency === NON_CONTINIOUS) {
        // frequency = Discrete
        let GMLQueryParams = `?site=${siteCode}&frequency=${discrete}&${default_queryParams}`;
        let dataAccessUrl = GMLBaseUrl + GMLQueryParams;
        return dataAccessUrl;
    }
    if (frequency) {
        let GMLQueryParams = `?site=${siteCode}&${default_queryParams}`;
        let dataAccessUrl = GMLBaseUrl + GMLQueryParams;
        return dataAccessUrl;
    }

    /* When no frequency, compute the following */
    if (type === INSITU) {
        // GML query param doesnot take medium (surface/tower) for Insitu
        let modType = "Insitu";
        let GMLQueryParams = `?site=${siteCode}&type=${modType}&${default_queryParams}`;
        let dataAccessUrl = GMLBaseUrl + GMLQueryParams;
        return dataAccessUrl;
    }

    if ((type === FLASK || type == PFP) && medium === SURFACE) {
        // GML query param takes <medium>+<type> as type for PFP and Flask
        let modType = `${capitalize(medium)} ${type.toUpperCase()}`.replace(" ", "%2B");
        let GMLQueryParams = `?site=${siteCode}&type=${modType}&${default_queryParams}`;
        let dataAccessUrl = GMLBaseUrl + GMLQueryParams;
        return dataAccessUrl;
    }

    return GMLBaseUrl;
}

// helper

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}