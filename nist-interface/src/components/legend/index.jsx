import React from 'react';
import "./index.css";

export function MapRegionLegend({ regions, markerStylesList }) {
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
                        let styleIdx = regions[region].index % markerStylesList.length;
                        let markerStyleClass = markerStylesList[styleIdx];
                        let { fullName } = regions[region];
                        return (
                            <div key={region} className="legend-element">
                                <div className={`${markerStyleClass}`}></div>
                                <span className="legend-text">{fullName}</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}