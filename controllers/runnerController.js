'use strict';
const co = require('co');
const Q = require('q');
const FileUploadController = require('../controllers/fileUploadController');
const exec = require('child_process').exec;
const UserSubmission = require("../models/userSubmission");

const self = {};

/**
 * Splice user code into solution code
 * @param solutionCode
 *      Solution code (a complete Java program)
 * @param userCode
 *        User code (to be spliced in to the solutionCode)
 * @param spliceTag
 *        Tag used to delimit the splice point
 * @return
 *        The spliced code (or empty string of not successful)
 */
self.spliceCode = function (solutionCode, userCode, spliceTag) {
    var start = solutionCode.indexOf(spliceTag);
    if (start < 0) return "";
    var end = solutionCode.indexOf(spliceTag, start + spliceTag.length);
    if (end < 0) return "";
    var splicedCode = solutionCode.slice(0, start) +
        spliceTag + "\n" +
        (userCode || "") + "\n" +
        "// " + spliceTag +
        solutionCode.slice(end + spliceTag.length);
    return splicedCode;
};

/**
 * Run a program from the command line (like javac or java)
 * @param commandLine
 *        The command line to use to run the program
 * @return
 *        The output of stdout or error.
 */
self.runCommandLine = function (commandLine) {
    const deferred = Q.defer();
    exec(commandLine, function (error, stdout, stderr) {
        if (error) {
            console.log("[" + commandLine + "] failed!\n");
            deferred.reject(error);
            return;
        }
        console.log("[" + commandLine + "] successful!\n");
        deferred.resolve(stdout);
    });
    return deferred.promise;
};

/**
 * Compiles and runs test cases
 * @param question
 *      The complete question object
 * @param userId
 *      The id of the user
 * @param userCode
 *      The code that the user wrote
 * @param saveResults
 *      Whether we should save the results back into the question object.
 *      Also determines whether to splice in userCode, or use the solution
 *      code directly.
 */
self.compileAndRunTestCases = function (question, userId, userCode, saveResults) {
    var deferred = Q.defer();
    co(function *() {

        // Making savePath and runPath
        // runPath is needed because of how saveFile saves things
        var savePath = userId + "/" + question._id + "/";
        var runPath = "uploads/" + savePath;

        // splice code
        const solutionCode = question.completeSolution;
        var splicedCode = solutionCode;
        if (saveResults == false) {
            splicedCode = self.spliceCode(solutionCode, userCode, "@1");
        }
        var saveFileName = question.className + ".java";
        var compileCommand = "javac " + runPath + saveFileName;

        // save code file to disk
        //console.log("Saving File..." + saveFileName + " in folder " + savePath + "\n");
        let saved = yield FileUploadController.saveFile(splicedCode, savePath, saveFileName);

        // compile
        //console.log("Compiling with [" + compileCommand + "]\n");
        let compileStatus = yield self.runCommandLine(compileCommand);

        // save data files to disk
        var inputFiles = question.inputFiles || [];
        for (var i = 0; i < inputFiles.length; i++) {
            let fileSaved = yield FileUploadController.saveFile(
                inputFiles[i].contents, savePath, inputFiles[i].name);
        }

        // run test cases
        var testCases = question.testCases || [];
        var runStatus = [];
        for (var i = 0; i < testCases.length; i++) {
            var args = testCases[i].input;

            // Add the path to the input file names on the command line.
            // This will have a problem if those names are supposed to
            // be used for another purpose.
            for (var j = 0; j < inputFiles.length; j++) {
                args = args.replace(inputFiles[j].name, runPath + inputFiles[j].name);
            }

            var runCommand = "java -classpath " + runPath + " "
                + question.className + " " + args;
            let thisRun = yield self.runCommandLine(runCommand);
            runStatus.push(thisRun);

            // Save result back into question if desired
            if (saveResults) {
                question.testCases[i].output = thisRun;
            }
        }

        // Clean up (removing the files and folders we made)
        yield FileUploadController.removeAllQuestionFiles(savePath);
        yield FileUploadController.removeAllQuestionFiles(userId + "/");

        deferred.resolve(runStatus);

    }).catch(function (error) {
        console.log(error.stack);
        deferred.reject(error);
    });
    return deferred.promise;
};

/**
 * Saves a user submission to the database
 * @param submission
 *      JSON object with some of the question properties
 * @return
 *      a Promise that gets fulfilled with a Mongoose model UserSubmission object
 */
self.saveUserSubmission = function (submission) {
    const deferred = Q.defer();
    const us = new UserSubmission(submission);
    console.log("saving " + submission);
    us.save(function (err, submission) {
        if (err) {
            deferred.reject(err);
            return;
        }
        deferred.resolve(submission);
    });
    return deferred.promise;
};

module.exports = self;
