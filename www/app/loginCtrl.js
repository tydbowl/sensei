angular.module('starter.controllers.login', ['ipCookie'])

.controller('LoginCtrl', function($scope, ipCookie, api, $state, $timeout){

  $scope.user   = {};
  $scope.signIn = signIn;
  $scope.showError = 'none';

  function signIn(user) {
    $scope.error = null;
    api.post('login', {
      username  : user.username,
      password  : user.password
    })
    .success(success('login'))
    .error(fail({message: "Login Failed!"}));
  }

  function success(cookieName, rememberUser){
    return function (data) {
      console.log("cookie data: ", data);
      setLogin(cookieName, data, rememberUser);
      $state.go('advertisers');
    };
  }

  function fail(obj){
    return function(data){
      $scope.error = obj.message;
      $scope.showError = 'block';
      $timeout(function() {
        $scope.showError = 'none';
      }, 6000);
    };
  }

  function setLogin(cookieName, data) {
    var opt = { path: '/', expires: 1000 };
    ipCookie(cookieName, data, opt);
  }
});