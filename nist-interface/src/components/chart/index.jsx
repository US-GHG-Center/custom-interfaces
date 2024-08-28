import { Component } from 'react';
import Chart from 'chart.js/auto';
import Box from '@mui/material/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faRotateLeft, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { LoadingSpinner } from '../loading';
import { fetchAllFromFeaturesAPI } from "../../services/api";

import { plugin, options } from './helper';

import './index.css';

const collectionItemURL = (collectionId) => {
  return `${process.env.REACT_APP_FEATURES_API_URL}/collections/${collectionId}/items?is_max_height_data=True`;
}

export class ConcentrationChart extends Component {
  constructor(props) {
    super(props);
    this.chart = null;
    this.state = {
      showChartInstructions: true,
      chartDataIsLoading: false
    };
  }

  componentDidMount() {
    this.initializeChart();
  }

  componentDidUpdate(prevProps, prevState) {
    // when new props is received, initialize the chart with data.
    if (this.props.ghg !== prevProps.ghg) {
      let changedStationId = this.getChangedGHGStationId(this.props.selectedStationId, this.props.ghg);
      this.props.setSelectedStationId(changedStationId);
    }
    if (this.props.selectedStationId !== prevProps.selectedStationId) {
      // clean previous chart data
      if (this.chart) {
        this.chart.data.labels = [];
        this.chart.data.datasets[0].data = [];
        this.chart.update();
      }

      // fetch the data from the api and then initialize the chart.
      this.fetchStationData(this.props.selectedStationId).then(data => {
        const { time, concentration, stationMeta } = data;
        this.updateChart(concentration, time, stationMeta);
      });
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

    // fetch the data from the api and then initialize the chart.
    this.fetchStationData(this.props.selectedStationId).then(data => {
      const { time, concentration, stationMeta } = data;
      this.updateChart(concentration, time, stationMeta);
    });
  }

  updateChart = (data, label, stationMeta) => {
    if (this.chart) {
      // first reset the zoom
      this.chart.resetZoom();

      let labelY = this.getYAxisLabel(this.props.ghg);
      this.chart.data.datasets[0].label = labelY;
      this.chart.options.scales.y.title.text = labelY;

      // update that value in the chart.
      this.chart.data.labels = label;
      this.chart.data.datasets[0].data = data;

      let { stationName, stationLocation } = stationMeta;

      if (stationName) {
        this.chart.options.plugins.title.text = ` ${stationLocation} (${stationName})`;
      }

      // update the chart
      this.chart.update();
    }
  }

  fetchStationData = async (stationId) => {
    try {
      let url = collectionItemURL(stationId);
      this.setState({chartDataIsLoading: true});
      let result = await fetchAllFromFeaturesAPI(url);
      const stationMeta = this.getStationMeta(result);
      const { time, concentration } = this.dataPreprocess(result);
      this.setState({chartDataIsLoading: false});
      return { time, concentration, stationMeta };
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // helpers start

  dataPreprocess = (features) => {
    const time = [];
    const concentration = [];
    features.forEach((feature) => {
      if (feature && feature.properties) {
        time.push(feature.properties.datetime);
        concentration.push(feature.properties.value);
      }
    });
    return {time, concentration};
  }

  getStationMeta = (result) => {
    let stationName = "abc";

    let feature = result[0];
    let stationLocation = feature.properties.location.replace("_", ", ");
    return { stationName, stationLocation };
  }

  getYAxisLabel = (ghg) => {
      let label = ghg === 'ch4' ? 'CH₄ Concentration (ppb)' : 'CO₂ Concentration (ppm)';
      return label;
  }

  getChangedGHGStationId = (selectedStationId, changedGHG) => {
    // stationId (collectionId) format: <agency>_<data_category>_<region>_<sitecode>_<ghg>_<frequency>_concentrations
    let stationId = selectedStationId.split("_");
    stationId[4] = changedGHG;
    let changedStationId = stationId.join("_");
    return changedStationId;
  }

  handleRefresh = () => {
    if (this.chart) {
      this.chart.resetZoom();
    }
  }

  handleClose = () => {
    this.props.setDisplayChart(false);
  }

  // helpers end

  render() {
    return (
      <Box id="chart-box" style={this.props.style}>
          <div id="chart-container" style={{width: "100%", height:"100%"}}>
            <div id="chart-tools">
              <div id="chart-instructions-container">
              <div className="icon-and-instructions">
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  style={{margin: "12px"}}
                  onMouseEnter={() => this.setState({showChartInstructions: true})}
                  onMouseLeave={() => this.setState({showChartInstructions: false})}
                />
                {this.state.showChartInstructions && <div id="chart-instructions">
                  <p>1. Click and drag, scroll or pinch on the chart to zoom in.</p>
                  <p>2. Click on the rectangle boxes on the side to toggle chart.</p>
                </div>
                }
              </div>
              </div>
              <div id="chart-controls">
                <FontAwesomeIcon id="zoom-reset-button" icon={faRotateLeft} title="Reset Zoom" onClick={this.handleRefresh}/>
                <FontAwesomeIcon id="chart-close-button" icon={faXmark} title="Close" onClick={this.handleClose}/>
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