import * as d3 from "d3";

export const createColorbar = (colorbar, VMIN=0, VMAX=0.4) => {
    // Create a color scale using D3
    const colorScale = d3
        .scaleSequential(d3.interpolatePlasma)
        .domain([VMIN, VMAX]); // Set VMIN and VMAX as your desired min and max values

    colorbar
        .append("svg")
        .attr("class", "colorbar-svg")
        .append("g")
        .selectAll("rect")
        .data(d3.range(VMIN, VMAX, (VMAX - VMIN) / 100)) // Adjust the number of color segments as needed
        .enter()
        .append("rect")
        .attr("height", 12) // height of the svg color segment portion
        .attr("width", "100%") // Adjust the width of each color segment
        .attr("x", (d, i) => i * 3)
        .attr("fill", (d) => colorScale(d));

    // Define custom scale labels
    const scaleLabels = generateScale(VMIN, VMAX, 0.08);

    // Create a container for color labels
    colorbar
        .append("div")
        .attr("class", "colorbar-scale-tick-label-container")
        .selectAll("div")
        .data(scaleLabels)
        .enter()
        .append("div")
        .attr("class", "colorbar-scale-tick-label")
        .text((d) => d); // Set the tick label text
}

function generateScale(min, max, step) {
    const numbers = [];
    for (let i = min; i <= max; i += step) {
        numbers.push(i);
    }
    numbers[numbers.length - 1] += "+";
    return numbers;
}
  