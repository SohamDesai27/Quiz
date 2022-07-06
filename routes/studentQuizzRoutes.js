
const express = require('express');
const config = require('../config');
const multer = require('multer');
const parts = multer();
const wrap = require('co-express');
const co = require('co');
const Student = require('../models/user');
const Quizz = require('../models/quizz');

const TestQuestions = require('../testObjects/TestQuestions');
const StudentQuizzController = require('../controllers/studentQuizzController');

module.exports = function (app) {

    app.post('/student_quizz', parts.array(), wrap(function *(req, res) {
        const quizzId = req.body.quizzId;
        const student = req.body.userId;

        co(function *() {

            var query = { quizz: quizzId, student: student };
            console.log("\n\n\n\n\n\n");
            console.log("studentQuizz: " + query);
            var studentQuizz = yield StudentQuizzController.getStudentQuizz(query);

            // Return the studentQuizz object
            res.status(200).json({
                success: true,
                data: studentQuizz
            });
        }).catch(function (err) {
            console.log(err.stack);
            res.status(500).json({
                message: err.message
            });
        });
    }));


    app.post('/student_quizz_test_data', parts.array(), wrap(function *(req, res) {

        var quizzData = {
            name: "dummyQuizz",
            description: "test quizz",
            instructor: "drCline",
            courseId: "cs1113",
            points: 10,
            questions: []
        };

        var studentData = {
            firstName: "Joe",
            lastName: "Young",
            isInstructor: false,
            cwid: "12345",
            enrolledCourses: [],
            email: "joe@gmail.com",
            active: true,
            hashPassword: "1234",
            salt: "skdfl"
        };

        co(function *() {

            var quizz = new Quizz(quizzData);
            yield quizz.save();

            var student = new Student(studentData);
            //yield student.save();

            // Return the studentQuizz object
            res.status(200).json({
                success: true,
                data: quizz
            });
        }).catch(function (err) {
            console.log(err.stack);
            res.status(500).json({
                message: err.message
            });
        });
    }));
};
