
import React, { useRef, useEffect } from 'react';
import { Chart, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import * as d3 from 'd3';
import { Typography } from '@mui/material';

Chart.register(CategoryScale, LinearScale, BarElement, Title);

export function ColorMapChart({ dataset }) {
    const title = (
        <>
            {dataset == "vulcan" && "2021 Total CO₂ Emissions"}
            {dataset == "gra2pes" && "2021"}
        </>
    )
    const unit = (
        <>
            {dataset == "vulcan" &&
                "tonne CO₂ / km² / year"
            }
            {
                dataset == "gra2pes" && "tonne CO₂ / km² / month"
            }
        </>
    )

    return (
        <div className="colormap-chart">
            <Typography style={{ fontSize: '12px', color: '#082A64', textAlign: "center", fontWeight: "bold" }}>
                {title}
            </Typography>
            <div style={{ marginTop: 10 }}>
                <GradientChart dataset={dataset} />
            </div>
            <Typography style={{ fontSize: '12px', textAlign: "center" }}>
                {unit}
            </Typography>
        </div >
    )
}

const GradientChart = ({ dataset }) => {
    const svgRef = useRef(null);
    const width = 383;
    const height = 10;

    const colors = [
        '#5e4fa2', '#388eba', '#75c8a5', '#bfe5a0', '#f1f9a9',
        '#feeea2', '#fdbf6f', '#f67b4a', '#d8434e', '#9e0142'
    ];

    const labels_gra2pes = [
        { label: '0', value: 0 },
        { label: '100', value: width - 20 }
    ];

    const labels_vulcan = [
        { label: '0', value: 0 },
        { label: '500', value: width - 22 }
    ];

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const labels = (dataset == "vulcan" ? labels_vulcan : labels_gra2pes);

        // Define the gradient
        const gradient = svg.append('defs')
            .append('linearGradient')
            .attr('id', 'gradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '0%');


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

        svg.selectAll('.label')
            .data(labels)
            .enter()
            .append('text')
            .attr('x', d => d.value)
            .attr('y', height + 10)
            .attr('text-anchor', d => d.label === '0' ? 'start' : 'end')
            .text(d => d.label)
            .style('font-size', '10px');
        // .style('fill', '#082A64');
    }, []);

    return (
        <svg ref={svgRef} height={20} width={'100%'}>
        </svg >
    );
};

export default GradientChart;

