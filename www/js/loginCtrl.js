angular.module('starter.controllers.login', ['ipCookie'])

.controller('LoginCtrl', function($scope, ipCookie, api, $state){

  $scope.user   = {};
  $scope.signIn = signIn;

  function signIn(user) {
    $scope.error = null;
    
    api.post('login', {
      username  : user.username,
      password  : user.password
    })
    .success(success('login'))
    .error(fail({message: "Login failed: Please login again or kill yourself"}));
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
    };
  }

  function setLogin(cookieName, data) {
    var opt = { path: '/', expires: 1000 };
    ipCookie(cookieName, data, opt);
  }
});