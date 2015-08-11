angular.module('reporting.graphs', [])

.directive('lineGraph',
  function ($window, $state, lineGraphService){

    var width       = '300',
        height      = '300',
        padding     = 40,
        padding_adj = 5,
        d3          = $window.d3,
        _           = $window._,
        lG          = lineGraphService;

    return {
      restrict: 'E',
      scope: { data: '=' },
      template: function() {
        return '<svg height='+height+' width='+width+'></svg>';
      },
      link: link
    };

    function link (scope, elem, attrs) {
      var xScale, yScale, xAxisGen, yAxisGen, lineFun, data_by_name, collection_stats, all_data;
      var rawSvg      = elem.find('svg');
      var svg         = d3.select(rawSvg[0]);
      var color       = d3.scale.category10();
      var pathClass   = "path";

      var right_offset  = 50;
      var left_offset   = rawSvg.attr("width") - 100;
      var top_offset    = 50;
      var bottom_offset = rawSvg.attr("height") - top_offset;

      scope.$watchCollection('data', function(newVal, oldVal) {
        //figure out a way to do better garbage collection
        d3.selectAll('svg').each(function(d, i){ d3.select(this).selectAll("*").remove() })
        data_by_name = newVal['component_data'];
        collection_stats = newVal['collection_stats'];
        all_data = newVal['all_data'];
        drawLineChart(newVal.metric, newVal.name);
      })

      function setChartParameters(plot_metric, collection) {
        var collection = typeof(collection) !== 'undefined' ? collection : collection_stats;

        var mindate = collection.date[0];
        var maxdate = collection.date[collection.date.length-1];

        xScale = d3.time.scale()
          .domain([mindate, maxdate])
          .range([10, width-80]);

        yScale = d3.scale.linear()
          .domain([0, d3.max(d3.values(collection[plot_metric]))])
          .range([bottom_offset, top_offset]);

        xAxisGen = d3.svg.axis()
          .scale(xScale)
          .orient("bottom")
          .ticks(d3.time.months)
          .tickFormat(d3.time.format("%B %Y"))
          .tickSize(0);

        yAxisGen = d3.svg.axis()
          .scale(yScale)
          .orient("left")
          .ticks(5)
          .tickSize(-5);

        lineFun = d3.svg.line()
          .x(function (d) {
              return xScale(d.date);
          })
          .y(function (d) {
              return yScale(d[plot_metric]);
          })
          .interpolate("linear");
      }

      function drawLineChart(plot_metric, report_name) {
        if(typeof all_data !== 'undefined' && all_data.length) {
          d3.select("svg").selectAll("*").remove();
          var dateformat  = d3.time.format("%Y-%m-%d");
          scope.category  = plot_metric;

          setChartParameters(plot_metric, collection_stats);

          svg.append("svg:g")
            .attr("class", "xaxis")
            .attr("transform", "translate("+right_offset+", 240)")
            .style({ 'stroke': '#797979', 'fill': 'none', 'stroke-width': '2px'})
            .call(xAxisGen)
            .selectAll("text")
              .style({"display": "none"});

          svg.append("svg:g")
            .attr("class", "yaxis")
            .attr("transform", "translate(" + right_offset + ", -"+ padding_adj*2 +")")
            .call(yAxisGen)
            .style({ 'stroke': '#797979', 'fill': 'none', 'stroke-width': '2px'})
            .selectAll("text")
              .style({'font-size': '10px', 'stroke-width': '1px'});

          if(report_name === 'all') {
            for(name in data_by_name) {

              var line = svg.append("svg:g")
                .attr("class", name);

              line.append('svg:path')
                .attr('d', lineFun(data_by_name[name]))
                .attr("transform", "translate("+right_offset+", -"+ padding_adj*2 +")")
                .attr('stroke', color(name))
                .attr('stroke-width', 1)
                .attr('fill', 'none');
            }

            var point = svg.append("svg:g")
              .attr("class", "line-point");

            point.selectAll('circle')
              .data(all_data)
              .enter().append('circle')
              .attr("cx", function(d) { return xScale(d.date) + right_offset })
              .attr("cy", function(d) { return yScale(d[plot_metric]) - (padding_adj*2) }) // making adjustments based on transformations for axes;
              .attr("r", 3.5)
              .style("fill", function(d) {return color(d.name); })
              .on("click", function(d) {
                scope.date = dateformat(d.date);
                scope.name = d.name;
                scope.metric = plot_metric === 'spend' ? d3.format("$,.2f")(d[plot_metric]) : d[plot_metric];
                scope.mname = d3Service.map(plot_metric);
                scope.$apply();
              });
          } else {
              var line = svg.append("svg:g")
                .attr("class", report_name);

              line.append('svg:path')
                .attr('d', lineFun(data_by_name[report_name]))
                .attr("transform", "translate("+right_offset+", -"+ padding_adj*2 +")")
                .attr('stroke', color(report_name))
                .attr('stroke-width', 1)
                .attr('fill', 'none');

              var point = svg.append("svg:g")
                .attr("class", "line-point");

              point.selectAll('circle')
                .data(data_by_name[report_name])
                .enter().append('circle')
                .attr("cx", function(d) { return xScale(d.date) + right_offset })
                .attr("cy", function(d) { return yScale(d[plot_metric]) - (padding_adj*2) }) // making adjustments based on transformations for axes;
                .attr("r", 3.5)
                .style("fill", function(d) {return color(d.name); });
          }
        }
      }
    }

})