import { useState, useRef, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { TrieSearch } from "../../services/trieSearch";

export function Search({ ids, handleSelectedPlume, updateFilteredSelectedPlumeAfterSearch }) {
    const trieSearch = useRef(null);
    const [ searchOptions, setSearchOptions ] = useState([]);

    const handleSearch = (prefix) => {
        const searchResult = trieSearch.current.getRecommendations(prefix);
        return searchResult;
    }

    const handleOnInputTextChange = (event) => {
        const text = event.target.value;
        const searchResults = handleSearch(text);
        setSearchOptions(searchResults);
    }

    const handleOnOptionClicked = (event, clickedValue) => {
        handleSelectedPlume(clickedValue);
        updateFilteredSelectedPlumeAfterSearch(clickedValue);
    }

    useEffect(() => {
        trieSearch.current = new TrieSearch();
        // id in ids are expected to be _ separated for better search result.
        if (ids && ids.length) trieSearch.current.addItems(ids);
    }, [ids]);

    return (
        <Autocomplete
            freeSolo
            id="free-solo-2-demo"
            disableClearable
            options={searchOptions}
            style={{width: "100%"}}
            renderInput={(params) => (
                <TextField 
                    {...params}
                    id="outlined-basic"
                    label="Search by Plume ID"
                    variant="outlined"
                    style={{width: "100%"}}
                    onChange={handleOnInputTextChange}
                />          
            )}
            onChange={handleOnOptionClicked}
        />
    );
}
