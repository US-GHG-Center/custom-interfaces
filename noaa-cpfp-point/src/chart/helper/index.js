/**
 * Styles for various types of charts.
 * @constant {Object[]} chartStyles - An array of objects containing styles for different types of charts.
 */
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
        borderColor: "green",
        pointHoverBackgroundColor: "#220154",
        pointHoverBorderColor: "#FFFFFF",
        borderWidth: 2,
        hoverBorderWidth: 3,
        spanGaps: true,
        showLine: true,
    },
    {
        type: "line",
        borderColor: "blue",
        pointHoverBackgroundColor: "#220154",
        pointHoverBorderColor: "#FFFFFF",
        borderWidth: 2,
        hoverBorderWidth: 3,
        spanGaps: true,
        showLine: true,
    }
]

/**
 * Generates datasets for the Chart.js chart based on the provided data and labels.
 * @param {Object[]} datas - An array of datasets containing time series data.
 * @param {string[]} graphsLabel - An array of data labels for the chart.
 * @returns {Object[]} An array of datasets formatted for Chart.js.
 */
export const getDatasets = (datas, graphsLabel) => {
    return datas.map((data, idx) => {
        let chartStyle = chartStyles[idx];
        return {
                label: graphsLabel[idx],
                data: data.map(elem => ({x: elem.date, y: elem.value})),
                // data: data,
                // data: data.map((item) => item.value),
                ...chartStyle
            }
        }
    );
}