var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  twitter: String,
  profile: {
    name: { typ: String, default: '' },
    gender: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    picture: { type: String, default: '' }
  }
}, { timestamps: true });

var ListSchema = mongoose.Schema({
  name: {
    type: String,
    index: {
      unique: true,
    },
  },
  user: String,
});

var TargetSchema = mongoose.Schema({
  handle: {
    type: String,
    index: {
      unique: true
    }
  },
  interval: String,
  list: String,
});

var MessageSchema = mongoose.Schema({
  text: {
    type: String,
    index: {
      unique: true
    }
  },
  list: String,
});

var HashTagSchema = mongoose.Schema({
  text: {
    type: String,
    index: {
      unique: true
    }
  },
  list: String,
});


var Target = mongoose.model('target', TargetSchema);
var Message = mongoose.model('message', MessageSchema);
var HashTag = mongoose.model('HashTag', HashTagSchema);
var User = mongoose.model('User', UserSchema);
var List = mongoose.model('List', ListSchema);

var models = {
  target: Target,
  message: Message,
  hashtag: HashTag,
  user: User,
  list: List
};

module.exports = models;
