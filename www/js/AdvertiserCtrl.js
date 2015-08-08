angular.module('starter.controllers.advertiser', [])

.controller('AdvertiserCtrl', function($scope, $stateParams){
  $scope.advertiserId = $stateParams.advertiserId;
});