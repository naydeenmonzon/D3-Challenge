// @TODO: YOUR CODE HERE!

url="/D3_data_journalism/data/data.csv"

// var margin = { top: 20, right: 20, bottom: 20, left: 40 },
//     width = 1100 - margin.left - margin.right,
//     height = 600 - margin.top - margin.bottom;

// console.log(height - margin.top)

// var svg = d3.select("#scatter")
// .append("svg")
//   .attr("width", width)
//   .attr("height", height)
// .append("g")
//   .attr("transform",
//         "translate(" + margin.left + "," + margin.top + ")");



  
// url="/D3_data_journalism/data/data.csv"

// var margin = { top: 20, right: 20, bottom: 20, left: 40 },
//     width = 1100 - margin.left - margin.right,
//     height = 600 - margin.top - margin.bottom;

// console.log(height - margin.top)

// var svg = d3.select("#scatter")
// .append("svg")
//   .attr("width", width)
//   .attr("height", height)
// .append("g")
//   .attr("transform",
//         "translate(" + margin.left + "," + margin.top + ")");



// var KEYdata = d3.csv(url, function(d){
//   return {
//     poverty: +d.poverty,
//     healthcare: +d.healthcare,
//     state: d.abbr
//   }
// }).then(ready);
// function ready(values){
  
//   const circle = svg.selectAll('.stateCircle')
//   .enter().append('circle') 
//   .attr('class', 'stateCircle') 
//   .attr('r', 16)
//   .attr("cx", function(d) { return d.poverty; })
//   .attr("cy", function(d) { return d.healthcare; });


//   const xScale = d3.scaleLinear()
//   .domain(d3.extent(values, (d) => {return d.poverty}))
//   .range([0 , (width - margin.left)]) 


//   const yScale = d3.scaleLinear()
//     .domain(d3.extent(values, (d) => {return d.healthcare}))
//     .range([0, (height - margin.top)])


//   const state = svg.selectAll('.stateCircle')
//   .data(values).enter().append('g') 
//   .attr('class', 'stateCircle')
//   .attr('transform', function(d) { return `translate(` + xScale(d.poverty) + `,` + yScale(d.healthcare)  +`)`});


//   state.append('circle')
//   .attr('class', 'stateCircle')
//   .attr('r', 16)


//   const text = svg.selectAll("text")
//     .data(values)
//     .enter().append("text")
//     .attr("x", function(d) { return xScale(d.poverty); })
//     .attr("y", function(d) { return yScale(d.healthcare); })
//     .text( function (d) { return d.state; })
//     .attr('dx', -9)
//     .attr('dy', 5);




//   const xAxis = d3.axisBottom(xScale)
//   .tickSize(-height);

//   const yAxis = d3.axisLeft(yScale)
//   .tickSize(-width);



//   const xAxisGroup = svg.append("g")
//   .attr("class", "x axis") //gives group the classes 'x' and 'axis'
//   .call(xAxis);

//   const yAxisGroup = svg.append("g")
//     .attr("class", "y axis") //gives group the classes 'y' and 'axis'
//     .call(yAxis);


//   return svg

// };

// console.log(KEYdata)












/*----------------------------------------------------------------------------*/

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(mainData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(mainData, d => d[chosenXAxis]) * 0.8,
      d3.max(mainData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var label;
  if (chosenXAxis === "poverty") {
    label = "In Poverty (%";
  } else if (chosenXAxis === "age") {
    label = "Age (Mediam)";
  } else {
    label = "Household Income (Median)";
  }



  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.abbr}<br>${label} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv(url).then(function(mainData, err) {
  if (err) throw err;

  // parse data
  mainData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.income = +data.income;
    data.age = +data.age;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(mainData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(mainData, d => d.healthcare)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(mainData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 20)
    .attr("class", "stateCircle")
    // .attr("opacity", ".5");

  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var state = chartGroup.selectAll("text")
    .data(mainData)
    .enter().append("text")
    .attr("x",  d => xLinearScale(d[chosenXAxis]))
    .attr("y",  d => yLinearScale(d.healthcare))
    .attr("r", 20)
    .text( function (d) { return d.abbr;})
    .attr("class", 'stateText')


  chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + 20})`)
  .call(state)

var path = labelsGroup.selectAll("path")
console.log(path)




  var povertyLengthLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty Rate");

  var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Mediam)");


  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Lacks Healthcare (%)");


  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(mainData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLengthLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          povertyLengthLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
        }
      }
    });
}).catch(function(error) {
  console.log(error);
});
