// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic','ionic.service.core','ionic.service.deploy',
  'starter.controllers',
  'starter.controllers.login',
  'starter.controllers.advertiser',
  'reporting.controllers',
  // 'reporting.directive',
  'reporting.service',
  'reporting.map',
  'reporting.filters',
  'reporting.constants',
  'reporting.graphs',
  'starter.constants',
  'starter.controllers.advertiser_select',
  'starter.services'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

// intercept every $http request and add appropriate auth token!
.config(function($httpProvider) {
  $httpProvider.interceptors.push('authToken');
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  //Advertiser selector screen...
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('advertisers', {
    url          : '/advertisers',
    templateUrl  : 'templates/select.html',
    controller   : 'AdvSelectCtrl'
  })

  .state('advertiser', {
    url          : '/advertiser/:advertiserId',
    templateUrl  : 'templates/select-report.html',
    controller   : 'AdvertiserCtrl'
  })

  .state('reporting', {
    abstract     : true,
    url          : '/reporting/:advertiserId',
    template     : '<ui-view />',
    controller   : 'AdvertiserCtrl'
  })

  .state('reporting.insertion-orders', {
    url          : '/insertion-orders',
    templateUrl  : 'app/reporting/reporting.tpl.html',
    controller   : 'ReportingCtrl'
  })

  .state('reporting.line-items', {
    url          : '/line-items',
    templateUrl  : 'app/reporting/reporting.tpl.html',
    controller   : 'ReportingCtrl'
  })

  .state('reporting.tactics', {
    url          : '/tactics',
    templateUrl  : 'app/reporting/reporting.tpl.html',
    controller   : 'ReportingCtrl'
  })

  .state('reporting.creative-libraries', {
    url          : '/creatives',
    templateUrl  : 'app/reporting/reporting.tpl.html',
    controller   : 'ReportingCtrl'
  })

  .state('reporting.creative-assets', {
    url          : '/creatives',
    templateUrl  : 'templates/creative-list.tpl.html'
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
    url: '/chats',
    views: {
      'tab-chats': {
        templateUrl: 'templates/tab-chats.html',
        controller: 'ChatsCtrl'
      }
    }
  })
  .state('tab.chat-detail', {
    url: '/chats/:chatId',
    views: {
      'tab-chats': {
        templateUrl: 'templates/chat-detail.html',
        controller: 'ChatDetailCtrl'
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});