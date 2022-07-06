const express = require('express');
const config = require('../config');
const multer = require('multer');
const uploadsPath = config.UPLOADS_PATH || process.env.UPLOAD_PATH;
const upload = multer({dest: uploadsPath});
const parts = multer();
const wrap = require('co-express');
const co = require('co');
const Question = require('../models/question');
const FileUploadController = require('../controllers/fileUploadController');
const QuestionsController = require('../controllers/questionController');
const TestQuestions = require('../testObjects/TestQuestions');
const QuestionParser = require('../parser/parser');
const fs = require('fs-extra');

const VARS = require('../test/testVariables');
const RunnerController = require('../controllers/runnerController');

var saveInputFiles = function (question) {
    co(function *() {
        if (question.inputFiles) {
            for (var i = 0; i < question.inputFiles.length; i++) {
                var inputFile = question.inputFiles[i];
                if (inputFile.name) {
                    yield FileUploadController.saveFile(inputFile.contents, question._id, inputFile.name);
                }
            }
        }
    });
};

var saveCodeFiles = function (question, filename) {
    const filePath = "uploads/" + question._id + "/" + filename;
    fs.ensureDirSync("uploads/" + question._id);
    fs.writeFileSync(filePath, question.completeSolution);
    return filePath;
};

module.exports = function (app) {
    app.post('/upload_file', upload.single('file'), wrap(function *(req, res) {
        const file = req.file;
        const user = req.query.user;
        const path = file.filename;
        co(function *() {
            const fileContents = yield FileUploadController.readFile(path);
            var questionContents = QuestionParser.processFile(fileContents);
            console.log(questionContents);
            var question = yield QuestionsController.saveParsedQuestion(questionContents, user);
            yield FileUploadController.saveFile(fileContents, question._id, "original.txt");
            // console.log(question.inputFiles);
            saveInputFiles(question);

            FileUploadController.removeFile(path);
            res.status(200).json({
                success: true,
                data: question
            });
        }).catch(function (err) {
            console.log(err.stack);
            res.status(500).json({
                message: err.message
            });
        });
    }));

    app.get('/questions', wrap(function *(req, res) {
        co(function *() {
            const query = req.query || {};
            const questions = yield Question.find(query)
                .sort({dueDate: 1})
                .exec();
            res.status(200).json(questions)
        }).catch(function (err) {
            console.log(err.stack);
            res.status(500).json(err);
        });
    }));

    app.get('/edit_questions/:id', wrap(function *(req, res) {
        co(function *() {
            const id = req.params.id;
            const question = yield QuestionsController.findById(id);
            const filename = question.className + ".java";
            res.status(200).json({
                question: question,
                filename: filename
            });
        }).catch(function (err) {
            res.status(500).json(err);
        });
    }));

    app.get('/questions/:id', wrap(function *(req, res) {
        co(function *() {
            const id = req.params.id;
            const question = yield QuestionsController.findById(id);
            question.filename = undefined;
            question.completeSolution = undefined;
            question.username = undefined;
            question.testCases = undefined;
            question.inputFiles = undefined;
            question.__v = undefined;
            res.status(200).json(question);
        }).catch(function (err) {
            res.status(500).json(err);
        });
    }));

    app.post('/questions', wrap(function *(req, res) {
        co(function *() {
            const question = yield QuestionsController.save(req.body);
            const filename = req.body.filename;
            saveInputFiles(question);
            question.classname = filename.replace(".java", "");
            yield question.save();
            res.status(200).json({
                question: question,
                filename: filename
            })
        }).catch(function (err) {
            res.status(500).json(err);
        });
    }));

    app.put('/questions/:id', wrap(function *(req, res) {
        co(function *() {
            const id = req.params.id;
            const filename = req.body.filename;
            delete req.body.filename;
            const question = yield QuestionsController.update(id, req.body);
            question.classname = filename.replace(".java", "");
            saveInputFiles(question);
            yield question.save();
            res.status(200).json({
                question: question,
                filename: filename
            })
        }).catch(function (err) {
             console.log(err.stack);
            res.status(500).json(err);
        });
    }));

    app.delete('/questions/:id', wrap(function *(req, res) {
        co(function *() {
            const id = req.params.id;
            yield QuestionsController.delete(id);
            fs.removeSync('uploads/' + id);
            res.status(200).json(true)
        }).catch(function (err) {
            console.log(err.stack);
            res.status(500).json(err);
        });
    }));

    app.get('/dummy/questions/:id', wrap(function *(req, res) {
        res.status(200).json(TestQuestions.singleQuestion);
    }));

    app.post('dummy/questions', wrap(function *(req, res) {
        const question = new Question(req.body);
        res.status(200).json(question);
    }));

    app.put('dummy/questions', wrap(function *(req, res) {
        const question = new Question(req.body);
        res.status(200).json(question);
    }));

    app.get('/question_test', parts.array(), wrap(function *(req, res) {
        const question = TestQuestions.singleQuestion;
        const completeSolution = question.completeSolution;
        const goodUserCode = question.goodUserCode;
        const goodSplicedCode = question.goodSplicedCode;
        const splicedCode = RunnerController.spliceCode(completeSolution, goodUserCode, "@1");
        const userCode = question.goodUserCode;

        co(function *() {
            var result = yield RunnerController.compileAndRunTestCases(question, "test", userCode, false);
            res.json(result);
        }).catch(function (err) {

            res.status(500).json(err);
        });
    }));
};