import { Component, createRef } from 'react';
import Chart from 'chart.js/auto';
import Box from '@mui/material/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faRotateLeft, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

import { plugin, options } from './helper';

import './index.css';

export class ConcentrationChart extends Component {
  constructor(props) {
    super(props);
    this.chart = null;
    this.state = { showChartInstructions: true };
  }

  componentDidMount() {
    this.initializeChart();
  }

  componentDidUpdate(prevProps, prevState) {
    // when new props is received, initialize the chart with data.
    if (this.props.selectedStationId !== prevProps.selectedStationId) {
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
    let label = this.props.ghg === 'ch4' ? 'CH₄ Concentration (ppb)' : 'CO₂ Concentration (ppm)';
    let dataset = {
      labels: [],
      datasets: [
        {
          label: label,
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
      // fetch in the collection from the features api
      const response = await fetch(`https://dev.ghg.center/api/features/collections/${stationId}/items?limit=10000`);
      if (!response.ok) {
        throw new Error('Error in Network');
      }
      const result = await response.json();
      const { title, features } = result;
      const stationMeta = this.getStationMeta(result);
      const { time, concentration } = this.dataPreprocess(features);
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
    let title = result.title;
    let titleParts = title.split("_");
    let stationName = titleParts[3].toUpperCase();

    let feature = result.features[0];
    let stationLocation = feature.properties.location.replace("_", ", ");
    return { stationName, stationLocation };
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
      <Box sx={{height: "30em"}} id="chart-box">
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