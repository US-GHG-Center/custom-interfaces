//function to format filepath according to city selection
const formatFilePath = (city) => {
    const formattedCity = city.replace('/', '-').replace(/\s+/g, '_');
    return `./data/gra2pes/${formattedCity}_2021_Month07_species_sectoral_breakdown_conservative.json`;
}

export const fetchGra2pesSectoralData = (city) => {
    const filePath = formatFilePath(city);

    return fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch data from ${filePath}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error("error fetching gra2pes sectoral emissions data", error)
            throw error;
        });
}
