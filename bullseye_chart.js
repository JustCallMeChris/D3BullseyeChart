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
        return d.sliceValue;
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
let bullsEyeDeep = 3;

let level = 1;
let dimension = 1;

let radianListPerSlice = [0,12,24,36,48,60];

let fullRadianList = [[0,12,24,36,48,60],[60,72,84,96,108,120],[120,132,144,156,168,180],
                        [180,192,204,216,228,240],[240,252,264,276,288,300],[300,312,324,336,348,360]];

let radianList = [12,24,36,48,
    72,84,96,108,
    132,144,156,168,
    192,204,216,228,
    252, 264, 276, 288,
    312, 324, 336, 348];

let radianListBold = [0,60,120,180,240,300];

// import data
d3.csv("data.csv", function (error, data) {
    if (error) throw error;

    for (let i = 1; i <= bullsEyeDeep; i++) {
        level = i;
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

        dataSubSet.forEach(plotDataPerSlice);
    }

    function plotDataPerSlice(item, index){

        let dataPerSlice = item;
        radianListPerSlice.forEach(plotData.bind(null, dataPerSlice));
        dimension++;
        if (dimension == 7){
            dimension = 1;
        }
    }

    function plotData(dataPerSlice,item, index){

        for (person = 1; person < 6; person++) {
            for (time = 1; time < 6; time++) {
                drawDataline(fullRadianList[dimension-1][time-1],
                fullRadianList[dimension-1][time],
                dataPerSlice["p"+person+"t"+time],
                dataPerSlice["p"+person+"t"+(time+1)],index);
        }}
    }

    function drawDataline(item,item2, dY1, dY2, index){

        let radians = item;
        let radians2 = item2;
        let angleRadians = radians-90;
        let angleRadians2 = radians2-90;

        let maxHigh = 230;

        let pointHigh = maxHigh-60*level + parseInt(dY1,10);
        let pointHigh2 = maxHigh-60*level + parseInt(dY2,10);
        let X1 = pointHigh * Math.cos(angleRadians*Math.PI/180) ;
        let Y1 = pointHigh * Math.sin(angleRadians*Math.PI/180);
        let X2 = pointHigh2 * Math.cos(angleRadians2*Math.PI/180);
        let Y2 = pointHigh2 * Math.sin(angleRadians2*Math.PI/180);

        svgContainer.append("line")
            .attr("x1", X1)
            .attr("y1", Y1)
            .attr("x2", X2)
            .attr("y2", Y2)
            .attr("stroke-width", 0.2)
            .attr("stroke", "green");
    }

    radianList.forEach(drawParaCoordInnerBorderlines);

    radianListBold.forEach(drawParaCoordBorderlines);

    function drawParaCoordBorderlines(item, index){

        let radians = item;
        let angleRadians = radians-90;
        let radiusInvisibleLine = 50;
        let radiusLine = radiusInvisibleLine + 180;
        let X1 = radiusInvisibleLine * Math.cos(angleRadians*Math.PI/180);
        let Y1 = radiusInvisibleLine * Math.sin(angleRadians*Math.PI/180);
        let X2 = radiusLine * Math.cos(angleRadians*Math.PI/180);
        let Y2 = radiusLine * Math.sin(angleRadians*Math.PI/180);

        svgContainer.append("line")
            .attr("x1", X1)
            .attr("y1", Y1)
            .attr("x2", X2)
            .attr("y2", Y2)
            .attr("stroke-width", 2)
            .attr("stroke", "black");
    }

    function drawParaCoordInnerBorderlines(item, index){

        let radians = item;
        let angleRadians = radians-90;
        let radiusInvisibleLine = 50;
        let radiusLine = radiusInvisibleLine + 180;
        let X1 = radiusInvisibleLine * Math.cos(angleRadians*Math.PI/180);
        let Y1 = radiusInvisibleLine * Math.sin(angleRadians*Math.PI/180);
        let X2 = radiusLine * Math.cos(angleRadians*Math.PI/180);
        let Y2 = radiusLine * Math.sin(angleRadians*Math.PI/180);

        svgContainer.append("line")
            .attr("x1", X1)
            .attr("y1", Y1)
            .attr("x2", X2)
            .attr("y2", Y2)
            .attr("stroke-width", 0.25)
            .attr("stroke", "black");
    }
});
