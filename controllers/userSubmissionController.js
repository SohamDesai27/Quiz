/**
 * Created by Kareshma on 4/17/2017.
 */
const Q = require('q');
const Submission = require('../models/userSubmission');

const self ={};

const find = function (query) {
    const deferred = Q.defer();
    Submission.find(query, function (err, questions) {
        if (err) {
            deferred.reject(err);
            return;
        }
        deferred.resolve(questions);
    });
    return deferred.promise;
};

/**
 *
 * @param id
 * @param fields
 */
self.update = function (id, fields) {
    const deferred = Q.defer();
    fields.updatedAt = new Date();
    Submission.findByIdAndUpdate(id, { $set: fields }, { new: true }, function (err, submission) {
        if (err) {
            deferred.reject(err);
            return;
        }
        deferred.resolve(submission);
    });
    return deferred.promise;
};

self.updateIfNecessary = function (oldSubmission, newSubmission) {
    if (newSubmission.score > oldSubmission.score) {
        return self.update(oldSubmission._id, newSubmission);
    }
    //TODO find a better way to this... it's kind of hack
    return self.update(oldSubmission._id, oldSubmission);
};

self.findSubmissions = function (query) {
    return find(query);
};

self.findOne = function (query) {
    const deferred = Q.defer();
    Submission.findOne(query, function (err, submission) {
        if (err) {
            deferred.reject(err);
            return;
        }
        deferred.resolve(submission);
    });
    return deferred.promise;
};

module.exports = self;

