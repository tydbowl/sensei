angular.module('starter.controllers.advertiser', [])

.controller('AdvertiserCtrl', function($scope, $stateParams, api, $q, reporting){
  $scope.$watch('creativeLibraries', qTest('creativeLibraries'));

  var BUYSIDE_URL   = 'native_advertising/buy_side/';
  var REPORTING_URL = 'reporting/report_info';

  var ADVERTISER_ID = $stateParams.advertiserId;

  $scope.advertiserId = ADVERTISER_ID;

  init();
  function init() {
    // var path = 'native_advertising/buy_side/';
    // var id = user.info().member.selected_advertiser.id;
    var params = {params: {advertiser_id: ADVERTISER_ID}};

    // var ios = api.get(path + 'insertion_order', params);
    // var lineItems = api.get(path + 'line_item', params);
    // var tactics = api.get(path + 'tactic', params);
    api.get(BUYSIDE_URL + 'creative_library', params)
       .then(qTest('creative libraries success'), qTest('creative libraries error'))
       .then(getData('data'))
       .then(getData('creative_libraries'))
       .then(setData($scope, 'creativeLibraries'))
       .then(resolveOrReject(hasLength))
       .then(indexIntoArrAt([0]), qTest('no creative libraries', true))
       .then(getDataForEach('id'))
       .then(qTest('what are my reporting cl ids'))
       .then(reportingPost(makeReportingParams))
       .then(qTest('reporting data'))
       .then(getData('data'))
       .then(getData('report_id'))
       .then(generateReport)
       .then(qTest('what is my reporting data!'));

    // var deferreds = [ios, lineItems, tactics, cl];
    // $q.all(deferreds).then(success);
  }

  function qTest(message, bool){
    return function(data){
      console.log(message + ': ', data);
      return reject(data, bool);
    };
  }

  function getData(key){
    return function(data){
      return data[key];
    };
  }

  function indexIntoArrAt(indexes){
    return function(arr){
      return indexes.map(index(arr));
    };
  }

  function index(arr){
    return function(index){
      return arr[index];
    };
  }

  function getDataForEach(propName){
    return function(arr){
      return arr.map(getData(propName));
    };
  }

  function setData(obj, propName){
    return function(data){
      obj[propName] = data;
      return data;
    };
  }

  function resolveOrReject(whenFn){
    return function(data){
      var deferred = $q.defer();
      if (whenFn(data)) {
        deferred.resolve(data);
      } else {
        deferred.reject(data)
      }
      return deferred.promise;
    };
  }

  function hasLength(arr){
    return angular.isArray(arr) && arr.length;
  }

  function reject(returnVal, bool){
    return bool ? $q.reject(returnVal) : returnVal;
  }

  function reportingPost(paramsMaker){
    return function(creativeLibraryIds){
      var params = paramsMaker(creativeLibraryIds);
      console.log("reporting params: ", params);
      return api.post(REPORTING_URL, params);
    };
  }

  function makeReportingParams(creativeLibraryIds){
    return {
      "advertiser_id": ADVERTISER_ID,
      "report_for": "advertiser",
      "title": "Report",
      "format": "json",
      "filters": {"creative_library_id": creativeLibraryIds},
      "start_date": "1969-12-31",
      "end_date": "2015-08-09"
    };
  }

  function generateReport(reportId){
    return reporting.displayReport(reportId);
  }

});