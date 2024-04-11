import { GHG } from '../../enumeration.js';
import { instrumentsMapGraphs } from '../../utils/instrumentsMapGraphs.js';

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
        borderColor: "#green",
        pointHoverBackgroundColor: "#220154",
        pointHoverBorderColor: "#FFFFFF",
        borderWidth: 2,
        hoverBorderWidth: 3,
        spanGaps: true,
        showLine: true,
    },
    {
        type: "line",
        borderColor: "#blue",
        pointHoverBackgroundColor: "#220154",
        pointHoverBorderColor: "#FFFFFF",
        borderWidth: 2,
        hoverBorderWidth: 3,
        spanGaps: true,
        showLine: true,
    }
]

export const getDatasets = (datas, selectedGhg, type) => {
    let graphsDataSrc = instrumentsMapGraphs(selectedGhg)[type];
    return datas.map((data, idx) => {
        let chartStyle = chartStyles[idx];
        return {
                label: graphsDataSrc[idx].label,
                data: data.map(elem => ({x: elem.date, y: elem.value})),
                // data: data,
                // data: data.map((item) => item.value),
                ...chartStyle
            }
        }
    );
}