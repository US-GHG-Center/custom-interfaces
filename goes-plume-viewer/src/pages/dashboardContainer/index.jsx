import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Dashboard } from '../dashboard/index.jsx';
import { fetchAllFromSTACAPI } from "../../services/api";
import { dataTransformationPlume, dataTransformationPlumeRegion, dataTransformationPlumeMeta, dataTransformationPlumeRegionMeta } from './helper/dataTransform';
import { PlumeMetas } from '../../assets/dataset/metadata.ts';

export function DashboardContainer() {
    // get the query params
    const [ searchParams ] = useSearchParams();
    const [ zoomLevel, setZoomLevel ] = useState (searchParams.get('zoom-level') || []); // let default zoom level controlled by map component
    const [ collectionId ] = useState(searchParams.get("collection-id") || "goes-ch4-v1");

    const [ collectionItems, setCollectionItems ] = useState([]);
    const [ collectionMeta, setCollectionMeta ] = useState({});
    const [ dataTree, setDataTree ] = useState({});
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
            console.log('Error Transforming metadata');
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
                const plumeMap = dataTransformationPlume(data, plumeMetaMap);
                const plumeRegionMap = dataTransformationPlumeRegion(plumeMap);
                setDataTree(plumeRegionMap);
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
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            dataTree={dataTree}
            metaDataTree={metaDataTree}
            plumeMetaData={plumeMetaData}
            collectionId={collectionId}
            loadingData={loadingData}
        />
    );
}
