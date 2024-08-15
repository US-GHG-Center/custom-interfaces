import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { MapBoxViewer } from '../mapboxViewer';
import { Title } from '../title';
import { ConcentrationChart } from '../chart';

export function Dashboard() {
  const [ selectedStationId, setSelectedStationId ] = useState("");
  const [ NISTStations, setNISTStations ] = useState([]);

  const dataPreprocess = (collections) => {
    // filter the stations that belong to NIST
    let nistCollection = collections.map((collection) => {
      if (collection && collection.id && collection.id.includes("nist") && collection.id.includes("co2")) {
        let bbox = collection["extent"]["spatial"]["bbox"][0];
        collection["location"] = [bbox[0], bbox[1]];
        return collection;
      }
    }).filter(elem => elem);
    // format data such that it has [lon, lat]
    return nistCollection;
  }

  useEffect(() => {
    // Define an asynchronous function to fetch data
    const fetchStationData = async () => {
      try {
        // fetch in the collection from the features api
        const response = await fetch('https://dev.ghg.center/api/features/collections');
        if (!response.ok) {
          throw new Error('Error in Network');
        }
        const result = await response.json();
        const stations = dataPreprocess(result.collections);
        setNISTStations(stations);
        // plot the NIST stations on the map
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchStationData(); // Call the fetch function
  }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    <Box className="fullSize">
        <Title selection={selectedStationId}/>
        <MapBoxViewer stations={NISTStations} setSelection={setSelectedStationId}/>
        {selectedStationId && <ConcentrationChart selectedStationId={selectedStationId}/>}
    </Box>
  );
}