
import React, { useRef, useEffect } from 'react';
import { Chart, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import * as d3 from 'd3';
import { Typography } from '@mui/material';

Chart.register(CategoryScale, LinearScale, BarElement, Title);

export function ColorMapChart({ dataset }) {
    const legendLabel = (
        <>
            {dataset == "vulcan" &&
                "Total Fossil Fuel CO₂  Emissions (metric tons CO₂/km²/year)"
            }
            {
                dataset == "gra2pes" && "metric tons / km² / month"
            }
        </>
    )

    return (
        <div className="colormap-chart">
            <div style={{ marginTop: 10 }}>
                <GradientChart />
            </div>
            <Typography style={{ fontSize: '12px', color: '#082A64', textAlign: "center" }}>
                {legendLabel}
            </Typography>
        </div >
    )
}

const GradientChart = () => {
    const svgRef = useRef(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const width = 383;
        const height = 10;

        // Define the gradient
        const gradient = svg.append('defs')
            .append('linearGradient')
            .attr('id', 'gradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '0%');

        const colors = [
            '#310597', '#4c02a1', '#6600a7', '#7e03a8', '#9511a1',
            '#aa2395', '#bc3587', '#cc4778', '#da5a6a', '#e66c5c',
            '#f0804e', '#f89540', '#fdac33', '#fdc527', '#f8df25'
        ];

        colors.forEach((color, index) => {
            gradient.append('stop')
                .attr('offset', `${(index / (colors.length - 1)) * 100}%`)
                .attr('stop-color', color);
        });

        svg.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', width)
            .attr('height', height)
            .style('fill', 'url(#gradient)');

        const labels = d3.scaleLinear()
            .domain([0, 1000])
            .range([0, width]);

        svg.selectAll('.label')
            .data(['0', '250', '500', '750', '1000+'])
            .enter()
            .append('text')
            .attr('x', d => labels(d))
            .attr('y', height + 10)
            .attr('text-anchor', d => (d === '1000+' ? 'end' : 'middle'))
            .text(d => d)
            .style('font-size', '8px')
            .style('color', '#082A64');
    }, []);

    return (
        <svg ref={svgRef} height={20} width={'100%'}>
        </svg >
    );
};

export default GradientChart;

