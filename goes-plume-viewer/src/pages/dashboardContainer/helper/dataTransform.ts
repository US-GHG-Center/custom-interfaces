import { PlumeRegion, Plume, SubDailyPlume, STACItem } from "../../../dataModel";

interface PlumeRegionMap {
    [key: string]: PlumeRegion;
}

interface PlumeMap {
    [key: string]: Plume;
}

type DataTree = PlumeRegionMap;

export function dataTransformation(data: STACItem[]): PlumeRegionMap { // TODO: return type should be DataTree(i.e. PlumeRegionMap)
    // format of FeatureCollection Id: <something>_<region>_<plumeid>_<datetime>
    // goes_ch4_<country>_<administrativeDivision>_<plumeSourceId>_<plumeId>_<datetime>
    const dataTree: DataTree = {};
    const plumeMap: PlumeMap = {};

    // sort by data by time
    const sortedData = data.sort((prev: STACItem, next: STACItem): number => {
        const prev_date = new Date(prev.properties.datetime).getTime();
        const next_date = new Date(next.properties.datetime).getTime();
        return prev_date - next_date;
    });

    // create a plumemap
    sortedData.forEach((item: STACItem) => {
        const itemId = item.id;
        const destructuredId = itemId.split("_");
        // goes-ch4_<country>_<administrativeDivision>_<plumeSourceId>_<plumeId>_<datetime>
        const [ _, country, administrativeDivision, region, plumeId, __ ] = destructuredId;
        const newPlumeId:string = `${country}_${administrativeDivision}_${region}_${plumeId}`;
        if (!(newPlumeId in plumeMap)) {
            const [lon, lat] = item.geometry.coordinates[0][0];
            const plume: Plume = {
                id: newPlumeId,
                region: region,
                representationalPlume: item,
                location: [lon, lat],
                startDate: item.properties.datetime,
                endDate: item.properties.datetime,
                subDailyPlumes: [],

            };
            plumeMap[newPlumeId] = plume;
        }
        plumeMap[newPlumeId].subDailyPlumes.push(item);
    });

    // create a data tree
    Object.keys(plumeMap).forEach(plumeId => {
        // datetime correction in the plume. Note: plumes are in sorted order (by datetime)
        const noOfSubDailyPlumes:number = plumeMap[plumeId].subDailyPlumes.length;
        const firstSubDailyPlume:SubDailyPlume = plumeMap[plumeId].subDailyPlumes[0];
        const lastSubDailyPlume:SubDailyPlume = plumeMap[plumeId].subDailyPlumes[noOfSubDailyPlumes - 1];
        plumeMap[plumeId].startDate = firstSubDailyPlume.properties.datetime;
        plumeMap[plumeId].endDate = lastSubDailyPlume.properties.datetime;
        // datetime correction end

        const plume = plumeMap[plumeId];
        const region = plume.region;

        if (!(region in dataTree)) {
            const plumeRegion: PlumeRegion = {
                id: region,
                location: plume.location,
                startDate: plume.startDate,
                endDate: plume.endDate,
                plumes: []
            }
            dataTree[region] = plumeRegion;
        }
        dataTree[region].plumes.push(plume);
        dataTree[region].endDate = plume.endDate; // to get realistic endDate for the PlumeRegion.
    });

    return dataTree;
}
