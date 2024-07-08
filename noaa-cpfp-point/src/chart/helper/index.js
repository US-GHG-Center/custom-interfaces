/**
 * Styles for various types of charts.
 * @constant {Object[]} chartStyles - An array of objects containing styles for different types of charts.
 */
const chartStyles = [
    {
        type: "line",
        borderColor: "rgba(68, 1, 84, 0.7)", // egg plant color
        pointHoverBackgroundColor: "rgba(68, 1, 84, 1)",
        pointHoverBorderColor: "#FFFFFF",
        borderWidth: 2,
        hoverBorderWidth: 3,
        spanGaps: true,
        showLine: false,
    },
    {
        type: "line",
        borderColor: "rgba(255, 0, 0, 0.8)", // red
        pointHoverBackgroundColor: "rgba(255, 0, 0, 1)",
        pointHoverBorderColor: "#FFFFFF",
        borderWidth: 2,
        hoverBorderWidth: 3,
        spanGaps: true,
        showLine: true,
    },
    {
        type: "line",
        borderColor: "rgba(0, 128, 0, 1)", // green
        pointHoverBackgroundColor: "rgba(0, 128, 0, 1)",
        pointHoverBorderColor: "#FFFFFF",
        borderWidth: 2,
        hoverBorderWidth: 3,
        spanGaps: true,
        showLine: true,
    },
    {
        type: "line",
        borderColor: "blue",
        pointHoverBackgroundColor: "rgba(0, 20, 252, 0.8)", // blue
        pointHoverBorderColor: "rgba(0, 20, 252, 1)",
        borderWidth: 2,
        hoverBorderWidth: 3,
        spanGaps: true,
        showLine: true,
    },
    {
        type: "line",
        borderColor: "purple",
        pointHoverBackgroundColor: "rgba(226, 118, 255, 0.8)", // purple
        pointHoverBorderColor: "rgba(226, 118, 255, 1)",
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
export const getDatasets = (datas, graphsLabel, chartColors) => {
    console.log(":>>>>", chartColors)
    return datas.map((data, idx) => {
        let chartStyle = chartStyles[idx];
        if (chartColors[idx]) {
            chartStyle = {...chartStyle, borderColor: chartColors[idx]};
        }
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