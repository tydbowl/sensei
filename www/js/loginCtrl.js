angular.module('starter.controllers.login', [])

.controller('LoginCtrl', function($scope){
  $scope.hello = {name: 'jonathan'};

  $scope.user = {};

  $scope.$watch('user', function(user){console.log("user: ", user)}, true);
});