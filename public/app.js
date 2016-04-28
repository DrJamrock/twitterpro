angular.module('app', [
  'ui.router',
  'ui.bootstrap',
  'home.ctrl',
  'feed.ctrl',
  'auth.ctrl',
  'profile.ctrl',
  'chart.ctrl',
  'db.factory',
  'tweet.factory',
  'chart.js',
])

.config(function($stateProvider, $urlRouterProvider) {
  console.log('in config');
  $stateProvider
    .state('home', {
      url: '/',
      views: {
        '@': {
          templateUrl: 'home/index.html',
          controller: 'homeCtrl'
        },
        'auth@home': {
          templateUrl: 'auth/auth.html',
          controller: 'authCtrl'
        },
        'feed@home': {
          templateUrl: 'feed/feed.html',
          controller: 'feedCtrl'
        },
        'profile@home': {
          templateUrl: '/profile/profile.html',
          controller: 'profileCtrl'
        },
        'chart@home': {
          templateUrl: '/chart/chart.html',
          controller: 'chartCtrl'
        },
      },
    });
  $urlRouterProvider.otherwise('/');
})

.run(function($rootScope) {
  console.log($rootScope.hashTagData);
  $rootScope.hashTagKeys, $rootScope.hashTagValues;
})

.constant('Server', {
  url: '//localhost:3000/'
});
