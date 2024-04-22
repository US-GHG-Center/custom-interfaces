import { GHG, CO2, CONTINUOUS, NON_CONTINIOUS, TYPES, FLASK, PFP, INSITU, SURFACE, TOWER, ALL} from "../../enumeration.js";

/**
 * Generates a data source URL for Data Access, based on the specified parameters.
 * 
 * @param {string} [ghg="ch4"] - The greenhouse gas (GHG) type. Default is "ch4".
 * @param {string} [type="flask"] - The type of station. Default is "flask".
 * @param {string} siteCode - The code identifying the specific monitoring site.
 * @returns {string} - The data source URL for accessing the specified data.
 */
export function constructDataAccessSourceUrl(ghg="ch4", type="flask", siteCode) {
    // get the data source for access
    const dataSourceBaseUrl = "https://gml.noaa.gov/dv/data/index.php"
    let frequency = "Discrete";
    if (type == "insitu") {
        frequency="continuous"
    }
    const dataSourceQueryParams = `?type=${TYPES[type].long.replace(" ", "%2B")}&frequency=${frequency}&site=${siteCode}&amp;parameter_name=${GHG[ghg].long.replace(" ", "%2B")}`
    const dataSource = dataSourceBaseUrl + dataSourceQueryParams;
    return dataSource
}