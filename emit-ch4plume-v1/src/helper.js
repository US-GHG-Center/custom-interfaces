const d3 = require("d3");

function generateScale(min, max, step) {
  const numbers = [];
  for (let i = min; i <= max; i += step) {
    numbers.push(i);
  }
  numbers[numbers.length - 1] += "+";
  return numbers;
}

function createColorbar(VMIN, VMAX) {

  // Create a color scale using D3
  const colorScale = d3
    .scaleSequential(d3.interpolatePlasma)
    .domain([VMIN, VMAX]); // Set VMIN and VMAX as your desired min and max values

  // Create a colorbar element
  const colorbar = d3.select("body").append("div").attr("class", "colorbar");

  colorbar
    .append("svg")
    .attr("width", 300) // Adjust the width as needed
    .attr("height", 12) // Adjust the height as needed
    .attr("rx", 10)
    .append("g")
    .selectAll("rect")
    .data(d3.range(VMIN, VMAX, (VMAX - VMIN) / 100)) // Adjust the number of color segments as needed
    .enter()
    .append("rect")
    .attr("height", 20)
    .attr("width", 3) // Adjust the width of each color segment

    .attr("x", (d, i) => i * 3)
    .attr("fill", (d) => colorScale(d));

  // Define custom scale labels
  const scaleLabels = generateScale(VMIN, VMAX, 300);

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
    .html("<strong>Methane enhancement (ppm m)</strong>");

  // Add CSS styles to position and style the colorbar
  colorbar
    .style("position", "absolute")
    .style("bottom", "60px") // Adjust the top position as needed
    .style("right", "50px") // Adjust the left position as needed
    .style("background-color", "white")
    .style("padding", "12px");

  // Add CSS styles to style horizontal scale labels
  scaleLabelContainer
    .style("display", "flex")
    .style("justify-content", "space-between")
    .style("margin-bottom", "12px"); // Adjust margin as needed
}

module.exports = {
  createColorbar: createColorbar
};