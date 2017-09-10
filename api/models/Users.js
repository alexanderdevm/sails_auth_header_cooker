/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcrypt');

module.exports = {

  schema: true,

  attributes: {
    email: {
      type: 'email',
      required: 'true',
      unique: true
    },

    encryptedPassword: {
      type: 'string'
    },

    toJSON: function () {
      'use strict';

      var obj = this.toObject();
      delete obj.encryptedPassword;
      return obj;
    }
  },

  beforeCreate: function (values, cb) {
    'use strict';
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return cb(err);
      }
      bcrypt.hash(values.password, salt, function (err, hash) {
        if (err) {
          return cb(err);
        }
        values.encryptedPassword = hash;
        cb();
      });
    });
  },

  comparePassword: function (password, user, cb) {
    'use strict';
    console.log(user);
    bcrypt.compare(password, user.encryptedPassword, function (err, match) {
      if (err) {
        return cb(err);
      }
      if (match) {
        return cb(null, true);
      } else {
        return cb(err);
      }
    });
  }

};
