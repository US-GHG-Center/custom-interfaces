import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Dashboard } from '../dashboard';
import { dataPreprocess } from './helper';

export function DashboardContainer() {
    const [ selectedStationId, setSelectedStationId ] = useState("");
    const [ stations, setStations ] = useState([]);

    // get the query params
    const [ searchParams ] = useSearchParams();
    const [ agency ] = useState(searchParams.get('agency') || "nist"); // nist, noaa, or nasa
    const [ dataCategory ] = useState(searchParams.get('data-category') || ""); // testbed
    const [ region ] = useState(searchParams.get('region') || ""); // lam or nec
    const [ ghg ] = useState(searchParams.get('ghg') || "co2"); // co2 or ch4
    const [ stationCode ] = useState(searchParams.get('station_code') || ""); // buc, smt, etc

    useEffect(() => {
        const fetchStationData = async () => {
            try {
                // fetch in the collection from the features api
                const response = await fetch(`${process.env.REACT_APP_FEATURES_API_URL}/collections?limit=1000`);
                if (!response.ok) {
                    throw new Error('Error in Network');
                }
                const result = await response.json();
                const filteredStations = dataPreprocess(result.collections, agency, ghg, dataCategory, region);
                setStations(filteredStations);
                // then plot the filteredStations on the map
                // if station_code is also present, set the selectedStationId state, and let it react!!
                if (stationCode) {
                    let stationCodeLowerCase = stationCode.toLowerCase();
                    // find the collection id for that station code and then set the selectedStationId
                    let collection = filteredStations.find(station => station.id.includes(stationCodeLowerCase));
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
            setSelectedStationId={setSelectedStationId}
            ghg={ghg}
            agency={agency}
            region={region}
            stationCode={stationCode}
        />
    );
}