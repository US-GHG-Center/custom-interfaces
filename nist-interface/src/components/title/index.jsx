import React from 'react';

import './index.css';

const GHG_FULL_NAME = {
    CO2: 'Carbon Dioxide',
    CH4: 'Methane'
};

export function Title ({ ghg, agency }) {
    let GHG = ghg.toUpperCase();
    let GHGFullName = GHG;
    if (GHG in GHG_FULL_NAME) {
        GHGFullName = GHG_FULL_NAME[GHG];
    }

    return (
        <div id="title">
            <strong>
                {agency.toUpperCase()}: {GHGFullName} Concentration Measurements
            </strong>
        </div>
    );
}