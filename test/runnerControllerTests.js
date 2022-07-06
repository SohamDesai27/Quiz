const co = require('co');
const mongoose = require('mongoose');
const RunnerController = require('../controllers/runnerController');
const dbConfig = require('../dbConfig');
const assert = require('chai').assert;
const VARS = require('./testVariables');
const TestQuestions = require('../testObjects/testQuestions');
const FileUploadController = require('../controllers/fileUploadController');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../server');

chai.use(chaiHttp);

describe('Runner Controller Tests', function () {

    const question = TestQuestions.singleQuestion;
    const completeSolution = question.completeSolution;
    const goodUserCode = question.goodUserCode;
    const goodSplicedCode = question.goodSplicedCode;
    const splicedCode = RunnerController.spliceCode(completeSolution, goodUserCode, "@1");

    console.log(splicedCode);

    it('should splice code properly', function () {
        assert.equal(splicedCode, goodSplicedCode);
    });

    it('should run a command', function () {
        return RunnerController.runCommandLine("echo hello")
            .then(function (stdout) {
                assert.equal(stdout, "hello\n");
            })
    });

    it('/GET test_route => it should return 2 hello world results', (done) => {
        chai.request(server)
            .get("/api/question_test")
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.should.have.length(2);
                done();
            });
    }).timeout(10000);
});