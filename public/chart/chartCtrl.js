angular.module('chart.ctrl', [])

.controller('chartCtrl', ['$scope', 'tweetFactory', '$http', '$rootScope', function($scope, tweetFactory, $http, $rootScope) {
  $scope.showChart = false;

  $scope.options = {
    responsive: true,
    maintainAspectRatio: true,
    barDatasetSpacing: 1,
    barShowStroke: true,
    barStrokeWidth: 2,
    barValueSpacing: 5
  };

  $rootScope.$watch('hashTagKeys', function() {
    $scope.labels = $rootScope.hashTagKeys;
    $scope.data = $rootScope.hashTagValues;
    $scope.showChart = true;
  });

  $scope.tweets = [];
  $scope.test = function(tweet) {
    console.log(tweet);
  };

}, ]);
