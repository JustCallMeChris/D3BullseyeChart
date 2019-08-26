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
const svgContainer = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


// import data
d3.csv("data.csv", function (error, data) {
    if (error) throw error;

    for (let i = 1; i < 3; i++) {

        const pieChart = d3.select("g")
            .append("pieChart")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        let arc = d3.arc()
            .outerRadius(radius/2*i - 10)
            .innerRadius(radius/2*i - 70);

        // arc for the labels position
        let labelArc = d3.arc()
            .outerRadius(radius/2*i - 40)
            .innerRadius(radius/2*i - 40);

        // "g element is a container used to pieChart other SVG elements"
        let arcSlice = pieChart.selectAll(".arc")
            .data(pie(data.splice(0, data.length / 2)))
            .enter().append("arcSlice")
            .attr("class", "arc");

        // append path
        arcSlice.append("path")
            .attr("d", arc)
            .style("fill", function (d) {
                return color(d.data.name);
            })
            .transition()
            .ease(d3.easeLinear);

        // append text
        arcSlice.append("text")
            .transition()
            .ease(d3.easeLinear)
            .duration(0)
            .attr("transform", function (d) {
                return "translate(" + labelArc.centroid(d) + ")";
            })
            .attr("dy", ".35em")
            .text(function (d) {
                return d.data.name;
            });
    }
});
