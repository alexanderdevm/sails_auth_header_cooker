/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
/*global Users, jwToken */

module.exports = {
  index: function (req, res) {
    'use strict';

    var email = req.param('email');
    var password = req.param('password');

    if (!email || !password) {
      return res.json(401, { err: 'email and password required' });
    }

    Users.findOne({ email: email }, function (err, user) {
      if (!user) {
        return res.json(401, { err: 'Invalide email' });
      }

      user.comparePassword(password, user, function (err, valid) {
        if (err) {
          return res.json(403, { err: 'forbidden' });
        }

        if (!valid) {
          return res.json(401, { err: 'invalid email or password' });
        }

        res.json({
          user: user,
          token: jwToken.issue({ id: user.id })
        });

      });
    });
  }
};
