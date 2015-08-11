angular.module('reporting.service', [])

.service('d3Service', function($rootScope, $http, $q, $timeout, env) {

  var _advertiser_id, _start_date, _end_date, _report_id;
  var _limit = 100;
  var baseUrl = env.dev;
  var getUrl = baseUrl + 'reporting/async_report';
  var postUrl = baseUrl + 'reporting/report_info';
  var today = new Date(Date.now());
  var group_by = [], filter;

  this.getReportID = function(cb) {
    var params = {
      "advertiser_id": _advertiser_id,
      "start_date": _start_date,
      "end_date": _end_date,
      "filters": {},
      "format": "json",
      "report_for": "advertiser",
      "group_by": group_by, // only tactic level reporting for now
      "title": "Report" }

    $http.post(postUrl, params)
      .success(function(data){
        get_params = getParams(data.report_id, _limit)
        var def = $q.defer();
        getJSON(get_params).then(pollReports(get_params, def, cb));
      })
      .error(function(data, status, headers, config) {
        alert(status);
      })
  }

  function pollReports(params, def, cb) {
    return function(resp) {
      var status = resp.data.report_status;
      if (status === 'complete') {
        def.resolve(cb(resp));
      } else if (status === 'pending') {
        $timeout(function() {
          getJSON(params).then(pollReports(params, def, cb));
        }, 1000);
      } else {
        alert('Report generation not successful.')
      }
    }
  }

  function getJSON(params) {
    return $http.get(getUrl, { params : params });
  }

  this.setDates = function(direction) {
    if(!direction){
      var start_month = today.getMonth()+1;
      var start_year = today.getYear()+1900;
      var plusMonth = new Date(today.setMonth(today.getMonth() + 1));
      var end_month = plusMonth.getMonth()+1;
      var end_year = plusMonth.getYear()+1900;

      if(start_month<10){
        start_month = '0'+start_month;
      }
      if(end_month<10){
        end_month = '0'+end_month;
      }
      _start_date = start_year+'-'+start_month+'-01';
      _end_date = end_year+'-'+end_month+'-01';
      new Date(today.setMonth(today.getMonth() - 1)); //reset
      return today;
    } else if(direction === 'previous') {
      var minusMonth = new Date(today.setMonth(today.getMonth() - 1));
      var start_month = today.getMonth()+1;
      var start_year = today.getYear()+1900;
      var plusMonth = new Date(today.setMonth(today.getMonth() + 1));
      var end_month = today.getMonth()+1;
      var end_year = plusMonth.getYear()+1900;

      if(start_month<10){
        start_month = '0'+start_month;
      }
      if(end_month<10){
        end_month = '0'+end_month;
      }
      _start_date = start_year+'-'+start_month+'-01';
      _end_date = end_year+'-'+end_month+'-01';
      new Date(today.setMonth(today.getMonth() - 1)); //reset
      return today;
    } else if(direction === 'next') {
      var minusMonth = new Date(today.setMonth(today.getMonth() + 1));
      var start_month = today.getMonth()+1;
      var start_year = today.getYear()+1900;
      var plusMonth = new Date(today.setMonth(today.getMonth() + 1));
      var end_month = today.getMonth()+1;
      var end_year = plusMonth.getYear()+1900;

      if(start_month<10){
        start_month = '0'+start_month;
      }
      if(end_month<10){
        end_month = '0'+end_month;
      }
      _start_date = start_year+'-'+start_month+'-01';
      _end_date = end_year+'-'+end_month+'-01';
      new Date(today.setMonth(today.getMonth() - 1)); //reset
      return today;
    }
  }

  this.setAdvertiser = function(advertiser) {
    _advertiser_id = advertiser;
  }

  this.setGroup = function(group) {
    group_by = group.concat("ymd");
  }

  this.setFilter = function(filter) {
    filter = filter;
  }

  function getParams(report_id, limit) {
    return {
      id: report_id,
      format: 'json',
      size: limit,
      offset: 0
    }
  }
});