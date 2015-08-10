angular.module('reporting.directive', ['reporting.service'])

.directive('reportingDv',
  function ($window, $parse, $state, d3Service, metrics){

    var width = '300';
    var height = '300';
    var background = 'white';
    var today;


    return {
      restrict: 'E',
      scope: {
        advertiserId: '='
      },
      templateUrl: 'js/reporting/reporting.tpl.html',
      link: link
    };

    function link(scope, elem, attrs) {
      scope.tab="metrics";
      scope.category="";
      scope.drawLineChart = drawLineChart;
      scope.tCategory ="spend";
      scope.tSelected ="all";
      scope.agg = {};
      scope.empty = false;
      scope.getNewMonthData = getNewMonthData;
      scope.state = $state;

      var d3 = $window.d3, _  = $window._;
      var JSON;
      var report_data = [];
      var collection_stats = {};
      var collection_agg = {};
      var collection_tactics = {};
      var allKeys = ['date', 'tactic', 'imps', 'clicks', 'mouseovers', 'shares', 'social', 'ctr', 'mouserate', 'spend'];

      // SVG CONFIGURATION
      var rawSvg = elem.find('svg');
      var svg = d3.select(rawSvg[0]);

      var xScale, yScale, xAxisGen, yAxisGen, lineFun;

      var padding       = 40;
      var padding_adj   = 5;
      var right_offset  = 50;
      var left_offset   = rawSvg.attr("width") - 100;
      var top_offset    = 50;
      var bottom_offset = rawSvg.attr("height") - top_offset;

      var pathClass="path";
      var xScale, yScale, xAxisGen, yAxisGen, lineFun;
      var color = d3.scale.category10();

      scope.color = function(t){
        return color(t);
      };

      //clear all string formatting to parse integer appropriately
      var toNum = function(number) {return parseFloat(number.replace(',', '').replace('$','').replace('%',''))};

      // d3Service.setAdvertiser(scope.advertiserId);
      d3Service.setAdvertiser(30); // testing member


      scope.today = d3Service.setDates(); // initial date data
      d3Service.getReportID(generateDisplay);

      function getNewMonthData(direction) {
        d3Service.setDates(direction);
        d3Service.getReportID(generateDisplay);
      }

      function generateDisplay (data) {
        report_data = [];
        JSON = data.data.report.data;

        function DataPoint(date, tactic, imps, clicks, mouseovers, shares, social, ctr, mouserate, spend) {
          this.date       = new Date(date);
          this.tactic     = tactic;
          this.imps       = toNum(imps);
          this.clicks     = toNum(clicks);
          this.mouseovers = toNum(mouseovers);
          this.shares     = toNum(shares);
          this.social     = toNum(shares);
          this.ctr        = toNum(ctr)/100; // percentage
          this.mouserate  = toNum(mouserate)/100; // percentage
          this.spend      = toNum(spend); // money
        }

        // parse only for date / tactic report //
        JSON.forEach(function(d) {
          report_data.push(new DataPoint(d[0], d[1], d[2], d[3], d[4], d[5], d[6], d[7], d[8], d[9]));
        })

        allKeys.forEach(function(ak) {
          collection_stats[ak] = _.pluck(report_data, ak);
        })

        metrics.forEach(function(m) {
          var agg_sum = _.reduce(collection_stats[m.name], function(memo, num) {
            return memo + num;
          });
          collection_agg[m.name] = agg_sum;
        })

        scope.collection_agg = collection_agg;

        scope.tactics = _.uniq(_.pluck(report_data, 'tactic'));

        scope.tactics.forEach(function(t) {
          collection_tactics[t] = _.where(report_data, {tactic: t});
        })

        for(prop in collection_tactics) {
          var temp_obj = {};
          scope.agg[prop] = {};
          allKeys.forEach(function(ak) {
            scope.agg[prop][ak] = _.pluck(collection_tactics[prop], ak);
          })
          metrics.forEach(function(m) {
            var agg_sum = _.reduce(scope.agg[prop][m.name], function(memo, num) {
              return memo + num;
            })
            temp_obj[m.name] = agg_sum;
          })
          scope.agg[prop].agg = temp_obj;
        }

        if(JSON.length) {
          scope.empty = false;
          drawLineChart('spend', 'all');
        } else {
          scope.empty = true;
        }

      };

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

      function drawLineChart(plot_metric, graph_report) {
        if(JSON.length) {
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
            .style({ 'stroke': '#797979', 'fill': 'none', 'stroke-width': '2px'})
            .call(yAxisGen)
            .selectAll("text")
              .style({'font-size': '10px', 'stroke-width': '1px'});

          if(graph_report === 'all') {
            for(tactic in collection_tactics) {
              var line = svg.append("svg:g")
                .attr("class", tactic);

              line.append('svg:path')
                .attr('d', lineFun(collection_tactics[tactic]))
                .attr("transform", "translate("+right_offset+", -"+ padding_adj*2 +")")
                .attr('stroke', color(tactic))
                .attr('stroke-width', 1)
                .attr('fill', 'none');
            }

            var point = svg.append("svg:g")
              .attr("class", "line-point");

            point.selectAll('circle')
              .data(report_data)
              .enter().append('circle')
              .attr("cx", function(d) { return xScale(d.date) + right_offset })
              .attr("cy", function(d) { return yScale(d[plot_metric]) - (padding_adj*2) }) // making adjustments based on transformations for axes;
              .attr("r", 3.5)
              .style("fill", function(d) {return color(d.tactic); })
              .on("click", function(d) {
                scope.date = dateformat(d.date);
                scope.name = d.tactic;
                scope.metric = plot_metric === 'spend' ? d3.format("$,.2f")(d[plot_metric]) : d[plot_metric];
                scope.mname = d3Service.map(plot_metric);
                scope.$apply();
              });
          } else {
              var line = svg.append("svg:g")
                .attr("class", graph_report);

              line.append('svg:path')
                .attr('d', lineFun(collection_tactics[graph_report]))
                .attr("transform", "translate("+right_offset+", -"+ padding_adj*2 +")")
                .attr('stroke', color(graph_report))
                .attr('stroke-width', 1)
                .attr('fill', 'none');

              var point = svg.append("svg:g")
                .attr("class", "line-point");

              point.selectAll('circle')
                .data(collection_tactics[graph_report])
                .enter().append('circle')
                .attr("cx", function(d) { return xScale(d.date) + right_offset })
                .attr("cy", function(d) { return yScale(d[plot_metric]) - (padding_adj*2) }) // making adjustments based on transformations for axes;
                .attr("r", 3.5)
                .style("fill", function(d) {return color(d.tactic); })
                .on("click", function(d) {
                  scope.date = dateformat(d.date);
                  scope.name = d.tactic;
                  scope.metric = plot_metric === 'spend' ? d3.format("$,.2f")(d[plot_metric]) : d[plot_metric];
                  scope.mname = d3Service.map(plot_metric);
                  scope.$apply();
                });
          }
        }
      }
  }
})