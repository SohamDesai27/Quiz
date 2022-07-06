const Q = require('q');
const User = require('../models/user');

const self = {};

/**
 * find a specific user object from a query
 * @param query
 *      Query containing user parameters
 */
const findOne = function (query) {
    const deferred = Q.defer();
    User.findOne(query, function (err, user) {
        if (err) {
            deferred.reject(err);
            return;
        }
        deferred.resolve(user);
    });
    return deferred.promise;
};

const find = function (query) {
    const deferred = Q.defer();
    User.find(query, function (err, users) {
        if (err) {
            deferred.reject(err);
            return;
        }
        deferred.resolve(users);
    });
    return deferred.promise;
};

/**
 * Saves a JSON Question representation to the database
 * @param user
 *      JSON object with some of the user properties
 * @return
 *      a Promise that gets fulfilled with a Mongoose model Question object
 */
self.save = function (user) {
    const deferred = Q.defer();
    const u = new User();
    u.email = user.email.toLowerCase();
    u.firstName = user.firstName;
    u.lastName = user.lastName;
    u.setPassword(user.password);
    u.cwid = user.cwid;
    u.save(function (err, doc) {
        if (err) {
            deferred.reject(err);
            return;
        }
        deferred.resolve(doc);
    });
    return deferred.promise;
};

/**
 * Finds a specific user by email
 * @param email
 *      Email of the user
 * @return
 *     a Promise that gets fulfilled with a Mongoose model Question object
 */
self.findByEmail = function (email) {
    email = email.toLowerCase();
    const query = {email: email};
    return findOne(query);
};

/**
 * Finds a specific user using cwid
 * @param cwid
 *      the cwid of the user
 *
 * @return
 *      a Promise that gets fulfilled with a Mongoose model Question object
 */
self.findByCWID = function (cwid) {
    const query = {cwid: cwid};
    return findOne(query);
};

self.findUsers = function (query) {
    return find(query);
};

self.findById = function (id) {
    const query = {_id: id};
    return findOne(query);
};

/**
 *
 * @param id
 * @param fields
 */
self.update = function (id, fields) {
    // Not all user fields should be allowed to update
    // So we manually delete those objects just in case
    const deferred = Q.defer();
    delete fields.email;
    User.findByIdAndUpdate(id, { $set: fields }, { new: true }, function (err, user) {
        if (err) {
            deferred.reject(err);
            return;
        }
        deferred.resolve(user);
    });
    return deferred.promise;
};

/**
 *
 * @param id
 */
self.delete = function (id) {
    const deferred = Q.defer();
    User.findByIdAndRemove(id, function (err, user) {
        if (err) {
            deferred.reject(err);
            return;
        }
        deferred.resolve(user);
    });
    return deferred.promise;
};

module.exports = self;