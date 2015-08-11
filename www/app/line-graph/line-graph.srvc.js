angular.module('reporting.graphs')

.service('lineGraphService', function(){

  return {
    drawAxis: drawAxis,
    drawLine: drawLine,
    drawCircle: drawCircle,
    offset: offset,
    setTimeScale: setTimeScale,
    setLinearScale: setLinearScale,
    setXAxis: setXAxis,
    setYAxis: setYAxis,
    lineFunction: lineFunction
  }

  // CONFIGURE LINEAR PARAMETERS
  function setTimeScale(domain, range) {
    return d3.time.scale()
             .domain(domain)
             .range(range);
  }

  function setLinearScale(domain, range) {
    return d3.scale.linear()
             .domain(domain)
             .range(range);
  }

  function setXAxis(scale, orientation, ticks, tickFormat, tickSize) {
    return d3.svg.axis()
             .scale(scale)
             .orient(orientation)
             .ticks(ticks)
             .tickFormat(tickFormat)
             .tickSize(tickSize);
  }

  function setYAxis(scale, orientation, ticks, tickSize) {
    return d3.svg.axis()
             .scale(scale)
             .orient(orientation)
             .ticks(ticks)
             .tickSize(tickSize);
  }

  function lineFunction(xFx, yFx, interpolate) {
    return d3.svg.line()
             .x(xFx)
             .y(yFx)
             .interpolate(interpolate);
  }

  // DRAW
  function drawAxis(svg, axis) {
    var handle = svg;
    return handle.append('svg:g')
      .call(axis);
  }

  function drawLine(svg, line, coll, data, color) {
    var handle = svg;
    return handle.append('svg:g')
          .attr('class', data)
          .append('svg:path')
          .attr('d', line(coll[data]))
          .attr('stroke', color(name))
          .attr('stroke-width', 1)
          .attr('fill', 'none');
  }

  function offset(svg, xOff, yOff) {
    var handle = svg;
    return handle.attr("tranform", "translate("+xOff+","+yOff+")");
  }

  function drawCircle(svg, data, xScale, yScale, xKey, yKey, xOff, yOff, radius) {
    var handle = svg;
    return handle.append('svg:g')
                 .attr('class', 'line-point')
                 .selectAll('circle')
                 .data(data)
                 .enter()
                 .append('circle')
                 .attr('cx', function(d) { return xScale(d[xKey]) + xOff })
                 .attr('cy', function(d) { return yScale(d[yKey]) + yOff })
                 .attr('r', radius);
  }

});
