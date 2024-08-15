import { Component, createRef } from 'react';
import Chart from 'chart.js/auto';
import Box from '@mui/material/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faRotateLeft } from '@fortawesome/free-solid-svg-icons';

import { plugin, options } from './helper';

import './index.css';

export class ConcentrationChart extends Component {
  constructor(props) {
    super(props);
    this.chart = null;
  }

  componentDidMount() {
    this.initializeChart();
  }

  componentDidUpdate(prevProps, prevState) {
    // when new props is received, initialize the chart with data.
    if (this.props.selectedStationId !== prevProps.selectedStationId) {
      // fetch the data from the api and then initialize the chart.
      this.fetchStationData(this.props.selectedStationId).then(data => {
        const { time, concentration, stationName } = data;
        this.updateChart(concentration, time, stationName);
      });
    }
  }

  initializeChart = () => {
    if (this.chart) {
      this.chart.destroy();
    }
    // fetch the data from the api and then initialize the chart.
    this.fetchStationData(this.props.selectedStationId).then(data => {
      const { time, concentration, stationName } = data;
      this.populateChart(this.chartCanvas, concentration, time, stationName);
    });
  }

  populateChart = (chartDOMRef, data=[], labels=[], stationName="") => {
    let dataset = {
      labels: labels,
      datasets: [
        {
          label: 'CO2 Concentration (ppm)',
          data: data,
          borderColor: "#ff6384",
          yAxisID: 'y',
          showLine: false
        }
      ]
    };

    if (stationName) {
      options.plugins.title.text = ` NIST CO2 (${stationName})`;
    }

    this.chart = new Chart(chartDOMRef, {
      type: 'line',
      data: dataset,
      options: options,
      plugins: [plugin]
    });
  }

  updateChart = (data, label, stationName) => {
    if (this.chart) {
      // first reset the zoom
      this.chart.resetZoom();

      // update that value in the chart.
      this.chart.data.labels = label;
      this.chart.data.datasets[0].data = data;

      if (stationName) {
        this.chart.options.plugins.title.text = ` NIST CO2 (${stationName})`;
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
      const stationName = this.getStationName(title);
      const { time, concentration } = this.dataPreprocess(features);
      return { time, concentration, stationName };
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
        concentration.push(feature.properties.co2_ppm);
      }
    });
    return {time, concentration};
  }

  getStationName = (title) => {
    let titleParts = title.split("_");
    let stationName = titleParts[titleParts.length - 2];
    let ghg = titleParts[titleParts.length - 1];
    return stationName.toUpperCase();
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
            <div id="chart-controls">
              <FontAwesomeIcon id="zoom-reset-button" icon={faRotateLeft} title="Reset Zoom" onClick={this.handleRefresh}/>
              <FontAwesomeIcon id="chart-close-button" icon={faXmark} title="Close" onClick={this.handleClose}/>
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