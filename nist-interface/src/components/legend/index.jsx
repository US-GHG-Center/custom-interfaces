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
                <div id="legend-head">Legend</div>
                <div id="legend-line"></div>
                {   regionsKeys.map((region) => {
                        let styleIdx = regions[region] % markerStylesList.length;
                        let markerStyleClass = markerStylesList[styleIdx];
                        return (
                            <div key={region} className="legend-element">
                                <div className={`${markerStyleClass}`}></div>
                                <span className="legend-text">{region.toUpperCase()}</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}