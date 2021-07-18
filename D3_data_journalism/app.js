// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 825;
var svgHeight = 600;

// Define the chart's margins as an object
var margin = {
  top: 100,
  right: 100,
  bottom: 100,
  left: 100
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;


// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Load data from data csv

d3.csv("data.csv", function(d) {
  d.age = +d.age;
  d.smokes = +d.smokes;
  // d.abbr = +d.abbr;
  return d;
}).then(function(csvData) {

  console.log(csvData);


    // Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([30, d3.max(csvData, d => d.age)]).nice()
      .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
      .domain([6, d3.max(csvData, d => d.smokes)], 1).nice()
      .range([chartHeight, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);


    // Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(csvData)
    .enter()
    .append("circle")
    .classed("stateCircle", true)
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d => yLinearScale(d.smokes))
    // .attr("class", "stateCircle");
    .attr("r", "10")
    // .attr("class", ".stateCircle");
    // .attr("fill", "blue")
    .attr("opacity", ".8");

    // create State Abbreviation labels
    var textGroup = chartGroup.selectAll(".label")
       .data(csvData)
       .enter()
       .append("text")
       .classed("stateText", true)
       .classed("label", true)
       .html(function(d){ return (`${d.abbr}`)})
        .attr("x", d =>  xLinearScale(d.age))
        .attr("y", d =>  yLinearScale(d.smokes)+3)
        .attr("r", "5");;

    
      // Initialize tool tip
    var toolTip = d3.tip()
      .offset([80, -60])
      .html(function(d) {
        return (`state: ${d.abbr}<br>Age: ${d.age}<br>Smokes: ${d.smokes}`);
      })
      .attr("class", "d3-tip")
      .style("z-index", "10");



    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this)   
    })
      // onmouseout event
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });

    // create event listeners to dispaly and hide tooltip if user clicks on abbreviation text also
    textGroup.on("click", function(data) {
      toolTip.show(data, this)       
    })
        // onmouseout event
      .on("mouseout", function(data) {
        toolTip.hide(data);
      });


    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Smokers (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top - 50})`)
      .attr("class", "axisText")
      .text("Age");
  }).catch(function(error) {
    console.log(error);
  });

