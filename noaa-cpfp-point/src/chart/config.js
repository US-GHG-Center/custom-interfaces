import { GHG, ghgBlue} from '../enumeration.js';
import { updateZoomInstructions } from "./helper/zoomInstructions.js";

export const plugin = {
    id: "corsair",
    defaults: {
      width: 1,
      color: "#DEDEDE",
      dash: [
            1000,
            1000
        ],
    },
    afterInit: (chart, args, opts) => {
      chart.corsair = {
        x: 0,
        y: 0,
        };
    },
    afterEvent: (chart, args) => {
      const { inChartArea
        } = args;
      const { type, x, y
        } = args.event;
  
      chart.corsair = { x, y, draw: inChartArea
        };
      chart.draw();
    },
    beforeDatasetsDraw: (chart, args, opts) => {
      const { ctx
        } = chart;
      const { top, bottom, left, right
        } = chart.chartArea;
      const { x, y, draw
        } = chart.corsair;
      if (!draw) return;
  
      ctx.save();
  
      ctx.beginPath();
      ctx.lineWidth = opts.width;
      ctx.strokeStyle = opts.color;
      ctx.setLineDash(opts.dash);
      ctx.moveTo(x, bottom);
      ctx.lineTo(x, top);
      // ctx.moveTo(left, y)
        // ctx.lineTo(right, y)
      ctx.stroke();
  
      ctx.restore();
    },
};

/**
 * Generates options object for configuring the Chart.js chart based on the provided station and selected greenhouse gas.
 * @param {Object} station - The station object containing information about the station.
 * @param {string} selectedGhg - The selected greenhouse gas.
 * @returns {Object} The options object for configuring the Chart.js chart.
 */
export const getOptions = (station, selectedGhg)=> ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        intersect: false,
        mode: "nearest",
        axis: "x",
    },
    hover: {
        mode: "nearest",
        intersect: false,
    },
    scales: {
        x: {
        title: {
            display: true,
            text: "Observation Date/Time (UTC)",
            },
        grid: {
            display: false,
            drawOnChartArea: false,
            },
        type: "time",
        ticks: {
            autoSkip: true, // Enable automatic skip
            maxTicksLimit: 8, // Maximum number of ticks to display
                // callback: function(value) {
                //   return "fadhsdsf"
                // }
            },
        adapters: {
            date: {
                zone: "utc"
            }
        }
        },
        y: {
        title: {
            text: `${ GHG[selectedGhg
                    ].long
                } (${GHG[selectedGhg
                    ].short
                }) Concentration (${GHG[selectedGhg
                    ].unit
                })`,
            display: true,
            },
        },
    },
    plugins: {
        corsair: {
            // color: 'black',
        },
        zoom: {
        zoom: {
            wheel: {
            enabled: true,
                },
            pinch: {
            enabled: true,
                },
            drag: {
            enabled: true,
                },
            mode: "x",
            onZoom: (zoom) => {
                    // Handle zoom event here
                    // isChartZoomed = zoom.scales.x > 1; // Check if x-scale zoomed
            updateZoomInstructions(); // Call a function to update instructions
                },
            },
        },
        title: {
        display: true,
        text: `${station.name
            } (${station.code
            })`, // Add your chart title here
        padding: {
            top: 10,
            bottom: 20,
            },
        font: {
            size: 24,
            family: "Inter",
            },
        color: ghgBlue,
        },
        legend: {
        display: true,
        position: "top", // You can change the position to 'bottom', 'left', or 'right'
        },
        tooltip: {
        callbacks: {
            label: function (context) {
            let label = context.dataset.label || "";
            let splitText = label.split(":");
            return `${context.parsed.y
                    } : ${
                splitText[splitText.length - 1
                        ]
                    }`;
                },
            title: function (context) {
                let dateTime = context[0].label;
                return `${dateTime} (UTC)`;
            }
            },
        mode: "nearest",
        intersect: false,
        backgroundColor: "#FFFFFF",
        titleColor: "#000",
        bodyColor: "#000",
        titleFontSize: 16,
        titleFontColor: "#0066ff",
        bodyFontColor: "#000",
        bodyFontSize: 14,
        displayColors: true,
        cornerRadius: 5,
        borderColor: "#DEDEDE",
        borderWidth: 1,
        padding: 8,
        caretSize: 0,
        boxPadding: 3,
            // multiKeyBackground: ghgBlue
        },
    },
});