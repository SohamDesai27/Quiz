'use strict';
const co = require('co');
const Q = require('q');
const exec = require('child_process').exec;
const StudentQuizz = require("../models/studentQuizz");

const self = {};

/**
 * Saves a student quizz object
 * @param submission
 *      JSON object with some of the question properties
 * @return
 *      a Promise that gets fulfilled with a Mongoose model UserSubmission object
 */
self.saveStudentQuizz = function (submission) {
    const deferred = Q.defer();
    const sq = new StudentQuizz(submission);
    sq.save(function (err, submission) {
        if (err) {
            console.log(err);
            deferred.reject(err);
            return;
        }
        deferred.resolve(sq);
    });
    return deferred.promise;
};

/**
 * Makes and stores a StudentQuizz object and stores
 * it in the database.
 * @param query - holds the userId and quizzId
 * @return A new StudentQuizz object with the specified
 *      userId and quizzId
 */
self.makeAndSaveStudentQuizz = function(query) {
    console.log("making student quizz: " + query);
    // Make precursor object for StudentQuizz
    var sq = {
        student: query.student,
        quizz: query.quizz,
        submission: [],
        score: 0
    };

    // save copy in database. Ignore return value
    self.saveStudentQuizz(sq);

    // make a studentQuizz object to return immediately.
    var studentQuizz = new StudentQuizz(sq);
    return studentQuizz;
}

/**
 * @param query - holds the userName and quizzId
 * @return the studentQuizz object stored in the database,
 *      or a new one that has been created.
 */
self.getStudentQuizz = function(query) {
    const deferred = Q.defer();
    StudentQuizz.findOne(query, function (err, studentQuizz) {
        if (err || studentQuizz === null) {
            // If there's an error, assume the studentQuizz does not exist.
            // make a new studentQuizz object and
            // and save it in the database.

            var initialStudentQuizz = self.makeAndSaveStudentQuizz(query);

            if (initialStudentQuizz.student == false)
                initialStudentQuizz.student = "dummyUser";
            if (initialStudentQuizz.quizz == false)
                initialStudentQuizz.quizz = "dummyQuizz";

            console.log(initialStudentQuizz);
            deferred.resolve(initialStudentQuizz);
            return;
        }
        console.log(studentQuizz);
        deferred.resolve(studentQuizz);
    });
    return deferred.promise;
};

module.exports = self;

