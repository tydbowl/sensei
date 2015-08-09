angular.module('starter.services', [])

.factory('api', ['$http', function api($http) {
  function httpFactory(method) {
    var ROOT_URL = 'http://sand-api.triplelift.net/'
    return function httpRequest(url, params, config) {
      config = config || {};
      return $http[method](ROOT_URL + url, params, config);
    };
  }

  return {
    get   : httpFactory('get'),
    post  : httpFactory('post'),
    put   : httpFactory('put'),
    del   : httpFactory('delete')
  };
}])

.factory('authToken', function(ipCookie) {

  return {
    request: function(config) {
      config.headers || (config.headers = {});

      var cookie = ipCookie('login');
      var token = cookie && cookie.token;
      token && (config.headers['Auth-token'] = token);
      return config;
    }
  };

})

.factory('reporting', function($timeout, $q, api) {

  return {
    runReport: runReport,
    emailReport: emailReport,
    displayReport: displayReport,
    exportReport: exportReport,
    fromScheduled: false
  };

  function runReport(report) {
    return api.post('reporting/report_info', report);
  }

  function exportReport(resp, format) {
    var params = {
      id: resp.data.report_id,
      format: format || 'csv'
    };
    var def = $q.defer();

    reportGet(params).then(pollReports(params, def));
    return def.promise;
  }

  function displayReport(reportId, format, size, offset) {
    var params = {
      id: reportId,
      format: format || 'json',
      size: size || 10,
      offset: offset || 0
    };
    var def = $q.defer();

    reportGet(params).then(pollReports(params, def));
    return def.promise;
  }

  function emailReport(resp, report) {
    var params = {
      id: resp.data.report_id,
      format: report.format,
      emails: report.emails
    };
    var def = $q.defer();

    reportGet(params).then(pollReports(params, def));
    return def.promise;
  }

  function pollReports(params, def) {
    //console.log(params.id); //for debugging
    return function(resp) {
      var status = resp.data.report_status;
      if (status === 'complete') {
        def.resolve(resp);
      } else if (status === 'pending') {
        $timeout(function() {
          reportGet(params).then(pollReports(params, def));
        }, 1000);
      } else {
        // TODO: handle error
      }
    };
  }

  function reportGet(params) {
    return api.get('reporting/async_report', { params : params });
  }
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
