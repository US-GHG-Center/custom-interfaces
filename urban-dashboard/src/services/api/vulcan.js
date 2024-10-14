/*
Uses local JSON files to read data from. 
TODO: move this data to and use api to fetch data from features API
*/

//function to format filepath according to city selection
const formatFilePath = (city) => {
    const formattedCity = city.replace('/', '-').replace(/\s+/g, '_');
    return `./data/vulcan/${formattedCity}_PLACE_AggregatedSectors_2013_2021.json`;
}

export const fetchVulcanSectoralData = async (city) => {
    const filePath = formatFilePath(city);

    return fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch data from ${filePath}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error("error fetching vulcan sectoral emissions data", error)
            throw error;
        });

};
