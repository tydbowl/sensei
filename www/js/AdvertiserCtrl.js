angular.module('starter.controllers.advertiser', [])

.controller('AdvertiserCtrl', function($scope, $stateParams){
  var TACTIC_URL = 'native_advertising/buy_side/tactic';
  $scope.advertiserId = $stateParams.advertiserId;
});