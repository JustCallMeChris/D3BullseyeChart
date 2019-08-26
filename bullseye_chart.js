// margin
const margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 500 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom,
    radius = width / 2;

// color range
const color = d3.scaleOrdinal()
    .range(["#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2"]);

let zoom = d3.zoom()
    .scaleExtent([1, 100])
    .translateExtent([[150, 150], [150, 150]])
    .on('zoom', zoomFn);

function zoomFn() {
    d3.select('svg').select('g')
        .style('transform', 'scale(' + d3.event.transform.k + ')');
}

// generate pie chart and donut chart
const pie = d3.pie()
    .sort(null)
    .value(function (d) {
        return d.min;
    });

// define the svg donut chart
var svgContainer = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


// import data
d3.csv("data.csv", function (error, data) {
    if (error) throw error;

    for (let i = 1; i < 3; i++) {

        var g = svgContainer.selectAll(".arc")
            .data(pie(data.splice(0,6)))
            .enter().append("g")
            .attr("class", "arc");

        let arc = d3.arc()
            .outerRadius(radius/2 - 10*i)
            .innerRadius(radius/2 - 70*i);

        // arc for the labels position
        let labelArc = d3.arc()
            .outerRadius(radius/2 - 40*i)
            .innerRadius(radius/2 - 40*i);

        // "g element is a container used to pieChart other SVG elements"
        svgContainer.selectAll(".arc")
            .data(pie(data.splice(0, 6)))
            .enter().append("arcSlice")
            .attr("class", "arc");

        // append path
        g.append("path")
            .attr("d", arc)
            .style("fill", function (d) {
                return color(d.data.name);
            })
            .transition()
            .ease(d3.easeLinear);

        // append text
        g.append("text")
            .transition()
            .ease(d3.easeLinear)
            .duration(0)
            .attr("transform", function (d) {
                return "translate(" + labelArc.centroid(d) + ")";
            })
            .attr("dy", ".35em")
            .text(function (d) {
                return d.data.name;
            })
            .style("font-size", "10px");
    }
});
