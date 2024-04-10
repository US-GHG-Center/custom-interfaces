import { GHG } from '../../enumeration.js';

export const getDatasets = (data, selectedGhg) => {
    return [
        {
        label: `Observed ${GHG[selectedGhg].short} Concentration`,
        data: data.map((item) => item.value),
        borderColor: "#440154",
        borderWidth: 2,
        spanGaps: true,
        // fill: false,
        // pointRadius: 0, // Remove the points
        showLine: false,
        hoverBorderWidth: 3,
        pointHoverBackgroundColor: "#440154", // Set hover background color to red
        pointHoverBorderColor: "#FFFFFF", // Set hover border color to red
        },
        {
            type: "line",
            label: `Observed ${GHG[selectedGhg].short} Concentration`,
            data: data.map((item) => item.value),
            fill: false,
            borderColor: "#ff0000",
            tension: 0.1,
            borderWidth: 2,
            hoverBorderWidth: 3,
            pointHoverBackgroundColor: "#440154", // Set hover background color to red
            pointHoverBorderColor: "#FFFFFF", // Set hover border color to red
        },
    ]
}