import { Component } from 'react';
import Chart from 'chart.js/auto';
import Box from '@mui/material/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faRotateLeft, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { LoadingSpinner } from '../loading';
import { fetchAllFromFeaturesAPI } from "../../services/api";

import { plugin, options } from './config';
import { dataPreprocess, getYAxisLabel, getChangedGHGStationId, getStationCode, isChartZoomed, setInitialScaleLimits } from "./helper";
import './index.css';

const collectionItemURL = (collectionId) => {
  return `${process.env.REACT_APP_FEATURES_API_URL}/collections/${collectionId}/items?is_max_height_data=True`;
}

export class ConcentrationChart extends Component {
  constructor(props) {
    super(props);
    this.chart = null;
    this.initialScaleLimits = {};
    this.state = {
      showChartInstructions: true,
      chartDataIsLoading: false,
      dataAccessLink: "",
    };
    this.dataPreprocess = dataPreprocess;
    this.getYAxisLabel = getYAxisLabel;
    this.getChangedGHGStationId = getChangedGHGStationId;
    this.getStationCode = getStationCode;
    this.isChartZoomed = isChartZoomed;
  }

  componentDidMount() {
    this.initializeChart();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.selectedStationId !== prevProps.selectedStationId || this.props.ghg !== prevProps.ghg) {
      // clean previous chart data
      if (this.chart) {
        this.chart.data.labels = [];
        this.chart.data.datasets[0].data = [];
        this.chart.update();
      }

      this.prepareChart();
    }
  }

  initializeChart = () => {
    if (this.chart) {
      // a fresh start
      this.chart.destroy();
    }

    // TODO: take the ghg label and unit from the collection item properties instead.
    let dataPointLabel = this.getYAxisLabel(this.props.ghg);
    let dataset = {
      labels: [],
      datasets: [
        {
          label: dataPointLabel,
          data: [],
          borderColor: "#ff6384",
          yAxisID: 'y',
          showLine: false
        }
      ]
    };

    this.chart = new Chart(this.chartCanvas, {
      type: 'line',
      data: dataset,
      options: options,
      plugins: [plugin]
    });

    this.chart.options.scales.y.title.text = dataPointLabel;
    this.chart.options.plugins.zoom.zoom.onZoom = () => {
      this.setState({showChartInstructions: false});
    }
    this.chart.options.plugins.zoom.zoom.onZoomComplete = () => {
      // check if the zoom level of the chart is default and based on that enable or disable the tooltip
      this.chart.options.plugins.tooltip.enabled = this.isChartZoomed(this.chart, this.initialScaleLimits);
    }

    this.prepareChart();
  }

  prepareChart = () => {
    let currentStationId = this.getChangedGHGStationId(this.props.selectedStationId, this.props.ghg);
    this.setDataAccessLink(currentStationId);
    // Pre data fetch, change the title of the chart
    this.changeTitle(currentStationId);
    // fetch the data from the api and then initialize the chart.
    this.fetchStationData(currentStationId).then(data => {
      const { time, concentration } = data;
      // Post data fetch, check if the chart title needs to be modified (for race conditions when multiple stations are clicked).
      this.changeTitle(currentStationId);
      this.updateChart(concentration, time);
      this.setInitialScaleLimits();
    });
  }

  updateChart = (data, label) => {
    if (this.chart) {
      // first reset the zoom
      this.chart.resetZoom();
      this.chart.options.plugins.tooltip.enabled = false;

      let labelY = this.getYAxisLabel(this.props.ghg);
      this.chart.data.datasets[0].label = labelY;
      this.chart.options.scales.y.title.text = labelY;

      // update that value in the chart.
      this.chart.data.labels = label;
      this.chart.data.datasets[0].data = data;

      // update the chart
      this.chart.update();
    }
  }

  fetchStationData = async (stationId) => {
    try {
      let url = collectionItemURL(stationId);
      this.setState({chartDataIsLoading: true});
      let result = await fetchAllFromFeaturesAPI(url);
      const { time, concentration } = this.dataPreprocess(result);
      this.setState({chartDataIsLoading: false});
      return { time, concentration };
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  changeTitle = (stationId) => {
    const stationCode = this.getStationCode(stationId);
    const stationProperties = this.props.stationMetadata[stationCode];
    let { station_name: stationName, city, state } = stationProperties;

    if (stationName && stationName.includes(city)) {
      this.chart.options.plugins.title.text = ` ${stationName}, ${state} (${stationCode})`;
      this.chart.update();
      return;
    }
    if (stationName) {
      this.chart.options.plugins.title.text = ` ${stationName}, ${city}, ${state} (${stationCode})`;
      this.chart.update();
      return;
    }
  }

  setDataAccessLink = (stationId) => {
    const stationCode = this.getStationCode(stationId);
    const stationProperties = this.props.stationMetadata[stationCode];
    const { data_link: dataLink } = stationProperties;
    this.setState({dataAccessLink: dataLink});
  }

  handleRefresh = () => {
    if (this.chart) {
      this.chart.resetZoom();
      this.chart.options.plugins.tooltip.enabled = false;
    }
  };

  handleClose = () => {
    this.handleRefresh(); // reset the zoom level else, next chart instance wont be able to.
    this.props.setDisplayChart(false);
  };

  setInitialScaleLimits = () => {
    // Store initial scale limits
    this.initialScaleLimits.x = {
      min: this.chart.scales["x"].min,
      max: this.chart.scales["x"].max,
    };

    this.initialScaleLimits.y = {
      min: this.chart.scales["y"].min,
      max: this.chart.scales["y"].max,
    };
  };

  render() {
    return (
      <Box id="chart-box" style={this.props.style}>
          <div id="chart-container" style={{width: "100%", height:"100%"}}>
            <div id="chart-tools">
              <div id="chart-tools-left">
                <div id="chart-instructions-container">
                  <div className="icon-and-instructions">
                    <FontAwesomeIcon
                      icon={faCircleInfo}
                      // style={{margin: "12px"}}
                      onMouseEnter={() => this.setState({showChartInstructions: true})}
                      onMouseLeave={() => this.setState({showChartInstructions: false})}
                    />
                    {this.state.showChartInstructions && <div id="chart-instructions">
                      <p>1. Click and drag, scroll or pinch on the chart to zoom in.</p>
                      <p>2. Hover over data points when zoomed in to see the values.</p>
                      <p>3. Click on the rectangle boxes on the side to toggle chart.</p>
                    </div>
                    }
                  </div>
                </div>
              </div>
              <div id="chart-tools-right">
                { this.state.dataAccessLink && <a id="data-access-link" href={this.state.dataAccessLink} target="_blank" rel='noreferrer'>Data Access Link ↗</a> }
                <div id="chart-controls">
                  <FontAwesomeIcon id="zoom-reset-button" icon={faRotateLeft} title="Reset Zoom" onClick={this.handleRefresh}/>
                  <FontAwesomeIcon id="chart-close-button" icon={faXmark} title="Close" onClick={this.handleClose}/>
                </div>
              </div>
            </div>
            {
              this.state.chartDataIsLoading && <LoadingSpinner />
            }
            <canvas
              id = "chart"
              className='fullWidth'
              style={{width: "100%", height: "100%"}}
              ref={chartCanvas => (this.chartCanvas = chartCanvas)}
            />
          </div>
      </Box>
    );
  }
}