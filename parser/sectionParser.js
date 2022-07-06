/**
 * This will hold a list of valid sections of a input file
 * @type {[*]}
 */
const fs = require('fs-extra');

const self = {};

const removeTrailingLeadingSpaces = function (contents) {
    return contents.replace(/^\s+|\s+$/g, "");
};

const removeTrailingLeadingNewLines = function (contents) {
    return contents.replace(/^\n+|\n+$/g, "");
};

const removeTrailingLeadingQuotes = function (contents) {
    return contents.replace(/^"+|"+$/g, "");
};

const removeBrackets = function (contents) {
    return contents.replace(/\[|\]|/g, "");
};

const sanitize = function (contents) {
    var newContent = removeTrailingLeadingNewLines(contents);
    newContent = removeTrailingLeadingQuotes(newContent);
    newContent = removeTrailingLeadingSpaces(newContent);
    return newContent.split("\"").join("");
};

const infoTags = [
    "language",
    "points",
    "topics",
    "difficulty",
    "activeDate",
    "dueDate"
];

const retrieveTagContents = function(contents, tag) {
    var rex = new RegExp("(@" + tag + ")([^]*?)(@" + tag + ")");
    var match = contents.match(rex);
    if (match && match.length > 0) {
        return removeTrailingLeadingNewLines(match[2]);
    }
    return "";
};

const getSingleLineTagContent = function (content, tag) {
    const lines = content.split("\n");
    for (var i = 0; i < lines.length; i++) {
        var currentLine = lines[i];
        if (currentLine.includes(tag)) {
            return removeTrailingLeadingSpaces(currentLine.replace("@" + tag + ":", ""));
        }
    }
    return "";
};

const parseInfo = function (contents, tag) {
    const infoContent = retrieveTagContents(contents, tag);
    var info = {};
    for(var i = 0; i < infoTags.length; i++) {
        var currentTag = infoTags[i];
        if (currentTag == 'topics') {
            const topics = getSingleLineTagContent(infoContent, currentTag);
            info[currentTag] = parseTopics(topics);
            continue;
        }
        info[currentTag] = getSingleLineTagContent(infoContent, currentTag);
    }
    return info;
};

const parseTopics = function(contents) {
    // var topics = [];
    var topics = contents.split(",");
    for(var i = 0; i  < topics.length; i++)
    {
        topics[i] = removeBrackets(topics[i]);
    }
    return topics;
};

self.extractCompleteSolution = function (fileContent, tagName) {
    const tagContents = retrieveTagContents(fileContent, "solution");
    const lines = tagContents.split("\n");
    if (lines.length > 0) {
        var codeContent = "";
        for (var i = 1; i < lines.length; i++) {
            codeContent += lines[i] + "\n";
        }
        return codeContent;
    }
    return "";
};

self.extractClassName = function (fileContent, tagName) {
    const tagContents = retrieveTagContents(fileContent, "solution");
    const lines = tagContents.split("\n");
    if (lines.length > 0) {
        var filename = lines[0].split("\"").join("");
        return removeTrailingLeadingSpaces(filename);
    }
    return "";
};

self.saveCodeFile = function (questionId, fileContent) {
    const tagContents = retrieveTagContents(fileContent, "solution");
    const lines = tagContents.split("\n");
    if (lines.length > 0) {
        var filename = lines[0].split("\"").join("");
        filename = removeTrailingLeadingSpaces(filename);
        var filePath = "uploads/" + questionId + "/" + filename + ".java";
        var fileContents = "";
        for (var i = 1; i < lines.length; i++) {
            fileContents += lines[i] + "\n";
        }
        fs.ensureDirSync("uploads/" + questionId);
        fs.writeFileSync(filePath, fileContents);
        return filePath;
    }
    return "";
};

const parseSingleTestCase = function (content) {
    var lines = content.split("\n");
    var testCase = {};
    testCase.public = false;
    for(var i = 0; i < lines.length; i++) {
        var currentLine = lines[i];
        if (currentLine.includes("@public")) {
            testCase.public = true;
        }
        if (currentLine.includes("@inputs")) {
            var input = removeTrailingLeadingSpaces(currentLine.replace("@inputs:", ""));
            testCase.input = removeTrailingLeadingQuotes(input);
        }
    }
    return testCase;
};

const parseTestCases = function (content, tag) {
    const testCaseContents = retrieveTagContents(content, tag);
    var rex = /(@testCase)[^]*?(@testCase)/g;
    var match = testCaseContents.match(rex);
    var testCases = [];
    if (match) {
        for(var i = 0; i < match.length; i++) {
            var testCase = retrieveTagContents(match[i], "testCase");
            testCases.push(parseSingleTestCase(testCase));
        }
    }
    return testCases;
};

const parseInputFiles = function (content, tag) {
    const inputContents = retrieveTagContents(content, tag);
    var inputFiles = [];
    inputFiles = inputFiles.concat(parseInputFileReference(inputContents));
    inputFiles = inputFiles.concat(parseInputFileContents(inputContents));
    return inputFiles;
};

const parseInputFileReference = function (inputContents) {
    var rex = /(@inputRef)[^]*?(@inputRef)/g;
    var match = inputContents.match(rex);
    var inputFileReferences = [];
    if (match) {
        for(var i = 0; i < match.length; i++) {
            var ref = retrieveTagContents(match[i], "inputRef");
            var inputFile = {};
            inputFile.reference = sanitize(ref);
            inputFileReferences.push(inputFile);
        }
    }
    return inputFileReferences;
};

const parseInputFileContents = function (inputContents) {
    var rex = /(@inputFile)[^]*?(@inputFile)/g;
    var match = inputContents.match(rex);
    var inputFiles = [];
    if (match) {
        for(var i = 0; i < match.length; i++) {
            var contents = retrieveTagContents(match[i], "inputFile");
            if (contents) {
                var inputFile = parseSingleInputContents(contents);
                inputFiles.push(inputFile);
            }
        }
    }
    return inputFiles;
};

const parseSingleInputContents = function (contents) {
    const lines = contents.split("\n");
    var inputFile = {};
    inputFile.contents = "";
    if (lines.length > 0) {
        inputFile.name = lines[0].split("\"").join("");
    }
    for(var i = 1; i < lines.length; i++) {
        inputFile.contents += lines[i] + "\n";
    }
    return inputFile;
};

self.sections = {
    title: retrieveTagContents,
    info: parseInfo,
    question: retrieveTagContents,
    starterCode: retrieveTagContents,
    testCases: parseTestCases,
    inputFiles: parseInputFiles,
    completeSolution: self.extractCompleteSolution,
    className: self.extractClassName
};

module.exports = self;