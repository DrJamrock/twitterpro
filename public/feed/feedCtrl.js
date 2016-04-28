angular.module('feed.ctrl', ['tweet.factory'])

.controller('feedCtrl', ['$scope', 'tweetFactory', '$http', '$rootScope', '$log', function($scope, tweetFactory, $http, $rootScope, $log) {
  console.log('feedCTRL');

  $scope.streaming = true;
  $scope.tweets = [];
  $scope.tracking = 'default';
  tweetFactory.stream.on('tweets', function(data) {
    tweetFactory.handleTweet(data[0]);
    if ($scope.streaming) {
      $scope.tweets = data.concat($scope.tweets);
    }
  });
  $scope.changeStream = function(query) {
    console.log(query);
    $scope.tracking = query;
    var queryObj = {
      'track': query
    };
    $http.post('//localhost:3000/twitterStream', queryObj).then(function(results) {
      console.log("success");
      $scope.query = '';
    });
  };

  $scope.pauseStream = function() {
    $log.info('clicked');
    $scope.streaming = !$scope.streaming;
    $log.log('streaming?: ', $scope.streaming);
  };
  $scope.getTweet = function(i) {
    console.log('clicked: ', $scope.tweets[i]);

  };
}, ]);
