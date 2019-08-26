// margin
var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 500 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom,
    radius = width/2;

// color range
var color = d3.scaleOrdinal()
    .range(["#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2"]);

// pie chart arc. Need to create arcs before generating pie
// donut chart arc
var arc2 = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);

// arc for the labels position
var labelArc = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

var arc3 = d3.arc()
    .outerRadius(radius - 80)
    .innerRadius(radius - 140);

// arc for the labels position
var labelArc2 = d3.arc()
    .outerRadius(radius - 120)
    .innerRadius(radius - 120);


// generate pie chart and donut chart
var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.min; });


// define the svg donut chart
var svg = d3.select("body").append("svg")
    .style("transform-origin", "50% 50% 0")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");



// import data
d3.csv("data.csv", function(error, data) {
    if (error) throw error;



    // "g element is a container used to group other SVG elements"
    var g = svg.selectAll(".arc2")
        .data(pie(data.splice(0,6)))
        .enter().append("g")
        .attr("class", "arc2");

    function zoomed() {
        g.style('transform', 'scale(' + d3.event.transform.k + ')');
    }

    svg.call(d3.zoom().scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", zoomed));

    // append path
    g.append("path")
        .attr("d", arc2)
        .style("fill", function(d) { return color(d.data.name); })
        .transition()
        .ease(d3.easeLinear)
        .duration(500)
        .attrTween("d", tweenDonut);

    svg.selectAll(".arc3")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc3");

    // append path
    g.append("path")
        .attr("d", arc3)
        .style("fill", function(d) { return color(d.data.name); })
        .transition()
        .ease(d3.easeLinear)
        .duration(500)
        .attrTween("d", tweenDonut(arc3));

    // append text
    g.append("text")
        .transition()
        .ease(d3.easeLinear)
        .duration(0)
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.data.name; });

    // append text
    g.append("text")
        .transition()
        .ease(d3.easeLinear)
        .duration(0)
        .attr("transform", function(d) { return "translate(" + labelArc2.centroid(d) + ")"; })
        .attr("dy", ".25em")
        .text(function(d) { return d.data.name; });

    // Helper function for animation of donut chart
    function tweenDonut(b, arc) {
        b.innerRadius = 0;
        var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
        return function(t) { return arc(i(t)); };
    }

});

