angular.module('starter.controllers', [])

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
})

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
