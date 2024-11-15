import * as d3 from "d3";

export const createColorbar = (colorbarElement, VMIN=0, VMAX=0.4) => {

    // Create a color scale using D3
    const colorScale = d3
        .scaleSequential(d3.interpolatePlasma)
        .domain([VMIN, VMAX]); // Set VMIN and VMAX as your desired min and max values

    // Create a colorbar element
    const colorbar = colorbarElement;

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

    // Create a container for horizontal scale labels
    const scaleLabelContainer = colorbar
        .append("div")
        .attr("class", "scale-label-container");

    // Create scale label elements horizontally
    scaleLabelContainer
        .selectAll("div")
        .data(scaleLabels)
        .enter()
        .append("div")
        .attr("class", "colorbar-scale-label-horizontal")
        .text((d) => d); // Set the label text

    // Add the label "Methane enhancement (ppm m)" under the scale labels
    colorbar
        .append("div")
        .attr("class", "colorbar-label")
        .style("text-align", "center") // Center the label
        .style("margin-bottom", "12px") // Adjust margin as needed
        .html("Maximum Methane Column Enhancement (mol/m²)");

    // Add CSS styles to style horizontal scale labels
    scaleLabelContainer
        .style("display", "flex")
        .style("justify-content", "space-between")
        .style("margin-bottom", "12px"); // Adjust margin as needed

}

function generateScale(min, max, step) {
    const numbers = [];
    for (let i = min; i <= max; i += step) {
        numbers.push(i);
    }
    numbers[numbers.length - 1] += "+";
    return numbers;
}
  