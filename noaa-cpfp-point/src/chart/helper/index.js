import { GHG } from '../../enumeration.js';

const chartStyles = [
    {
        type: "line",
        borderColor: "#440154",
        pointHoverBackgroundColor: "#440154",
        pointHoverBorderColor: "#FFFFFF",
        borderWidth: 2,
        hoverBorderWidth: 3,
        spanGaps: true,
        showLine: false,
    },
    {
        type: "line",
        borderColor: "#330154",
        borderColor: "red",
        pointHoverBackgroundColor: "#330154",
        pointHoverBorderColor: "#FFFFFF",
        borderWidth: 2,
        hoverBorderWidth: 3,
        spanGaps: true,
        showLine: true,
    },
    {
        type: "line",
        borderColor: "#220154",
        pointHoverBackgroundColor: "#220154",
        pointHoverBorderColor: "#FFFFFF",
        borderWidth: 2,
        hoverBorderWidth: 3,
        spanGaps: true,
        showLine: true,
    }
]

export const getDatasets = (datas, selectedGhg) => {
    return datas.map((data, idx) => {
        let chartStyle = chartStyles[idx];
        return {
                label: `Observed ${GHG[selectedGhg].short} Concentration`,
                data: data.map(elem => ({x: elem.date, y: elem.value})),
                // data: data,
                // data: data.map((item) => item.value),
                ...chartStyle
            }
        }
    );
}