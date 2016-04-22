var Twitter = require('twitter');
var twitterKeys = require('./../twitterKeys.js');
var tweetLimit = 5;
var tweetTimeout = 3600000;
var likeLimit = 1;
var likeTimeout = 60000;
var twit = new Twitter(twitterKeys);

var latestMentions = [];
var idStrings = {};
var tweetBot = {};
var twitterStream = {};
// requests user data from twitter, takes a user ID or screenname??
tweetBot.getUserObj = function(user, res) {
  twit.get('users/show', {
    screen_name: user
  }, function(err, obj) {
    if (err) {
      console.log("error in getUserObj");
      console.log(err);
    } else {
      console.log('returned twitter obj');
      res.status(200).send(obj);
    }
  });
};

tweetBot.getTweet = function (tweetId) {
  console.log('get tweet: does nothing yet');
};

// attaches a handle to a message and tweets it.
tweetBot.sendTweetToUser = function(user, tweet) {
  twit.post('statuses/update', {
    status: "@" + user + " " + tweet
  }, function(error, tweet) {
    if (error) {
      console.error(error);
    } else {
      console.log('-------');
      console.log('tweeted', tweet);
      console.log('-------');
    }
  });
};

// takes a string and tweets it with the current user.
tweetBot.tweet = function(tweetString) {
  console.log('in tweetBot.tweet');
  twit.post('statuses/update', {
    status: tweetString
  }, function(err, tweet) {
    if (err) {
      console.log('tweet errored', err);
    } else {
      console.log('tweet success');
    }
  });
};


// initiate the stream.
tweetBot.init = function(io, query) {
  if (!query) {
    query = "feelthebern";
  }
  var tweetsBuffer = [];
  twit.stream('statuses/filter', {
    track: query
  }, function(stream) {
    twitterStream = stream;
    console.log('--------------------');
    console.log('Connected to twitter');
    console.log('--------------------');
    stream.on('data', function(tweet) {
      var msg = {};
      msg.text = tweet.text;
      msg.tweet = tweet;
      msg.id = tweet.id_str;
      msg.user = {
        name: tweet.user.name,
        image: tweet.user.profile_image_url
      };
      tweetsBuffer.push(msg);
      //send buffer only if full
      if (tweetsBuffer.length >= tweetLimit) {
        //broadcast tweets
        io.sockets.emit('tweets', tweetsBuffer);
        tweetsBuffer = [];
      }
    });
  });
};
  tweetBot.changeStream = function (io, queryObj) {
  console.log('queryObj: ', queryObj);
  var tweetsBuffer = [];
  twitterStream.destroy();
  twit.stream('statuses/filter', queryObj, function(stream) {
    twitterStream = stream;
    console.log('------------------------');
    console.log('-Reconnected to twitter-');
    console.log('------------------------');
    stream.on('data', function(tweet) {
      if (!tweet.user) {
        tweet.user = {
          name: null,
          image: null
        };
      }
      var msg = {};
      msg.text = tweet.text;
      msg.id = tweet.id_str;
      msg.tweet = tweet;
      msg.user = {
        name: tweet.user.name,
        image: tweet.user.profile_image_url
      };
      tweetsBuffer.push(msg);
      //send buffer only if full
      if (tweetsBuffer.length >= tweetLimit) {
        //broadcast tweets
        io.sockets.emit('tweets', tweetsBuffer);
        tweetsBuffer = [];
      }
    });
  });
};
  tweetBot.getTweetById = function (id, callback) {
    twit.get('statuses/show/' + id, function (response) {
      callback(response);
      console.log('TWITTER: get message success', response);
    });
  }
  


module.exports = tweetBot;
