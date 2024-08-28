import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Dashboard } from '../dashboard';
import { extractStationCollections, extractMetaData, getMetaDataDictionary } from './helper';
import { fetchAllFromFeaturesAPI } from "../../services/api";

export function DashboardContainer() {
    const [ selectedStationId, setSelectedStationId ] = useState("");
    const [ stations, setStations ] = useState([]);
    const [ stationMetadata, setStationMetadata ] = useState({});

    // get the query params
    const [ searchParams ] = useSearchParams();
    const [ agency ] = useState(searchParams.get('agency') || "nist"); // nist, noaa, or nasa
    const [ dataCategory ] = useState(searchParams.get('data-category') || ""); // testbed
    const [ region ] = useState(searchParams.get('region') || ""); // lam or nec
    const [ ghg, setSelectedGHG ] = useState(searchParams.get('ghg') || "co2"); // co2 or ch4
    const [ stationCode ] = useState(searchParams.get('station-code') || ""); // buc, smt, etc
    const [ zoomLevel ] = useState (searchParams.get('zoom-level')); // let default zoom level controlled by map component

    useEffect(() => {
        const fetchStationData = async () => {
            try {
                // fetch in the collection from the features api
                const url = `${process.env.REACT_APP_FEATURES_API_URL}/collections`;
                const collections = await fetchAllFromFeaturesAPI(url);
                const collectionsMetaData = await extractMetaData(collections);
                const metaDataDict = getMetaDataDictionary(collectionsMetaData);
                setStationMetadata(metaDataDict);
                const stationCollections = extractStationCollections(collections, metaDataDict, agency, ghg, dataCategory, region);
                setStations(stationCollections);
                // then plot the stationCollections on the map
                // if station_code is also present, set the selectedStationId state, and let it react!!
                if (stationCode) {
                    let stationCodeLowerCase = stationCode.toLowerCase();
                    // find the collection id for that station code and then set the selectedStationId
                    let collection = stationCollections.find(station => station.id.includes(stationCodeLowerCase));
                    if (collection) setSelectedStationId(collection.id);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchStationData().catch(console.error);
    }, []); // only on initial mount

    return (
        <Dashboard
            stations={stations}
            selectedStationId={selectedStationId}
            stationMetadata={stationMetadata}
            ghg={ghg}
            agency={agency}
            region={region}
            stationCode={stationCode}
            zoomLevel={zoomLevel}
            setSelectedStationId={setSelectedStationId}
            setSelectedGHG={setSelectedGHG}
        />
    );
}