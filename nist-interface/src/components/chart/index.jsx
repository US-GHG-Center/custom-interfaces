import { Component } from 'react';
import Chart from 'chart.js/auto';
import Box from '@mui/material/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faRotateLeft, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { LoadingSpinner } from '../loading';

import { plugin, options } from './helper';

import './index.css';

const collectionItemURL = (collectionId, offset=0, limit=10000) => {
  return `${process.env.REACT_APP_FEATURES_API_URL}/collections/${collectionId}/items?limit=${limit}&offset=${offset}&is_max_height_data=True`;
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
    if (this.props.selectedStationId !== prevProps.selectedStationId || this.props.ghg !== prevProps.ghg) {
      // clean previous chart data
      if (this.chart) {
        this.chart.data.labels = [];
        this.chart.data.datasets[0].data = [];
        this.chart.update();
      }

      if (this.props.ghg !== prevProps.ghg) {
        let changedStationId = this.getChangedGHGStationId(this.props.selectedStationId, this.props.ghg);
        this.props.setSelectedStationId(changedStationId);
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
      this.setState({chartDataIsLoading: true});
      // fetch in the collection from the features api
      const response = await fetch(collectionItemURL(stationId));
      if (!response.ok) {
        throw new Error('Error in Network');
      }
      const result = await response.json();

      // need to pull in remaining data based on the pagination information
      const { numberMatched, numberReturned } = result;
      if (numberMatched > numberReturned) {
        let remainingData = await this.fetchRemainingData(stationId, numberMatched, numberReturned);
        result.features = result.features.concat(remainingData);
      }

      const { features } = result;
      const stationMeta = this.getStationMeta(result);
      const { time, concentration } = this.dataPreprocess(features);
      this.setState({chartDataIsLoading: false});
      return { time, concentration, stationMeta };
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  fetchRemainingData = async (stationId, numberMatched, numberReturned) => {
    let remaining = numberMatched - numberReturned;
    // so we still have some remaining data to fetch
    let batches = Math.ceil(remaining / 10000);
    let offsets = []; // when we are pulling data in the capacity of 10,000 per batches
    for (let i = 1; i <= batches; i++) {
      offsets.push(i * 10000 + 1);
    }

    let dataFetchPromises = [];

    offsets.forEach(async (offset) => {
        const response = fetch(collectionItemURL(stationId, offset));
        dataFetchPromises.push(response);
    });

    try {
      let results = await Promise.all(dataFetchPromises);
      let jsonResult = await Promise.all(results.map(result => result.json()));
      let features = jsonResult.map(result => result.features).flat();
      return features;
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
    let title = result.title;
    let titleParts = title.split("_");
    let stationName = titleParts[3].toUpperCase();

    let feature = result.features[0];
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
          <div id="chart-container" className='fullSize'>
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