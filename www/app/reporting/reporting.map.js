angular.module('reporting.map', [])

.service('reportingMap', function() {
  this.map = function(name) {
    switch (name) {
      case 'imps': return 'Impressions'; break;
      case 'clicks': return 'Clicks'; break;
      case 'mouseovers': return 'Mouseovers'; break;
      case 'shares': return 'Shares'; break;
      case 'social': return 'Social'; break;
      case 'ctr': return 'Click Through Rate'; break;
      case 'mouserate': return 'Mouse Rate'; break;
      case 'spend': return 'Spend'; break;
    }
  }

  this.stateDataMap = function(type) {
    switch (type) {
      case 'reporting.insertion-orders': return 'insertion_order_id'; break;
      case 'reporting.line-items': return 'line_item_id'; break;
      case 'reporting.tactics': return 'tactic_id'; break;
      case 'reporting.creative-libraries': return 'creative_library_id'; break;
    }
  }

  this.typeDataMap = function(type) {
    switch (type) {
      case 'reporting.insertion-orders': return 'Insertion Orders'; break;
      case 'reporting.line-items': return 'Line Items'; break;
      case 'reporting.tactics': return 'Tactics'; break;
      case 'reporting.creative-libraries': return 'Creatives'; break;
    }
  }

  this.stateNextMap = function(type) {
    switch (type) {
      case 'reporting.insertion-orders':
        return {
          title: 'Line Items',
          state: 'line-items'
        }
        break;
      case 'reporting.line-items':
        return {
          title: 'Tactics',
          state: 'tactics'
        }
        break;
      case 'reporting.tactics':
        return {
          title: 'Creatives',
          state: 'creative-libraries'
        }
        break;
      case 'reporting.creative-libraries':
        return {
          title: 'Assets',
          state: 'creative-assets'
        }
        break;
    }
  }
})