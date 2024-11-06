
function handleSearch(keyword, markers) {
    let plumeIds = [];
    let searchResults = [];

    markers.forEach(marker => {
        const plumeId = `${marker.feature.properties["Plume ID"]} (${marker.feature.properties["Location"]})`;
        plumeIds.push(plumeId);
        
        // Store the relevant information in the searchResults array
        searchResults.push({
            displayText: plumeId,
            latitude: marker.feature.properties["Latitude of max concentration"],
            longitude: marker.feature.properties["Longitude of max concentration"],
            // Add other properties if needed
        });
    });

    plumeIds.sort((a, b) => {
        return getSimilarity(b, keyword) - getSimilarity(a, keyword);
    });

    plumeIds = plumeIds.filter(plume_id => {
        return getSimilarity(plume_id, keyword) > 0;
    });

    // Return both the IDs and the search results
    return searchResults.filter(result => plumeIds.includes(result.displayText));
}

function getSimilarity(data, keyword) {
    data = data.toLowerCase();
    keyword = keyword.toLowerCase();
    return data.length - data.replace(new RegExp(keyword, 'g'), '').length;
}

// Function to handle selection of a search item
function handleSelection(selectedItem, map, zoom_level) {
    // Optionally, set the selected item in the search box
    //document.getElementById("plume-id-search-input").value = selectedItem.displayText;

    // Clear search results after selection
    document.getElementById("plume-id-search-list").innerHTML = "";
    map.flyTo({
        center: [selectedItem.longitude, selectedItem.latitude], 
        zoom: zoom_level,
    });
}

// Function to update the search list with results
function updateSearchList(keyword, map, markers, zoom_level) {
    const searchList = document.getElementById("plume-id-search-list");
    searchList.innerHTML = ""; // Clear previous results

    // Get results from handleSearch
    const results = handleSearch(keyword, markers);

    if (results.length === 0) {
        // Show 'No results found' message if no matches
        const noResultItem = document.createElement("li");
        noResultItem.textContent = "No results found";
        noResultItem.className = "no-results";
        searchList.appendChild(noResultItem);
    } else {
        // Populate list with results and attach click listeners
        results.forEach(result => {
            const resultItem = document.createElement("li");
            resultItem.textContent = result.displayText;
            resultItem.className = "result-item";
            searchList.appendChild(resultItem);

            // Add click listener to each result item
            resultItem.addEventListener("click", () => handleSelection(result, map, zoom_level));
        });
    }
}


module.exports = {
    updateSearchList: updateSearchList
  };