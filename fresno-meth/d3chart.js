// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 30},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

d3.select("#chart").attr("align","center");

// parse the date / time
var parseTime = d3.timeParse("%b-%y");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.month); })
    .y(function(d) { return y(d.price); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// gridlines in x axis function
function make_x_gridlines() {		
    return d3.axisBottom(x)
        .ticks(5)
}

// gridlines in y axis function
function make_y_gridlines() {		
    return d3.axisLeft(y)
        .ticks(5)
}

// Get the data
d3.csv("data.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.month = parseTime(d.month);
      d.price = +d.price;
      d.purity = +d.purity;
  });

  // Scale the range of the data
  x.domain([parseTime("Aug-10"), parseTime("Feb-17")]);
  y.domain([46, 105]);

    // add the X gridlines
    svg.append("g")			
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_gridlines()
          .tickSize(-height)
          .tickFormat("")
      )

  // add the Y gridlines
  svg.append("g")			
      .attr("class", "grid")
      .call(make_y_gridlines()
          .tickSize(-width)
          .tickFormat("")
      )


  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Add the scatterplot
  svg.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", function(d) { return (d.purity-80)*1.3; })
      .attr("cx", function(d) { return x(d.month); })
      .attr("cy", function(d) { return y(d.price); })
      .attr("fill", "#6796D1")
      .attr("opacity", 0.7)
      .on("mouseover", function(d) {
       div.transition()
         .duration(200)
         .style("opacity", .9);
       div.html(d.label + "<br/> Price: $" + d.price + "<br/> Purity: " + d.purity + "%")
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
       })
     .on("mouseout", function(d) {
       div.transition()
         .duration(500)
         .style("opacity", 0);
       });

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(10," + height + ")")
      .call(d3.axisBottom(x))
      .append("text")
      .attr("fill", "#000")
      .attr("x", width)
      .attr("y", -6)
      .attr("font-size", "2em")
      .style("text-anchor", "end")
      .text("Year");

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("font-size", "2em")
      .attr("text-anchor", "end")
      .text("Price Per Pure Gram($)")
});


  //Add legends
svg.append("circle")
    .attr("cx", width-220)
    .attr("cy", 20)
    .attr("r", 7.41)
    .attr("fill", "#6796D1");

svg.append("text")
    .attr("x", width-190)
    .attr("y", 23)
    .text("Minimum Purity: 85.7%");

svg.append("circle")
    .attr("cx", width-220)
    .attr("cy", 60)
    .attr("r", 19.11)
    .attr("fill", "#6796D1");



svg.append("text")
    .attr("x", width-190)
    .attr("y", 68)
.text("Maximum Purity: 94.7%");



