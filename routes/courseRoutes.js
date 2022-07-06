const express = require('express');
const multer = require('multer');
const parts = multer();
const wrap = require('co-express');
const co = require('co');
const Course = require('../models/course');
const UserController = require('../controllers/userController');

const checkUsernameAndReturn = function (username, res) {
    if (username == null) {
        res.status(500).json({
            success: false,
            message: "Username is required."
        });
        return false;
    }
    return true;
};

const checkCourseAndReturn = function (course, res) {
    if (course == null) {
        res.status(500).json({
            success: false,
            message: "Course not found."
        });
        return false;
    }
    return true;
};

const checkUserAndReturn = function (user, res) {
    if (user == null) {
        res.status(500).json({
            success: false,
            message: "User not found."
        });
        return false;
    }
    return true;
};

// Only use this as a sample template when starting a new routes file
module.exports = function (app) {
    app.get('/courses/:instructor', parts.array(), wrap(function * (req, res) {
        var courses = yield Course.find({instructor: req.params.instructor}).exec();
        res.json(courses);
    }));

    app.get('/courses/students/:courseId', parts.array(), wrap(function * (req, res) {
        var courses = yield Course.find({instructor: req.params.instructor}).exec();
        res.json(courses);
    }));

    /**
     * Gets all the courses to which a student is enrolled.
     */
    app.get('/courses/students/enrolled', parts.array(), wrap(function * (req, res) {
        var courses = yield Course.find({instructor: req.params.instructor}).exec();
        res.json(courses);
    }));

    app.post('/courses', wrap(function *(req, res) {
        co(function *() {
            const course = new Course(req.body);
            yield course.save();
            res.status(200).json(course);
        }).catch(function (err) {
            res.status(500).json(err);
        });
    }));

    app.get('/courses/single/:id', parts.array(), wrap(function * (req, res) {
        co(function *() {
            const q = {_id: req.params.id};
            const course = yield Course.findOne(q).exec();
            res.json(course);
        }).catch(function (err) {
            res.status(500).json(err);
        });

    }));

    app.post('/enroll/', wrap(function *(req, res) {
        co(function *() {
            // Check if username was provided by the query

            const code = req.body.code;
            const username = req.body.username;
            if (!checkUsernameAndReturn(username, res)) {
                return;
            }
            // Check if a course can be find for the specific code
            const course = yield Course.findOne({code: code}).exec();
            if (!checkCourseAndReturn(course, res)) {
                return;
            }

            // Check that a user for the username can be found
            const user = yield UserController.findByEmail(username);
            if (!checkUserAndReturn(user, res)) {
                return;
            }

            // Retrieve enrolled courses and check if user is not already enrolled in this course
            var enrolledCourses = user.enrolledCourses || [];
            const isAlreadyEnrolled = user.enrolledCourses.some(function (c) {
                return c.equals(course._id);
            });
            if (isAlreadyEnrolled) {
                res.status(500).json({
                    success: false,
                    message: "Already enrolled in this course."
                });
                return;
            }
            enrolledCourses.push(course); // enroll the user in the course
            user.enrolledCourses = enrolledCourses; // update information
            yield user.save(); // save the user

            res.json({
                success: true // return a success to the frontend
            });
        }).catch(function (err) {
            console.log(err.stack);
            res.status(500).json({
                success: false,
                message: "An error occurred. Try again later."
            });
        });
    }));
};