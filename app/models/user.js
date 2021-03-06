var mongoose = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

userSchema = mongoose.Schema({
    username: String,
    password: String
  });
  userSchema.methods = {};
  userSchema.methods.comparePassword = function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
      callback(isMatch);
    });
  };
  userSchema.methods.hashPassword = function() {
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.password, null, null).bind(this)
      .then(function(hash) {
        this.password = hash;
      });
  };
  userSchema.pre('save', function(next) {
    userSchema.methods.hashPassword();
    next();
  });

module.exports = mongoose.model('User', userSchema);



// var bcrypt = require('bcrypt-nodejs');
// var Promise = require('bluebird');

// var User = db.model('User', db.userSchema);

// module.exports = User;

// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function(){
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function(){
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });

// module.exports = User;

