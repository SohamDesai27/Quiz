const express = require('express');
const multer = require('multer');
const parts = multer();
const wrap = require('co-express');

// Only use this as a sample template when starting a new routes file
module.exports = function (app) {
    app.get('/sample', parts.array(), wrap(function * (req, res) {
        res.status(200).json({
            message: "Hello word from sample!!! With Changes"
        })
    }));
};