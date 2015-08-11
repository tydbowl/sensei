angular.module('starter.controllers.advertiser_select', [])

.controller('AdvSelectCtrl', function($scope, api, $state) {

  getAdvertisers();

  console.log("AdvSelectCtrl in business");

  $scope.test = test;
  $scope.goTo = goTo;

  function getAdvertisers() {
    return api.get('advertiser', {
      params: { active: 0 }
    }).then(renderAdvertisers);
  }

  function renderAdvertisers(resp) {
    $scope.advertisers = resp.data.advertisers;
    $scope.fetched     = true;
  }

  function test(message){
    console.log(message);
  }

  function goTo(advertiserId){
    $state.go('advertiser', {advertiserId: advertiserId});
  }
});