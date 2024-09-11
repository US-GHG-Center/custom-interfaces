import React from 'react';

import './index.css';

export function Title ({ ghg, agency, region, style }) {
    return (
        <div id="title" style={style}>
            <strong>
                {getTitle(agency, ghg, region)}
            </strong>
        </div>
    );
}

function getTitle(agency, ghg, region) {
    const GHG_FULL_NAME = {
        CO2: 'Carbon Dioxide',
        CH4: 'Methane'
    };

    let GHG = ghg.toUpperCase();
    let GHGFullName = GHG;
    if (GHG in GHG_FULL_NAME) {
        GHGFullName = GHG_FULL_NAME[GHG];
    }

    let regionPhrase = region ? `${region.toUpperCase()}:` : '';

    let formedTitle = `${agency.toUpperCase()}: ${regionPhrase} ${GHGFullName} Concentration Measurements`;
    return formedTitle;
}