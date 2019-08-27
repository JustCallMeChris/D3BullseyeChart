// margin
const margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 500 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom,
    radius = width / 2;

// color range
const color = d3.scaleOrdinal()
    .range(["#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2"]);

// generate donut chart
const pie = d3.pie()
    .sort(null)
    .value(function (d) {
        return d.max;
    });

var zoom = d3.zoom()
    .scaleExtent([1, 100])
    .translateExtent([[0, 0],[150, 150]])
    .on('zoom', zoomFn);

function zoomFn() {
    d3.select('svg').select('g')
        .style('transform', 'scale(' + d3.event.transform.k + ')');
}

    // define the svg donut chart
let svgContainer = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g").style("transform-origin", "50% 50% 0")
    .call(zoom)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

let diffOuterRadius = 0;
let diffInnerRadius = 60;
let textSize = 10;

// import data
d3.csv("data.csv", function (error, data) {
    if (error) throw error;

    for (let i = 1; i < 4; i++) {

        let dataSubSet = data.splice(0,6);

        const g = svgContainer.selectAll(".arc" + i)
            .data(pie(dataSubSet))
            .enter().append("g")
            .attr("class", "arc");

        let arc = d3.arc()
            .outerRadius(radius-diffOuterRadius)
            .innerRadius(radius-diffInnerRadius);

        // arc for the labels position
        let labelArc = d3.arc()
            .outerRadius(radius-diffOuterRadius)
            .innerRadius(radius-diffInnerRadius);

        diffInnerRadius+=60;
        diffOuterRadius+=60;

        // "g element is a container used to collect other SVG elements"
        svgContainer.selectAll(".arc")
            .data(pie(dataSubSet))
            .enter().append("arcSlice")
            .attr("class", "arc");

        // append path
        g.append("path")
            .attr("d", arc)
            .style("fill", function (d) {
                return color(d.data.name);
            });

        // append text
        g.append("text")
            .attr("transform", function (d) {
                return "translate(" + labelArc.centroid(d) + ")";
            })
            .attr("dy", ".35em")
            .text(function (d) {
                return d.data.name;
            }).attr('text-anchor','middle')
            .style("font-size", textSize+"px");

        textSize -=1;
    }
});
