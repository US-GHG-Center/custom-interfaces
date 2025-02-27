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
        CO2: 'CO₂',
        CH4: 'CH₄'
    };

    const REGION_ADDITIONAL_PREFIX = {
        IN: " - Penn State University"
    }

    const REGION_FULL_NAME = {
        NEC: "Northeast Corridor",
        LAM: "Los Angeles Megacity",
        IN: "Indianapolis"
    };

    let GHG = ghg.toUpperCase();
    let GHGFullName = GHG;
    if (GHG in GHG_FULL_NAME) {
        GHGFullName = GHG_FULL_NAME[GHG];
    }

    let regionPhrase = ""
    if (region && region.toUpperCase() in REGION_FULL_NAME) {
        regionPhrase = `${REGION_FULL_NAME[region.toUpperCase()]} `;
    } else {
        regionPhrase = `${region.toUpperCase()}`;
    }

    let regionPrefix = ""
    if (region && region.toUpperCase() in REGION_ADDITIONAL_PREFIX) {
        regionPrefix = `${REGION_ADDITIONAL_PREFIX[region.toUpperCase()]}`
    }

    let formedTitle = `${agency.toUpperCase()}${regionPrefix}: ${regionPhrase} ${GHGFullName} Concentration Measurements`;
    return formedTitle;
}