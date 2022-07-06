process.env.UPLOAD_PATH = "testUploads";
const co = require('co');
const FileUploadController = require('../controllers/fileUploadController');
const dbConfig = require('../dbConfig');
const assert = require('chai').assert;
const VARS = require('./testVariables');
const Processor = require('../parser/parser');

const FULL_PATH = VARS.TEST_FILE_ID + "/" + VARS.TEST_FILE_NAME;

describe('File Upload Controller Tests', function () {

    afterEach((done) => {
        FileUploadController.removeAllQuestionFiles(VARS.TEST_FILE_ID)
            .then(function (result) {
                done();
            });
    });

    describe('testCrudFunctions', function () {
        it('file should be saved', function () {
            return FileUploadController.saveFile(VARS.TEST_FILE_CONTENTS, VARS.TEST_FILE_ID, VARS.TEST_FILE_NAME)
                .then(function (fullPath) {
                    assert.equal(fullPath, FULL_PATH, "fullPath is equal " + fullPath);
                });
        });

        it('file has the right contents', function () {
            return FileUploadController.saveFile(VARS.TEST_FILE_CONTENTS, VARS.TEST_FILE_ID, VARS.TEST_FILE_NAME)
                .then(function (fullPath) {
                    assert.equal(fullPath, FULL_PATH, "fullPath is equal " + fullPath);
                    return FileUploadController.readFile(fullPath);
                }).then(function (contents) {
                    assert.equal(contents, VARS.TEST_FILE_CONTENTS, "test file contents is equal to " + contents);
                });
        });

        it('files are deleted', function () {
            return FileUploadController.saveFile(VARS.TEST_FILE_CONTENTS, VARS.TEST_FILE_ID, VARS.TEST_FILE_NAME)
                .then(function (fullPath) {
                    assert.equal(fullPath, FULL_PATH, "fullPath is equal " + fullPath);
                    return FileUploadController.removeAllQuestionFiles(VARS.TEST_FILE_ID);
                }).then(function (result) {
                    assert(result, "files have been deleted");
                });
        });
    });

});