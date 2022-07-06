const Q = require('q');
const User = require('../models/user');
const UserController = require('./userController');
const ResetPassword = require('../models/resetPassword');
const randomstring = require("randomstring");

const self = {};

/**
 * @param email
 *      Email of the user
 * @return
 *     a Promise that gets fulfilled with a Mongoose model ResetPassword object
 */
self.findByEmail = function (email) {
    const deferred = Q.defer();
    ResetPassword.findOne({username: email}, function (err, doc) {
        if (err) {
            deferred.reject(err);
            return;
        }
        deferred.resolve(doc);
    });
    return deferred.promise;
};

/**
 * @param username
 *      Username of the user to which we would like to reset the password
 * @return
 *      a Promise that gets fulfilled with a Mongoose ResetPassword object
 */
self.save = function (username) {
    const deferred = Q.defer();
    const resetPassword = new ResetPassword();
    resetPassword.username = username;
    resetPassword.resetCode = randomstring.generate();
    resetPassword.save(function (err, doc) {
        if (err) {
            deferred.reject(err);
            return
        }
        deferred.resolve(doc);
    });
    return deferred.promise;
};

/**
 *
 * @param username
 */
self.delete = function (username) {
    const deferred = Q.defer();
    ResetPassword.findOne({username: username}).remove().exec((err, data) => {
        if (err) {
            deferred.reject(err);
            return;
        }
        deferred.resolve(data);
    });
    return deferred.promise;
};

self.resetPassword = function (username, resetCode, newPassword) {
    const deferred = Q.defer();
    self.findByEmail(username)
        .then((reset) => {
            if (reset.resetCode === code) {
                // find the user
                return UserController.findByEmail(username);
            } else {
                deferred.resolve(false);
            }
        })
        .then((user) => {
            user.setPassword(newPassword);
            return user.save();
        })
        .then((user) => {
            deferred.resolve(true);
        })
        .catch((err) => {
            deferred.resolve(false);
        });
    return deferred.promise;
};

module.exports = self;