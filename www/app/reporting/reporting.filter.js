angular.module('reporting.filters', ['reporting.map'])

.filter('metricMap', function(reportingMap) {
  return function(item) {
    var filtered = reportingMap.map(item);
    return filtered;
  };
})

.filter('typeMap', function(reportingMap) {
  return function(item) {
    var filtered = reportingMap.typeDataMap(item);
    return filtered;
  };
})

.filter('nextStateTitle', function(reportingMap) {
  return function(item) {
    var filtered = reportingMap.stateNextMap(item).title;
    return filtered;
  };
})

.filter('nextState', function(reportingMap) {
  return function(item) {
    var filtered = reportingMap.stateNextMap(item).state;
    return filtered;
  };
})

.filter('toNum', function() {
  return function(number) {
    return parseFloat(number.replace(',', '').replace('$','').replace('%',''));
  }
})