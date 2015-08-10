angular.module('reporting.filters', ['reporting.service'])

.filter('metricMap', function(d3Service) {
  return function(item) {
    var filtered = d3Service.map(item);
    return filtered;
  };
});