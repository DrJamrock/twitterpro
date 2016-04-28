angular.module('home.ctrl', ['tweet.factory'])

.controller('homeCtrl', ['$scope', 'tweetFactory', '$http', function($scope, tweetFactory, $http) {
  console.log('homeCTRL');

}, ]);
