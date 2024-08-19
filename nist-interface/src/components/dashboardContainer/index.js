import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Dashboard } from '../dashboard';
import { dataPreprocess } from './helper';

export function DashboardContainer() {
    const [ selectedStationId, setSelectedStationId ] = useState("");
    const [ NISTStations, setNISTStations ] = useState([]);

    // get the query params
    const [ searchParams ] = useSearchParams();
    const agency = searchParams.get('agency') || ""; // nist, noaa, or nasa
    const dataCategory = searchParams.get('data-category') || ""; // testbed
    const region = searchParams.get('region') || ""; // lam or nec
    const ghg = searchParams.get('ghg') || ""; // co2 or ch4
    const stationCode = searchParams.get('station_code') || ""; // buc, smt, etc

    useEffect(() => {
        const fetchStationData = async () => {
            try {
                // fetch in the collection from the features api
                const response = await fetch('https://dev.ghg.center/api/features/collections');
                if (!response.ok) {
                    throw new Error('Error in Network');
                }
                const result = await response.json();
                const stations = dataPreprocess(result.collections, agency, ghg, dataCategory, region);
                setNISTStations(stations);
                // then plot the NIST stations on the map
                // if station_code is also present, set the selectedStationId state, and let it react!!
                if (stationCode) {
                    let stationCodeLowerCase = stationCode.toLowerCase();
                    // find the collection id for that station code and then set the selectedStationId
                    let collectionId = stations.find(station => station.id.includes(stationCodeLowerCase)).id;
                    if (collectionId) setSelectedStationId(collectionId);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchStationData().catch(console.error);
    }, []);

    return (
        <Dashboard NISTStations={NISTStations} selectedStationId={selectedStationId} setSelectedStationId={setSelectedStationId} />
    );
}