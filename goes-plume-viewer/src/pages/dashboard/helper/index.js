export function extractRepPlumes(dataTree) {
    // get list of items to plot.
    const plots = []
        Object.keys(dataTree).forEach(plumesId => {
            // plumeIds: [lon, lat]
            const representingPlume = dataTree[plumesId][0];
            const [lon1, lat1, _, __] = representingPlume.bbox;
            plots.push({
                plumeId: plumesId,
                location: [lon1, lat1],
                data: representingPlume,
                datetime: representingPlume.properties.datetime
            });
        });
    return plots;
}

export function getRepPlume(repPlumeId, dataTree) {
    const representingPlume = dataTree[repPlumeId][0];
    const [lon1, lat1, _, __] = representingPlume.bbox;
    return {
        plumeId: repPlumeId,
        location: [lon1, lat1],
        data: representingPlume,
        datetime: representingPlume.properties.datetime
    };
}
