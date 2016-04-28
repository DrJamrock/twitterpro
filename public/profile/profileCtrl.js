angular.module('profile.ctrl', ['db.factory', 'tweet.factory'])

.controller('profileCtrl', ['$scope', 'dbFactory', 'tweetFactory', '$log', function($scope, dbFactory, tweetFactory, $log) {
  $scope.user = {};
  $scope.toggle = 0;
  $scope.showTargetState = false;
  $scope.activeTarget;


  // load "users" profile
  tweetFactory.getUserObj("1213Coder", function(user) {
    $scope.user.twitter = user;
  });

  // create and invoke functions to refresh $scope from db;
  // get data and save to scope
  $scope.cronHandler = function(cronType, value) {
    $scope.userCron[cronType] = value;
  };

  $scope.makeCronTab = function(cron) {
    var result = '';
    if (!cron) {
      cron = $scope.userCron;
    }
    for (var key in cron) {
      if (cron[key] === 'every') {
        result += '* ';
      } else {
        result += cron[key] + ' ';
      }
    }

    result = result.substring(0, result.length - 1);
    return result;
  };

  // targets
  $scope.fetchTargets = function() {
    dbFactory.getModel('target', '/list/' + $scope.activeList, function(results) {
      $scope.target = results;
    });
  };
  // messages
  $scope.fetchMessages = function() {
    dbFactory.getModel('message', '/list/' + $scope.activeList, function(results) {
      $scope.message = results;
    });
  };
  // hashtags
  $scope.fetchHashtags = function() {
    dbFactory.getModel('hashtag', '/list/' + $scope.activeList, function(results) {
      $scope.hashtag = results;
    });
  };
  // lists
  $scope.fetchLists = function(callback) {
    dbFactory.getModel('list', '/all/true', function(results) {
      $scope.list = results;
      if (callback) {
        callback(results);
      }
    });
  };
  $scope.changeList = function(list) {
    $scope.activeList = list;
    $scope.target = [];
    $scope.message = [];
    $scope.hashtag = [];
    dbFactory.getModel('target', '/list/' + list, function(results) {
      $scope.target = results;
    });
    dbFactory.getModel('message', '/list/' + list, function(results) {
      $scope.message = results;
    });
    dbFactory.getModel('hashtag', '/list/' + list, function(results) {
      $scope.hashtag = results;
    });
  };
  // get all lists
  $scope.fetchLists(function() {
    $scope.changeList($scope.list[0].name);
  });
  // targets
  $scope.addTarget = function(newTarget) {
    $scope.newTarget = "";
    newTarget.list = $scope.activeList;
    newTarget.interval = $scope.makeCronTab();
    dbFactory.createModel('target', newTarget, function(results) {
      $scope.fetchTargets();
    });
  };

  // messages
  $scope.addMessage = function(message) {
    message.list = $scope.activeList;
    $scope.newMessage = "";
    dbFactory.createModel('message', message, function(results) {
      $scope.fetchMessages();
    });
  };
  // list
  $scope.addList = function(list) {
    $scope.newList = "";
    dbFactory.createModel('list', list, function(results) {
      $scope.fetchLists();
    });
  };

  // hashtags
  $scope.addHashtag = function(hashtag) {
    $scope.newHashtag = "";
    hashtag.list = $scope.activeList;
    dbFactory.createModel('hashtag', hashtag, function(results) {
      $scope.fetchHashtags();
    });
  };

  $scope.logger = function(i) {
    $scope.toggle = i;
  };

  // dropdowns
  $scope.userCron = {
    minute: 'every',
    hour: 'every',
    day: 'every',
    month: 'every',
    dayOfWeek: 'every'
  };


  $scope.items = [
    'The first choice!',
    'And another choice for you.',
    'but wait! A third!'
  ];

  $scope.status1 = {
    isopen: false
  };

  $scope.toggled = function(open) {
    $log.log('Dropdown is now: ', open);
  };

  $scope.toggleDropdown = function($event) {
    console.log('event', $event);
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };

  $scope.deleteModel = function(type, $index) {
    dbFactory.deleteModel(type, '/_id/' + $scope[type][$index]['_id'], function(results) {
      $scope.fetchTargets();
      $scope.fetchMessages();
      $scope.fetchHashtags();
      $scope.fetchLists();
    });
  };

  $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));

  $scope.userChangeList = function(i) {
    $scope.changeList($scope.list[i].name);
  };
  $scope.viewTargetProfile = function(i) {
    var user = $scope.target[i];
    tweetFactory.getUserObj(user.handle, function(result) {
      $scope.activeTarget = result;
    });
  };
}, ]);
