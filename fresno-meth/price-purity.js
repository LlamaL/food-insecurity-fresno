
  const margin = { top: 20, right: 50, bottom: 30, left: 50 };
  const width = 960 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const parseTime = d3.timeParse('%b-%y');
  const bisectDate = d3.bisector(d => d.month).left;

  d3.select('body')
    .style('font', '11px sans-serif')

  const x = d3.scaleTime()
    .range([0, width]);

  const y = d3.scaleLinear()
    .range([height, 0]);

  const line = d3.line()
    .x(d => x(d.month))
    .y(d => y(d.price));

  const svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

  d3.csv('data/meth_price_purity.csv', type, (error, data) => {
    if (error) throw error;

    data.sort((a, b) => a.month - b.month);

    x.domain([parseTime("Nov-10"), parseTime("Feb-17")]);
    y.domain([46, 110]);


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


   // Add the X Axis
   svg.append("g")
      .attr("transform", "translate(20," + height + ")")
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
      .attr("transform", "translate(0,0)")
      .call(d3.axisRight(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", -26)
      .attr("dy", "0.71em")
      .attr("font-size", "2em")
      .attr("text-anchor", "end")
      .text("Price Per Pure Gram($)")


    // style the axes
    d3.selectAll('.axis path')
      .styles({
        fill: 'none',
        stroke: '#000',
        'shape-rendering': 'crispEdges'
      });

    d3.selectAll('.axis line')
      .styles({
        fill: 'none',
        stroke: '#000',
        'shape-rendering': 'crispEdges'
      });

    svg.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', line);

    svg.selectAll("dot")
      .data(data)
    .enter().append("circle")
      .attr("r", function(d) { return (d.purity-80)*1.3; })
      .attr("cx", function(d) { return x(d.month); })
      .attr("cy", function(d) { return y(d.price); })
      .attr("fill", "#6796D1")
      .attr("opacity", 0.7);

    const focus = svg.append('g')
      .attr('class', 'focus')
      .style('display', 'none');

    focus.append("div")
      .attr("width",150)
      .attr("height",50)
      .attr("x",9)
      .attr("dy","2em");

    
    focus.append("text")
      .attr("class", "line1")
      .attr("x",0)
      .attr("dy", "-6em")
      .attr("font-size", "1.2em")
      .attr("font-weight", "bold");
    
    focus.append("text")
      .attr("class", "line2")
      .attr("x",0)
      .attr("dy", "-5.1em")
      .attr("font-size", "1.2em")

    focus.append("text")
      .attr("class", "line3")
      .attr("x",0)
      .attr("dy", "-4.2em")
      .attr("font-size", "1.2em")

    
    focus.append("circle");

    svg.append('rect')
      .attr('class', 'overlay')
      .attr('width', width)
      .attr('height', height)
      .on('mouseover', () => focus.style('display', null))
      .on('mouseout', () => focus.style('display', 'none'))
      .on('mousemove', mousemove);


    d3.select('.overlay')
      .styles({
        fill: 'none',
        'pointer-events': 'all'
      });

    d3.selectAll('.focus')
      .style('opacity', 0.8);

    d3.selectAll('.focus circle')
      .styles({
        fill: '#2B3E57',
        stroke: '#2B3E57',
        "opacity": 1
      });

    d3.selectAll('.focus line')
      .styles({
        fill: 'none',
        'stroke': 'black',
        'stroke-width': '1.5px',
        'stroke-dasharray': '3 3'
      });

    d3.select(".focus div")
      .styles({
          background: "blue",
          color: "white",
          position: "absolute",
          width: 150,
          height: 50,
          padding: 10
      })

    function mousemove() {
      const x0 = x.invert(d3.mouse(this)[0]);
      const i = bisectDate(data, x0, 1);
      const d0 = data[i - 1];
      const d1 = data[i];
      const d = x0 - d0.month > d1.month - x0 ? d1 : d0;
      focus.attr('transform', `translate(${x(d.month)}, ${y(d.price)})`);
      focus.select('line.x')
        .attr('x1', 0)
        .attr('x2', -x(d.month))
        .attr('y1', 0)
        .attr('y2', 0);

      focus.select('line.y')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y2', height - y(d.price));
    
      focus.select("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", (d.purity-80)*1.3+2);

      focus.select("text.line1")
         .html(d.label);

      focus.select("text.line2")
         .html("Price: $" + d.price + " per gram");

      focus.select("text.line3")
         .html("Purity: " + d.purity + "%");
      
      focus.select("div")
         .html("just testing");
    }
  });


  function type(d) {
    d.month = parseTime(d.month);
    d.price = +d.price;
    d.puriy = +d.purity;
    return d;
  }

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
