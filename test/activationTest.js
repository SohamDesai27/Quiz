const co = require('co');
const mongoose = require('mongoose');
const ActivationController = require('../controllers/activationController');
const UserController = require('../controllers/userController');
const Activation = require('../models/activation');
const dbConfig = require('../dbConfig');
const assert = require('chai').assert;
const VARS = require('./testVariables');

describe('Activation Tests', function () {

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

        it('activation should be saved', function () {
            return ActivationController.save(VARS.USER_EMAIL)
                .then(function (activation) {
                    assert.isNotNull(activation, "activation is not null");
                });
        });

        it('activation should be found by email', function () {
            return ActivationController.save(VARS.USER_EMAIL)
                .then(function (activation) {
                    assert.isNotNull(activation, "activation is not null");
                    return ActivationController.findByEmail(VARS.USER_EMAIL);
                }).then(function (activation) {
                    assert.equal(activation.username, VARS.USER_EMAIL, 'activation.username equals ' + VARS.USER_EMAIL);
                });
        });

        it('activation should NOT be found by email', function () {
            return ActivationController.save(VARS.USER_EMAIL)
                .then(function (activation) {
                    assert.isNotNull(activation, "activation is not null");
                    return ActivationController.findByEmail("wrong@email.com");
                }).then(function (activation) {
                    assert.isNull(activation, "activation is null");
                });
        });

        it('activation should be valid', function () {
            return UserController.save(VARS.USER)
                .then(function (user) {
                    return ActivationController.save(VARS.USER_EMAIL);
                })
                .then(function (activation) {
                    assert.isNotNull(activation, "activation is not null");
                    return ActivationController.findByEmail(VARS.USER_EMAIL);
                }).then(function (activation) {
                    return ActivationController.activate(activation.username, activation.code);
                }).then(function (result) {
                    assert.equal(result, true, "Result is true");
                });
        });

        it('activation should NOT be valid', function () {
            return UserController.save(VARS.USER)
                .then(function (user) {
                    return ActivationController.save(VARS.USER_EMAIL);
                })
                .then(function (activation) {
                    assert.isNotNull(activation, "activation is not null");
                    return ActivationController.findByEmail(VARS.USER_EMAIL);
                }).then(function (activation) {
                    return ActivationController.activate(activation.username, "XXX");
                }).then(function (result) {
                    assert.equal(result, false, "Result is false");
                });
        });
    });

});