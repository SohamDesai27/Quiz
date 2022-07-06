const express = require('express');
const multer = require('multer');
const parts = multer();
const wrap = require('co-express');
const co = require('co');
const UserController = require('../controllers/userController');
const User = require('../models/user');
const ActivationController = require('../controllers/activationController');
const SendEmailController = require('../controllers/sendEmailController');
const ResetPasswordController = require('../controllers/resetPasswordController');
const ResponseHelper = require('../helpers/responseHelpers');
const passport = require('passport');
const config = require('../config');

module.exports = function (app) {
    /**
     * The body of this route should be a Question object ONLY
     * See the function save in UserController for the valid parameters
     */
    app.post('/sign_up', parts.array(), function (req, res) {
        co(function *() {
            // we save the body into the database
            // If saving fails it will thrown an error and be catch with a error
            const user = yield UserController.save(req.body);
            // token to be used to validate requests for this user
            //TODO uncomment this when we have send email credentials
            // const activation = yield ActivationController.save(user.email);
            // SendEmailController.activateUser(activation);
            const token = user.generateJwt();
            res.status(200).json({
                success: true,
                token: token,
                data: user
            })
        }).catch(function (err) {
            console.log(err); // log the error to the console
            ResponseHelper.response500(res, "Error saving user: " + err.message);
        });
    });

    /**
     * Authenticates a user. It expects an object with the following fields
     *      email => the email of the user
     *      password => user password
     *
     *  If successful will return a 200 response with the user object and a token
     *  If fails, will return a 500 error with a message of why it failed.
     */
    app.post('/sign_in', parts.array(), function (req, res) {
        passport.authenticate('local', function (err, user, info) {
            // If Passport throws/catches an error
            if (err) {
                console.log(err);
                ResponseHelper.response500(res, err.message);
                return;
            }
            // If a user is found
            if (user) {
                const token = user.generateJwt();
                res.status(200).json({
                    success: true,
                    data: user,
                    token: token
                });
            } else {
                // If user is not found
                ResponseHelper.response500(res, "Invalid password or email");
            }
        })(req, res);
    });

    app.get('/users', parts.array(), function (req, res) {
        co(function *() {
            var query = req.query || {};
            var users = yield UserController.findUsers(query);
            res.status(200).json({
                success: true,
                data: users
            });
        }).catch(function (err) {
            console.log(err); // log the error to the console
            ResponseHelper.response500(res, "Error finding user: " + err.message);
        });
    });

    app.post('/forgot_password', parts.array(), function (req, res) {
        co(function *() {
            const emailSent = yield SendEmailController.resetPassword(req.body.username);
            res.status(200).json({
                success: true,
                message: "Check your email for next steps",
                data: emailSent
            });
        }).catch(function (err) {
            console.log(err); // log the error to the console
            ResponseHelper.response500(res, "Error resetting password: " + err.message);
        });
    });

    /**
     * Query parameters:
     *      username => the email of the user
     *      code     => the code used to activate the user
     */
    app.get('/activate', parts.array(), function (req, res) {
        co(function *() {
            var query = req.query;
            var code = query.code;
            var username = query.username;
            var activate = yield ActivationController.activate(username, code);
            if (activate) {
                res.redirect(config.SERVER_URL + "/activated?success=true");
            } else {
                // failed to activate user
                res.redirect(config.SERVER_URL + "/activated?success=false");
            }
        }).catch(function (err) {
            console.log(err); // log the error to the console
            res.redirect(config.SERVER_URL + "/activated?success=false");
        });
    });

    app.get('/users/:id', parts.array(), function (req, res) {
        co(function *() {
            const id = req.params.id;
            var user = yield User.findById(id)
                .populate('enrolledCourses')
                .exec();
            if (user) {
                res.json(user);
                return;
            }
            res.status(500).json({
                message: "User with id: " + id + " not found."
            });
        }).catch(function (err) {
            console.log(err); // log the error to the console
            res.status(500).json({
                message: err.message
            });
        });
    });

    app.put('/make_admin', parts.array(), function (req, res) {
        co(function *() {
            const username = req.body.username;
            const isInstructor = req.body.isInstructor;

            const user = yield UserController.findByEmail(username);
            user.isInstructor = isInstructor;
            yield user.save();

            res.status(200).json({
                success: true,
                message: "User successfully updated.",
                data: user
            });
        }).catch(function (err) {
            console.log(err); // log the error to the console
            ResponseHelper.response500(res, "Error updating user: " + err.message);
        });
    });
};