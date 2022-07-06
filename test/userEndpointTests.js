const config = require('../config');
process.env.DATABASE = config.TEST_DATABASE;
const mongoose = require('mongoose');
const co = require('co');
const ActivationController = require('../controllers/activationController');
const UserController = require('../controllers/userController');
const Activation = require('../models/activation');
const User = require('../models/user');
const dbConfig = require('../dbConfig');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const assert = require('chai').assert;
const server = require('../server');
const VARS = require('./testVariables');

chai.use(chaiHttp);

describe('Auth Tests', function () {

    before((done) => {
        dbConfig.initTestDB(() => {
            done();
        })
    });

    describe("Question endpoints", () => {
        it('/GET users => it should GET all the users and be empty', (done) => {
            chai.request(server)
                .get('/api/users')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.data.length.should.be.eql(0);
                    done();
                });
        });

        it('/POST sign_up => it should create a user', (done) => {
            const user = VARS.USER;
            chai.request(server)
                .post('/api/sign_up')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.should.have.property('token');
                    done();
                });
        });

        it('/POST sign_in => it should authenticate a user', (done) => {
            var sendUser = {
                email: VARS.USER_EMAIL,
                password: VARS.PASSWORD
            };
            chai.request(server)
                .post("/api/sign_in")
                .send(sendUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.should.have.property('token');
                    done();
                });
        });

        it('/POST sign_in => it should fail to authenticate a user', (done) => {
            var sendUser = {
                email: VARS.USER_EMAIL,
                password: VARS.WRONG_PASSWORD
            };
            chai.request(server)
                .post("/api/sign_in")
                .send(sendUser)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    done();
                });
        });
    });
});
