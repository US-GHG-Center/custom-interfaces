import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Dashboard } from '../dashboard/index.jsx';
import { fetchAllFromSTACAPI } from "../../services/api";
import { dataTransformationPlume, dataTransformationPlumeRegion, dataTransformationPlumeMeta, dataTransformationPlumeRegionMeta, metaDatetimeFix } from './helper/dataTransform';
import { PlumeMetas } from '../../assets/dataset/metadata.ts';

export function DashboardContainer() {
    // get the query params
    const [ searchParams ] = useSearchParams();
    const [ zoomLocation, setZoomLocation ] = useState (searchParams.get('zoom-location') || []); // let default zoom location be controlled by map component
    const [ zoomLevel, setZoomLevel ] = useState (searchParams.get('zoom-level') || null); // let default zoom level be controlled by map component
    const [ collectionId ] = useState(searchParams.get("collection-id") || "goes-ch4plume-v1");

    const [ collectionItems, setCollectionItems ] = useState([]);
    const [ collectionMeta, setCollectionMeta ] = useState({});
    const dataTree = useRef(null);
    const [ metaDataTree, setMetaDataTree ] = useState({});
    const [ plumeMetaData, setPlumeMetaData ] = useState({});

    const [ loadingData, setLoadingData ] = useState(true);

    useEffect(() => {
        setLoadingData(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        let plumeMetaMap = {};
        let plumeRegionMetaMap = {};
        try {
            // DataTransformation for the plumesMeta
            plumeMetaMap = dataTransformationPlumeMeta(PlumeMetas);
            plumeRegionMetaMap = dataTransformationPlumeRegionMeta(plumeMetaMap);
            setMetaDataTree(plumeRegionMetaMap);
            setPlumeMetaData(plumeMetaMap);
        } catch (error) {
            console.error('Error Transforming metadata');
        }

        const fetchData = async () => {
            try {
                // fetch in the collection from the features api
                const collectionUrl = `${process.env.REACT_APP_STAC_API_URL}/collections/${collectionId}`;
                // use this url to find out the data frequency of the collection
                // store to a state. 
                fetch(collectionUrl).then(async metaData => {
                    const metadataJSON = await metaData.json();
                    setCollectionMeta(metadataJSON)
                }).catch(err => console.error("Error fetching data: ", err)); 
                // get all the collection items
                const collectionItemUrl = `${process.env.REACT_APP_STAC_API_URL}/collections/${collectionId}/items`;
                const data = await fetchAllFromSTACAPI(collectionItemUrl);
                setCollectionItems(data)
                // use the lon and lat in the fetched data from the metadata.
                const plumeMap = dataTransformationPlume(data, plumeMetaMap);
                const plumeRegionMap = dataTransformationPlumeRegion(plumeMap);
                dataTree.current = plumeRegionMap;
                // update the datetime in metadata via fetched data.
                const updatedPlumeMetaMap = metaDatetimeFix(plumeMetaMap, plumeMap);
                setPlumeMetaData(updatedPlumeMetaMap);
                // remove loading
                setLoadingData(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData().catch(console.error);
    }, []); // only on initial mount

    return (
        <Dashboard
            data={collectionItems}
            zoomLocation={zoomLocation}
            zoomLevel={zoomLevel}
            setZoomLocation={setZoomLocation}
            setZoomLevel={setZoomLevel}
            dataTree={dataTree}
            metaDataTree={metaDataTree}
            plumeMetaData={plumeMetaData}
            collectionId={collectionId}
            loadingData={loadingData}
        />
    );
}
