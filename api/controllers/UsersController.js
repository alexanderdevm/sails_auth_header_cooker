/**
 * UsersController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
/*global Users, jwToken */

module.exports = {
  create: function (req, res) {
    'use strict';

    if (req.body.password !== req.body.confirmPassword) {
      return res.json(401, { err: "Password doesnt match" });
    }
    Users.create(req.body).exec(function (err, user) {
      if (err) {
        return res.json(err.status, { err: err });
      }

      if (user) {
        res.json(200, { user: user, token: jwToken.issue({ id: user.id }) });
      }
    });
  },
  login: function (req, res) {
    'use strict';
    var email = req.param('email');
    var password = req.param('password');
    if (!email || email.length === 0) {
      return res.badRequest({ err: "Email is missing." });
    }

    if (!password || password.length === 0) {
      return res.badRequest({ err: "password is missing." });
    }

    Users.findOne({ email: email }, function (err, user) {
      if (err) {
        return res.negotiate({ err: err });
      }

      if (!user) {
        return res.notFound({ err: "not found" });
      }
      console.log(user.encryptedPassword);

      Users.comparePassword(password, user, function (err, valid) {

        if (err) {
          return res.negotiate({ err: err });
        }
        if (!valid) {
          return res.forbidden({ err: "forbidden" });
        }
        var token = jwToken.issue({ id: user.id });
        res.cookie('Authorization', 'Bearer ' + token);
        res.json({
          user: user,
          token: token
        });


      });
    });
  },
  logout: function (req, res) {
    'use strict';

    res.clearCookie('Authorization');
    res.ok();
  }
};
