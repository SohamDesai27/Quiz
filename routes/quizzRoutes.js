const express = require('express');
const multer = require('multer');
const parts = multer();
const wrap = require('co-express');
const co = require('co');
const Quizz = require('../models/quizz');
const QuizzController = require('../controllers/quizzController');

// Only use this as a sample template when starting a new routes file
module.exports = function (app) {

    /**
     * Retrieves all quizzes for a instructor. Optionally query parameters may be passed into this
     * route to allow query for courses on a specific course
     * Query params: courseId
     */
    app.get('/quizzes/:instructor', parts.array(), wrap(function *(req, res) {
        var courseId = req.query.courseId;
        var query = {};
        query.instructor = req.params.instructor;
        if (courseId) {
            query.courseId = courseId;
        }
        var quizzes = yield QuizzController.find(query);
        res.json(quizzes);
    }));

    app.get('/quizz/:id', parts.array(), wrap(function *(req, res) {
        var quizz = yield Quizz.findById(req.params.id)
            .populate('questions')
            .exec();
        res.json(quizz);
    }));

    app.put('/quizz/:id', parts.array(), wrap(function *(req, res) {
        co(function *() {
            var quizz = yield Quizz.update(req.params.id, req.body);
            res.json(quizz);
        }).catch(function (err) {
            console.log(err.stack);
            res.status(500).json(err);
        });

    }));

    app.post('/quizzes', wrap(function *(req, res) {
        co(function *() {
            const quizz = new Quizz(req.body);
            yield quizz.save();
            res.status(200).json(quizz);
        }).catch(function (err) {
            console.log(err.stack);
            res.status(500).json(err);
        });
    }));
};