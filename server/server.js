var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var schedule = require('node-schedule');

// twitter bot
var tweetBot = require('./twitter.js');

// database
var db = require('./db.js');

// models
var models = require('./models.js');

//API keys and passport configuration
var passportConfig = require('./config/passport.js');

// server config
var port = process.env.PORT || 3000;
var app = express();

// middleware
app.use(express.static(__dirname + './../public'));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

//subrouters
// app.use('/api', require('./routers/apiRoutes.js'));


///////////////////////////////////
/////////dbroutes//////////////////
///////////////////////////////////

// fetch from db
app.get('/api/models/:model/:key/:value', function(req, res) {
  var searchObject = {};
  searchObject[req.params.key] = req.params.value;
  db.handleGet(req.params.model, searchObject, function(results) {
    res.status(200).send(results);
  });
});
// create new model
app.post('/api/models/:model', function(req, res) {
  db.handlePost(req.params.model, req.body, function(results) {
    res.status(200).send(results);
  });
});
// delete a model
app.delete('/api/models/:model/:key/:value', function(req, res) {
  var searchObject = {};
  searchObject[req.params.key] = req.params.value;

  db.handleDelete(req.params.model, searchObject, function(results) {
    res.status(200).send(results);
  });
});
// change a model
app.put('/api/models/:model', function(req, res) {
  db.handlePut(req.params.model, req.body, function(results) {
    res.status(200).send(results);
  });
});

//
// twitter
//
app.get('/twitter/statuses/show/:id', function(req, res) {
  console.log("SERVER: get /twitter/statuses/" + req.params.id);
  tweetBot.getTweetById(req.params.id, function(results) {
    console.log('SERVER: tweet fetched');
    res.status(200).send(results);
  });
});
app.post('/userObj', function(req, res) {
  tweetBot.getUserObj(req.body.handle, res);
});

app.post('/twitterStream', function(req, res) {
  console.log('post /twitterStream recieved: changing stream');
  tweetBot.changeStream(io, req.body);
  res.status(200).send('SERVER: changed stream');
});


//TODO: this is terrible need to fix.
var autoTweet = function() {
  var targets, messages, hashtags;
  // wait
  models.Target.find({}).then(function(data) {
    targets = data;
    console.log('targets done');
    targets.forEach(function(target) {
      console.log(target.handle);
    });
    console.log('________________');
    // wait
    models.Message.find({}).then(function(data) {
      messages = data;
      console.log('messages done');
      messages.forEach(function(message) {
        console.log(message.text);
      });
      console.log('________________');
      //wait
      models.HashTag.find({}).then(function(data) {
        hashtags = data;
        console.log('hashtags done');
        hashtags.forEach(function(hashtag) {
          console.log(hashtag.text);
        });
        console.log('________________');
        // console.log('hashtags done', hashtags);

        function randomElement(array) {
          var size = array.length;
          return array[Math.floor(Math.random() * size)];
        };

        for (var i = 0; i < targets.length; i++) {
          targets[i].loop = new schedule.scheduleJob(targets[i].interval, function(target) {
            messages = randomElement(messages).text + ' #' + randomElement(hashtags).text;
            console.log('cron message________@' + target.handle + '_________');
            console.log('message: ', messages);
            // uncomment to enable tweets
            tweetBot.sendTweetToUser(target.handle, messages);
          }.bind(null, targets[i], messages, hashtags));
          console.log(targets[i].interval);
        }
      });
    });
  });
};

// autoTweet();

console.log('app listening: ', port);
var server = app.listen(port);
var io = require('socket.io').listen(server);
tweetBot.init(io);
