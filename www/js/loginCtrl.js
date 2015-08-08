angular.module('starter.controllers.login', ['ipCookie'])

.controller('LoginCtrl', function($scope, ipCookie, $http){
  $scope.hello = {name: 'jonathan'};

  $scope.user = {};

  $scope.$watch('user', function(user){console.log("user: ", user)}, true);

  function attemptLogin() {
    api.post('login', {
      username  : $scope.email,
      password  : $scope.pw
    })
    .success($scope.success('login', $scope.rememberMe))
    .error(fail);
  }

  function setLogin(cookieName, data, rememberMe) {
    var opt = { path: '/', domain: DOMAIN };

    if (rememberMe) {
      opt.expires = 1000;
    }

    ipCookie(cookieName, data, opt);
  }
});