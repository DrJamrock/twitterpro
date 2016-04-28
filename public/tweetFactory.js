angular.module('tweet.factory', [])

  .factory('tweetFactory', ['$http', 'Server', '$rootScope', function($http, Server, $rootScope) {
  var factory = {};

  factory.getUserObj = function(handle, callback) {
    console.log('getting info for handle: ', handle);
    $http.post(Server.url + 'userObj', {
      handle: handle
    }).then(function(user) {
      console.log('got back this user', user);
      callback(user.data);
    });
  };

  factory.getMyTweets = function() {
    console.log('getting my tweets');
    $http.get(Server.url + 'myTweets')
      .then(function(err, data) {
        console.log('err', err, 'data', data);
      });
  };


  var socket = io.connect(Server.url);
  factory.stream = {
    on: function(eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          callback.apply(socket, args);
        });
      });
    }
  };
  var counter = {};
  factory.handleTweet = function(tweet) {
    var tweetArr = tweet.text.split(' ');
    // loop trough the words in the tweet
    for (var i = 0; i < tweetArr.length; i++) {
      // if a word is a hashtag
      if (/(^|\s)(#[a-z|A-Z\d-]+)/.test(tweetArr[i])) {
        // increment the counter
        if (!counter[tweetArr[i]]) {
          counter[tweetArr[i]] = 0;
        }
        counter[tweetArr[i]]++;
        // reset the root scope arrays
        $rootScope.hashTagKeys = [];
        $rootScope.hashTagValues = [
          []
        ];
        // loop through the counter
        for (var key in counter) {
          if (counter[key] > 3 && key.length < 17) {
            var phase = $rootScope.$$phase;
            if (phase == '$apply' || phase == '$digest') {
              //push key
              $rootScope.hashTagKeys.push(key);
              // push value
              $rootScope.hashTagValues[0].push(counter[key]);
            } else {
              $rootScope.$apply(function() {
                //push key
                $rootScope.hashTagKeys.push(key);
                // push value
                $rootScope.hashTagValues[0].push(counter[key]);
              });
            }
          }
        }
      }
    }
  };
  return factory;
}, ]);
