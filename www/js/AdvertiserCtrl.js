angular.module('starter.controllers.advertiser', [
  'reporting.constants',
  'reporting.service'
])

.controller('AdvertiserCtrl', function($scope, $stateParams, metrics){
  var TACTIC_URL = 'native_advertising/buy_side/tactic';
  $scope.advertiserId = $stateParams.advertiserId;
  $scope.metrics = metrics;
});