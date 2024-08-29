import React from 'react';
import "./index.css";

const RegionFullNameDict = {
    IN: "Indianapolis (IN)",
    LAM: "Los Angeles Megacity (LAM)",
    NEC: "North East Corridor (NEC)"
}

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
                        let styleIdx = regions[region] % markerStylesList.length;
                        let markerStyleClass = markerStylesList[styleIdx];
                        return (
                            <div key={region} className="legend-element">
                                <div className={`${markerStyleClass}`}></div>
                                <span className="legend-text">{RegionFullNameDict[region.toUpperCase()]}</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}