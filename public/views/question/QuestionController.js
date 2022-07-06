'use strict';

(function () {
    var app = angular.module('CS4570');
    app.controller('QuestionController', ['$http', '$scope', '$window', '$filter', 'encodeService',
        '$location', '$rootScope', '$cookies', '$routeParams', 'questionService', 'userSubmissionService',
        function ($http, $scope, $window, $filter, encodeService, $location, $rootScope, $cookies,
                  $routeParams, questionService, userSubmissionService) {
            var self = this;
            self.questionId = $routeParams.id;
            self.subId = $routeParams.subId;
            console.log($routeParams);

            self.code = "";

            self.options = {
                mode: 'text/x-java',
                lineNumbers: true,
                theme: 'monokai',
                scrollbarStyle: "native"
            };

            self.user = JSON.parse(encodeService.decode64($cookies.get('user')));

            var getUserSubmission = function () {
                userSubmissionService.getEvaluationById(self.subId)
                    .then(function (result) {
                        self.sub = result;
                        self.code = result.code;
                    });
            };

            if (self.questionId) {
                questionService.getQuestion(self.questionId)
                    .then(function (data) {
                        self.question = data;
                        self.code = self.question.starterCode;
                        if (self.subId) {
                            getUserSubmission();
                        }
                    })
                    .catch(function (error) {

                    });
            }

            $scope.submitStudentCode = function () {
                self.stackTrace = "";
                self.testCaseResults = [];
                var userSubmission = {};
                userSubmission.questionId = self.questionId;
                userSubmission.userId = self.user.email;
                userSubmission.userCode = self.code;

                userSubmissionService.evaluate(userSubmission)
                    .then(function (result) {
                        var question = result.data.question;
                        self.sub = result.data;
                        if (question) {
                            var testCases = question.testCases;
                            if (testCases) {
                                for (let i = 0; i < testCases.length; i++) {
                                    self.testCaseResults.push({
                                        public: testCases[i].public,
                                        result: result.data.results[i],
                                        input: testCases[i].input
                                    });
                                }
                            }
                            return;
                        }
                        self.stackTrace = result.data.message;
                    })
            };
        }]);
})();