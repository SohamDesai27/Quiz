const fs = require('fs-extra');
const co = require('co');
const Q = require('q');
const config = require('../config');

const self = {};

self.removeFile = function (filePath) {
    fs.remove(process.env.UPLOAD_PATH + "/" + filePath);
};

self.removeAllQuestionFiles = function (questionId) {
    const deferred = Q.defer();
    fs.remove(process.env.UPLOAD_PATH + "/" + questionId, function (err) {
        if (err) {
            console.log(err);
            deferred.reject(false);
            return;
        }
        deferred.resolve(true);
    });
    return deferred.promise;
};

self.readFileFromFullPath = function (path) {
    const deferred = Q.defer();
    fs.readFile(path, (err, data) => {
        if (err) {
            console.log(err);
            deferred.reject(err);
            return;
        }
        deferred.resolve(data.toString());
    });
    return deferred.promise;
};

self.readFile = function (path) {
    return self.readFileFromFullPath(process.env.UPLOAD_PATH + "/" + path);
};

self.saveFile = function(content, dir, filename) {
    const deferred = Q.defer();
    // Ensures the directory exists, if not exists a new directory will be created
    const fullPath = process.env.UPLOAD_PATH + "/" + dir;
    fs.ensureDir(fullPath, function (err) {
        if (err) {
            console.log(err);
            deferred.reject(err);
            return;
        }
        fs.writeFile(fullPath + "/" + filename, content, function(err) {
            if(err) {
                console.log(err);
                deferred.reject(err);
                return;
            }
            deferred.resolve(dir + "/" + filename);
        });
    });
    return deferred.promise;
};

module.exports = self;