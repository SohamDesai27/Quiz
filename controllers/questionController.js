const Q = require('q');
const Question = require('../models/question');
const moment = require('moment');

const self = {};

/**
 * find a specific user object from a query
 * @param query
 *      Query containing user parameters
 */
const findOne = function (query) {
    const deferred = Q.defer();
    Question.findOne(query, function (err, user) {
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
    Question.find(query, function (err, questions) {
        if (err) {
            deferred.reject(err);
            return;
        }
        deferred.resolve(questions);
    });
    return deferred.promise;
};

/**
 * Saves a JSON Question representation to the database
 * @param question
 *      JSON object with some of the question properties
 * @return
 *      a Promise that gets fulfilled with a Mongoose model Question object
 */
self.save = function (question) {
    const deferred = Q.defer();
    const q = new Question(question);
    q.save(function (err, question) {
        if (err) {
            deferred.reject(err);
            return;
        }
        deferred.resolve(question);
    });
    return deferred.promise;
};

self.saveParsedQuestion = function (parsedQuestion, user) {
    var q = {};
    var info = parsedQuestion.info;
    q.username = user;
    q.title = parsedQuestion.title;
    q.body = parsedQuestion.question;
    q.completeSolution = parsedQuestion.completeSolution;
    q.starterCode = parsedQuestion.starterCode;
    q.className = parsedQuestion.className;
    q.testCases = parsedQuestion.testCases;
    q.points = parseInt(info.points);
    q.language = info.language;
    q.difficulty = info.difficulty;
    q.topics = info.topics;
    q.activeDate = moment(info.activeDate, "DD/MM/YYYY");
    q.dueDate = moment(info.dueDate, "DD/MM/YYYY");
    q.inputFiles = parsedQuestion.inputFiles;

    return self.save(q);
};

/**
 * Finds a specific question by user email
 * @param email
 *      Email of the user
 * @return
 *     a Promise that gets fulfilled with a list of Mongoose model Question object
 */
self.findByUser = function (email) {
    const query = {username: email};
    return find(query);
};

self.findQuestions = function (query) {
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
    // Not all question fields should be allowed to update
    // So we manually delete those objects just in case
    const deferred = Q.defer();
    delete fields.username;
    Question.findByIdAndUpdate(id, { $set: fields }, { new: true }, function (err, question) {
        if (err) {
            deferred.reject(err);
            return;
        }
        deferred.resolve(question);
    });
    return deferred.promise;
};

/**
 *
 * @param id
 */
self.delete = function (id) {
    const deferred = Q.defer();
    Question.findByIdAndRemove(id, function (err, question) {
        if (err) {
            deferred.reject(err);
            return;
        }
        deferred.resolve(question);
    });
    return deferred.promise;
};

module.exports = self;