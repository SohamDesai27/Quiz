const co = require('co');
const mongoose = require('mongoose');
const UserController = require('../controllers/userController');
const User = require('../models/user');
const dbConfig = require('../dbConfig');
const assert = require('chai').assert;
const VARS = require('./testVariables');

describe('User Tests', function () {

    describe('testHashPassword', function () {
        it('should return false when hashing different passwords', function () {
            var user = new User();
            user.setPassword(VARS.PASSWORD);
            var valid = user.validPassword(VARS.WRONG_PASSWORD);
            assert.equal(valid, false);
        });

        it('should return true when hashing same passwords', function () {
            var user = new User();
            user.setPassword(VARS.PASSWORD);
            var valid = user.validPassword(VARS.PASSWORD);
            assert.equal(valid, true);
        });
    });

    describe('testEmailValidation', function () {
        it('should return true when passing a valid email', function () {
            var user = new User();
            assert.equal(user.isValidEmail("hello@email.com"), true);
            assert.equal(user.isValidEmail("hello.user@email.com"), true);
            assert.equal(user.isValidEmail("hello-user@email.edu"), true);
            assert.equal(user.isValidEmail("x@email.org"), true);
        });

        it('should return false when passing a invalid email', function () {
            var user = new User();
            assert.equal(user.isValidEmail("hello.user@email..com"), false);
            assert.equal(user.isValidEmail("hello@-user@email.edu"), false);
            assert.equal(user.isValidEmail("hello..user@email.org"), false);
            assert.equal(user.isValidEmail("user"), false);
        });
    });

    describe('testCrudFunctions', () => {

        beforeEach((done) => {
            dbConfig.initTestDB(() => {
                done();
            })
        });

        afterEach((done) => {
            mongoose.connection.close(() => {
                done();
            });
        });

        it('user should be saved', function () {
            return UserController.save(VARS.USER)
                .then(function (user) {
                    assert.isNotNull(user, "user is not null");
                    assert.equal(user.email, VARS.USER_EMAIL, 'email equals ' + VARS.USER_EMAIL);
                    assert.equal(user.firstName, VARS.FIRST_NAME, 'firstName equals ' + VARS.FIRST_NAME);
                    assert.equal(user.lastName, VARS.LAST_NAME, 'lastName equals ' + VARS.LAST_NAME);
                    assert.equal(user.cwid, VARS.USER_CWID, 'cwid equals ' + VARS.USER_CWID);
                    assert.notEqual(user.hashPassword, VARS.PASSWORD, "Hashed password is not equal to " + VARS.PASSWORD);
                });
        });

        it('user should be found by email', function () {
            return UserController.save(VARS.USER)
                .then(function (user) {
                    assert.isNotNull(user, "user is not null");
                    return UserController.findByEmail(VARS.USER_EMAIL);
                }).then(function (user) {
                    assert.equal(user.email, VARS.USER_EMAIL, 'foundUser.email equals ' + VARS.USER_EMAIL);
                });
        });

        it('user should not be found by email', function () {
            return UserController.save(VARS.USER)
                .then(function (user) {
                    assert.isNotNull(user, "user is not null");
                    return UserController.findByEmail(VARS.USER_WRONG_EMAIL);
                }).then(function (user) {
                    assert.isNull(user, "User can not be found");
                });
        });

        it('user should be found by CWID', function () {
            return UserController.save(VARS.USER)
                .then(function (user) {
                    assert.isNotNull(user, "user is not null");
                    return UserController.findByCWID(user.cwid);
                }).then(function (user) {
                    assert.equal(user.cwid, VARS.USER_CWID, 'foundUser.cwid equals ' + VARS.USER_CWID);
                });
        });

        it('user should not be found by CWID', function () {
            return UserController.save(VARS.USER)
                .then(function (user) {
                    assert.isNotNull(user, "user is not null");
                    return UserController.findByCWID(VARS.NEW_USER_CWID);
                }).then(function (user) {
                    assert.isNull(user, "User can not be found");
                });
        });

        it('user should be deleted', function () {
            return UserController.save(VARS.USER)
                .then(function (user) {
                    assert.isNotNull(user, "user is not null");
                    return UserController.delete(user.id);
                }).then(function (deletedUser) {
                    assert.isNotNull(deletedUser, "deletedUser is not null");
                    return UserController.findByEmail(VARS.USER_EMAIL);
                }).then(function (found) {
                    assert.isNull(found, "found user should be null");
                });
        });

        it('user should update the user CWID', function () {
            return UserController.save(VARS.USER)
                .then(function (user) {
                    assert.isNotNull(user, "user is not null");
                    var u = VARS.USER;
                    u.cwid = VARS.NEW_USER_CWID;
                    return UserController.update(user.id, u);
                }).then(function (updatedUser) {
                    assert.equal(updatedUser.cwid, VARS.NEW_USER_CWID, 'updatedUser.cwid equals ' + VARS.NEW_USER_CWID);
                });
        });
    });
});