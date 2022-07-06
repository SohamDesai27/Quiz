const Q = require('q');
const sectionParser = require('./sectionParser');

const self = {};

function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

self.saveSolutionForQuestion = function (questionId, questionContents) {
    return sectionParser.saveCodeFile(questionId, questionContents);
};

self.processFile = function (fileContents) {
    var obj = {};
    var sections = sectionParser.sections;
    for (var property in sections) {
        if (sections.hasOwnProperty(property)) {
            if (isFunction(sections[property])) {
                obj[property] = sections[property](fileContents, property);
            }
        }
    }
    return obj;
};

module.exports = self;