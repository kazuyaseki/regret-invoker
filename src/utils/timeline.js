import * as d3 from 'd3';

export default function Timeline(currentTimeMsec){

  this.settings = {
    width: 560,
    height: 120,
    barWidth: 12,
    margin:{
      top: 20, 
      bottom: 20, 
      left: 40, 
      right: 20
    },
    bar: {
      width: 12,
      fillColor: "#58BE89",
      strokeColor: "#666"
    }
  };

  //scaleの定義
  var xScale = d3.scaleTime()
    .domain([new Date(1509980400 * 1000), new Date(1510066800 * 1000)])
    .rangeRound([0, this.settings.width]);
  var xAxis = d3.axisBottom()
    .scale(xScale);

  this.draw = (elementId, data) => {
    let yMax = d3.max(data, d => d.viewTime);
    let yScale = d3.scaleLinear()
      .domain([0, yMax])
      .range([this.settings.height - this.settings.margin.bottom, this.settings.margin.top]);
    let heightScale = d3.scaleLinear()
      .domain([0, yMax])
      .range([0, this.settings.height - this.settings.margin.top - this.settings.margin.bottom]);
    let yAxis = d3.axisLeft()
      .scale(yScale)
      .ticks(4);

    let svg = d3.select("svg[id='" + elementId + "']")
      .attr('width', this.settings.width)
      .attr('height', this.settings.height);
    
    svg.append("g")
      .attr('transform', 'translate(' + [this.settings.margin.left, this.settings.height - this.settings.margin.bottom] + ')')
      .call(xAxis);
    svg.append('g')
      .attr('transform', 'translate(' + [this.settings.margin.left, 0] + ')')
      .call(yAxis);

    let rect = svg.selectAll('rect')
      .data(data)
      .enter().append('rect')
      .attr('width', this.settings.bar.width)
      .attr('height', function(d) {
        return heightScale(d.viewTime);
      })
      .attr('x', function(d) {return xScale(new Date(d.timestamp))})
      .attr('y', function(d) {return yScale(d.viewTime)})
      .attr('fill', this.settings.bar.fillColor)
      .attr('stroke', this.settings.bar.strokeColor);
  }

  return this;
}
