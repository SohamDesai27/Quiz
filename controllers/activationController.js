const Q = require('q');
const User = require('../models/user');
const UserController = require('./userController');
const Activation = require('../models/activation');
const randomstring = require("randomstring");

const self = {};

/**
 * @param email
 *      Email of the user
 * @return
 *     a Promise that gets fulfilled with a Mongoose model Activation object
 */
self.findByEmail = function (email) {
    const deferred = Q.defer();
    Activation.findOne({username: email}, function (err, activation) {
        if (err) {
            deferred.reject(err);
            return;
        }
        deferred.resolve(activation);
    });
    return deferred.promise;
};

/**
 * @param username
 *      Username of the user to which we would like to activate
 * @return
 *      a Promise that gets fulfilled with a Mongoose Activation Question object
 */
self.save = function (username) {
    const deferred = Q.defer();
    const activation = new Activation();
    activation.username = username;
    activation.code = randomstring.generate();
    activation.save(function (err, doc) {
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
    Activation.findOne({username: username}).remove().exec((err, data) => {
        if (err) {
            deferred.reject(err);
            return;
        }
        deferred.resolve(data);
    });
    return deferred.promise;
};

/**
 * Activates a specific user.
 * @param username
 *      The username of the user to be activated
 * @param code
 *      Activation code parsed from the URL
 * @returns boolean
 *      A boolean indicating whether this activation worked or not.
 */
self.activate = function (username, code) {
    const deferred = Q.defer();
    self.findByEmail(username)
        .then((activation) => {
            if (activation.code === code) {
                // activate user!
                return UserController.findByEmail(username);
            } else {
                // console.log("Activation " + activation.code + " is not equal code => " + code);
                deferred.resolve(false);
            }
        })
        .then((user) => {
            return UserController.update(user.id, {active: true});
        })
        .then((user) => {
            deferred.resolve(user.active); // make sure activation worked
        })
        .catch((err) => {
            deferred.resolve(false);
        });
    return deferred.promise;
};

module.exports = self;