angular.module('reporting.constants', [])

.constant('metrics', [
  {
    name: 'spend',
    icon: 'fa fa-usd'
  },
  {
    name: 'imps',
    icon: 'fa fa-eye'
  },
  {
    name: 'clicks',
    icon: 'fa fa-hand-o-down'
  },
  {
    name: 'mouseovers',
    icon: 'fa fa-mouse-pointer'
  },
  {
    name: 'shares',
    icon: 'fa fa-share-alt '
  },
  {
    name: 'social',
    icon: 'fa fa-users'
  },
  {
    name: 'ctr',
    icon: 'fa fa-arrow-circle-right'
  },
  {
    name: 'mouserate',
    icon: 'fa fa-reply-all'
  }
])

.constant('hierarchy', [
  {
    name: 'Insertion Orders',
    state: 'reporting-insertion-orders'
  },
  {
    name: 'Line Items',
    state: 'reporting-line-items'
  },
  {
    name: 'Tactics',
    state: 'reporting-tactics'
  },
  {
    name: 'Creative Libraries',
    state: 'reporting-creative-libraries'
  }
])

.constant('keys', ['date', 'name', 'imps', 'clicks', 'mouseovers', 'shares', 'social', 'ctr', 'mouserate', 'spend']);