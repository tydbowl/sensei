angular.module('starter.controllers.advertiser', [
  'reporting.constants',
  'reporting.service'
])

.controller('AdvertiserCtrl', function($scope, $stateParams, api, $q, reporting, metrics, $state){
  $scope.$watch('creativeLibraries', qTest('creativeLibraries'));
  $scope.$watch('cachedReports', qTest('cachedReports'));

  var BUYSIDE_URL   = 'native_advertising/buy_side/';
  var REPORTING_URL = 'reporting/report_info';

  // var ADVERTISER_ID = $stateParams.advertiserId;
  var ADVERTISER_ID = 30;

  $scope.advertiserId  = ADVERTISER_ID;
  $scope.metrics       = metrics;
  $scope.loading       = [];
  $scope.cachedReports = [];

  $scope.expand    = expand;
  $scope.collapse  = collapse;
  $scope.isLoading = isLoading;
  $scope.chartReady = chartReady;
  $scope.state = $state;
  $scope.test = test;

   function test(message){
    console.log(message);
  }

  init();
  function init() {
    api.get('advertiser?id='+ADVERTISER_ID)
    .then(getData('data'))
    .then(getData('advertiser'))
    .then(setData($scope, 'advertiser'));

    var params = {params: {advertiser_id: ADVERTISER_ID}};

    // api.get(BUYSIDE_URL + 'tactic', params)
    //    .then(qTest('tactics success'), qTest('tactics error'))
    //    .then(getData('data'))
    //    .then(getData('tactics'))
    //    .then(setData($scope, 'tactics'))
    //    .then(resolveOrReject(hasLength))
    //    .then(indexIntoArrAt([0]), qTest('no tactics', true))

    api.get(BUYSIDE_URL + 'creative_library', params)
       .then(qTest('creative libraries success'), qTest('creative libraries error'))
       .then(getData('data'))
       .then(getData('creative_libraries'))
       .then(setData($scope, 'creativeLibraries'))
       .then(resolveOrReject(hasLength))
       .then(indexIntoArrAt([0]), qTest('no creative libraries', true))
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

  function setDataInArray(obj, propName, index) {
    return function(data){
      obj[propName][index] = data;
      return data;
    }
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

  function reportingPost(params){
 //   return function(creativeLibraryIds){
//      var params = paramsMaker(creativeLibraryIds);
      console.log("reporting params: ", params);
      return api.post(REPORTING_URL, params);
//    };
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

  function expand($index){
    startLoading($index);
    $scope.openIndex = $index;
    var cl_id = $scope.creativeLibraries[$index]['id'];
    var params = makeReportingParams([cl_id]);
    reportingPost(params)
       .then(qTest('reporting data'))
       .then(getData('data'))
       .then(getData('report_id'))
       .then(generateReport)
       .then(qTest('what is my reporting data!'))
    // prob do some shyte with d3, yeah?
       .then(doneLoadingFn($index));
  }

  function collapse($index){
    $scope.openIndex = -1;
  }

  function isLoading($index) {
    console.log("isLoading Called:" + $scope.loading[$index]);
    return $scope.loading[$index];
  }

  function startLoading($index){
    $scope.loading[$index] = true;
  }

  function doneLoadingFn($index) {
    return function(data){
      $scope.cachedReports[$index] = data;
      $scope.loading[$index] = false;
      return data;
    }
  }

  function chartReady($index){
    return !isLoading($index) && angular.isDefined($scope.cachedReports[$index]);
  }
});