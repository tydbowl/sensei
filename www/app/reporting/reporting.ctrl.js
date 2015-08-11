angular.module('reporting.controllers', [
  'reporting.service', 'reporting.filters', 'reporting.constants', 'reporting.map'])

.controller('ReportingCtrl',
  function($scope, $state, $filter, $window, d3Service, keys, metrics, reportingMap) {
  var _ = $window._, d3 = $window.d3; // underscore
  var collection_agg = {}, collection_stats = {}, agg = {};

  // TEMPLATE VARS
  $scope.tab       = "metrics";
  $scope.category  = "";
  $scope.tSelected = "all";
  $scope.empty     = false;
  $scope.state     = $state;
  $scope.metrics   = metrics;
  $scope.color     = d3.scale.category10();

  // DATA VARS
  $scope.dataGroup = reportingMap.stateDataMap($state.current.name);
  $scope.filter    = {};
  $scope.report    = [];
  $scope.agg       = {name: ''};

  $scope.data = {
    metric: 'spend',
    component_data: [],
    name: 'all',
    all_data: []
  };

  // EVENT HANDLER
  $scope.getNewMonthData = getNewMonthData;

  d3Service.setAdvertiser(30);
  $scope.today = d3Service.setDates();
  d3Service.setGroup([$scope.dataGroup]);
  d3Service.setFilter($scope.filter);

  // DATA PARSING
  d3Service.getReportID(scopeReportData);

  function getNewMonthData(direction) {
    d3Service.setDates(direction);
    d3Service.getReportID(scopeReportData);
  }

  function scopeReportData(data) {
    var report           = $scope.report;
    var all_data         = []; // all_data = all data for this month each data point has all metrics
    var all_data_by_name = []; // data_by_name = all data for this month each data point has all metrics
    report           = data.data.report.data;

    // plot all lines
    report.forEach(function(d){
      all_data.push(new DataPoint(d[0], d[1], d[2], d[3], d[4], d[5], d[6], d[7], d[8], d[9]));
    })
    $scope.data.all_data = all_data;

    keys.forEach(function(k) {
      collection_stats[k] = _.pluck(all_data, k);
    })

    $scope.data.collection_stats = collection_stats;

    metrics.forEach(function(m) {
      var aggSum = _.reduce(collection_stats[m.name], function(memo, num) {
        return memo + num;
      })
      collection_agg[m.name] = aggSum;
    })

    $scope.data.collection_agg = collection_agg;

    // plot individual lines
    var names = _.uniq(_.pluck(all_data, 'name'));
    $scope.names = names;
    names.forEach(function(n){
      all_data_by_name[n] = _.where(all_data, {name: n});
    })
    $scope.data.component_data = all_data_by_name;

    // parsing for individual tactic agg data
    for(name in all_data_by_name) {
      var temp = {}; agg[name] = {}; $scope.agg[name] = {};
      keys.forEach(function(k) {
        agg[name][k] = _.pluck(all_data_by_name[name], k);
      })
      metrics.forEach(function(m) {
        var aggSum = _.reduce(agg[name][m.name], function(memo, num) {
          return memo + num;
        })
        temp[m.name] = aggSum;
        console.log(aggSum, m.name);
      })
      $scope.agg[name].agg = temp;
    }

    report.length ? $scope.empty = false : $scope.empty = true;

  }

  function DataPoint(date, name, imps, clicks, mouseovers, shares, social, ctr, mouserate, spend) {
    this.date       = new Date(date);
    this.name       = name;
    this.imps       = $filter('toNum')(imps);
    this.clicks     = $filter('toNum')(clicks);
    this.mouseovers = $filter('toNum')(mouseovers);
    this.shares     = $filter('toNum')(shares);
    this.social     = $filter('toNum')(shares);
    this.ctr        = $filter('toNum')(ctr)/100; // percentage
    this.mouserate  = $filter('toNum')(mouserate)/100; // percentage
    this.spend      = $filter('toNum')(spend); // money
  }

})