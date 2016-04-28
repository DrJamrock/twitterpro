var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var keys = require('../../twitterKeys.js');

var User = require('../models.js').user;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */
// Sign in with Twitter.

passport.use(new TwitterStrategy({
  consumerKey: keys.consumer_key,
  consumerSecret: keys.consumer_secret,
  callbackURL: '/auth/twitter/callback',
  passReqToCallback: true
}, function(req, accessToken, tokenSecret, profile, done) {
  if (req.user) {
    User.findOne({
      twitter: profile.id
    }, function(err, existingUser) {
      if (existingUser) {
        req.flash('errors', {
          msg: 'There is already a Twitter account that belongs to you. Sign in with that account or delete it, then link it with your current account.'
        });
        done(err);
      } else {
        User.findById(req.user.id, function(err, user) {
          user.twitter = profile.id;
          user.tokens.push({
            kind: 'twitter',
            accessToken: accessToken,
            tokenSecret: tokenSecret
          });
          user.profile.name = user.profile.name || profile.displayName;
          user.profile.location = user.profile.location || profile._json.location;
          user.profile.picture = user.profile.picture || profile._json.profile_image_url_https;
          user.save(function(err) {
            req.flash('info', {
              msg: 'Twitter account has been linked.'
            });
            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({
      twitter: profile.id
    }, function(err, existingUser) {
      if (existingUser) {
        return done(null, existingUser);
      }
      var user = new User();
      // Twitter will not provide an email address.  Period.
      // But a person’s twitter username is guaranteed to be unique
      // so we can "fake" a twitter email address as follows:
      user.email = profile.username + "@twitter.com";
      user.twitter = profile.id;
      user.tokens.push({
        kind: 'twitter',
        accessToken: accessToken,
        tokenSecret: tokenSecret
      });
      user.profile.name = profile.displayName;
      user.profile.location = profile._json.location;
      user.profile.picture = profile._json.profile_image_url_https;
      user.save(function(err) {
        done(err, user);
      });
    });
  }
}));

exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

exports.isAuthorized = function(req, res, next) {
  var provider = req.path.split('/').slice(-1)[0];

  if (_.find(req.user.tokens, {
      kind: provider
    })) {
    next();
  } else {
    res.redirect('/auth/' + provider);
  }
};
