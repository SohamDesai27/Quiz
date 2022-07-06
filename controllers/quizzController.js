const Q = require('q');
const Quizz = require('../models/quizz');

const self = {};

self.findOne = function (query) {
    const deferred = Q.defer();
    Quizz.findOne(query, function (err, quizz) {
        if (err) {
            deferred.reject(err);
            return;
        }
        deferred.resolve(quizz);
    });
    return deferred.promise;
};

self.find = function (query) {
    const deferred = Q.defer();
    Quizz.find(query, function (err, quizzes) {
        if (err) {
            deferred.reject(err);
            return;
        }
        deferred.resolve(quizzes);
    });
    return deferred.promise;
};


self.save = function (body) {
    const deferred = Q.defer();
    const q = new Quizz(body);
    q.save(function (err, doc) {
        if (err) {
            deferred.reject(err);
            return;
        }
        deferred.resolve(doc);
    });
    return deferred.promise;
};


self.update = function (id, fields) {
    const deferred = Q.defer();
    delete fields.instructor; // don't allow instructor to be updated by mistake
    Quizz.findByIdAndUpdate(id, { $set: fields }, { new: true }, function (err, quizz) {
        if (err) {
            deferred.reject(err);
            return;
        }
        deferred.resolve(quizz);
    });
    return deferred.promise;
};

/**
 *
 * @param id
 */
self.delete = function (id) {
    const deferred = Q.defer();
    Quizz.findByIdAndRemove(id, function (err, quizz) {
        if (err) {
            deferred.reject(err);
            return;
        }
        deferred.resolve(quizz);
    });
    return deferred.promise;
};

module.exports = self;