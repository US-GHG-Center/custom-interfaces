import React from 'react';
import { getMarkerColor, getMarkerSVGComponent } from "../../utils";
import "./index.css";

export function MapRegionLegend({ regions }) {
    const regionsKeys = Object.keys(regions);
    if (regionsKeys.length < 2) {
        return null;
    }

    return (
        <div id="legend-container">
            <div id="legend">
                <div id="legend-head">Urban Test Bed Sites</div>
                <div id="legend-line"></div>
                {   regionsKeys.map((region) => {
                        let { fullName } = regions[region];
                        let markerColor = getMarkerColor(regions[region].index);
                        let marker = getMarkerSVGComponent(markerColor);
                        return (
                            <div key={region} className="legend-element">
                                <div className='marker'>
                                    {marker}
                                </div>
                                <span className="legend-text">{fullName}</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}