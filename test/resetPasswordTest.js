const co = require('co');
const mongoose = require('mongoose');
const ResetPasswordController = require('../controllers/resetPasswordController');
const UserController = require('../controllers/userController');
const ResetPassword = require('../models/resetPassword');
const dbConfig = require('../dbConfig');
const assert = require('chai').assert;
const VARS = require('./testVariables');

describe('Reset Password Tests', function () {

    beforeEach((done) => {
        dbConfig.initTestDB(function () {
            done();
        });
    });

    afterEach((done) => {
        mongoose.connection.close(() => {
            done();
        });
    });

    describe('testCrudFunctions', function () {

        it('resetPassword should be saved', function () {
            return ResetPasswordController.save(VARS.USER_EMAIL)
                .then(function (resetPassword) {
                    assert.isNotNull(resetPassword, "reset password is not null");
                });
        });

        it('resetPassword should be found by email', function () {
            return ResetPasswordController.save(VARS.USER_EMAIL)
                .then(function (resetPassword) {
                    assert.isNotNull(resetPassword, "resetPassword is not null");
                    return ResetPasswordController.findByEmail(VARS.USER_EMAIL);
                }).then(function (resetPassword) {
                    assert.equal(resetPassword.username, VARS.USER_EMAIL, 'resetPassword.username equals ' + VARS.USER_EMAIL);
                });
        });

        it('resetPassword should NOT be found by email', function () {
            return ResetPasswordController.save(VARS.USER_EMAIL)
                .then(function (resetPassword) {
                    assert.isNotNull(resetPassword, "resetPassword is not null");
                    return ResetPasswordController.findByEmail("wrong@email.com");
                }).then(function (resetPassword) {
                    assert.isNull(resetPassword, "resetPassword is null");
                });
        });
    });

});