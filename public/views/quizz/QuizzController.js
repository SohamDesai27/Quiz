'use strict';

(function () {

    var app = angular.module('CS4570');

    app.controller('QuizzController',
        ['$http', '$scope', '$window', '$filter', '$location', '$rootScope', '$cookies', 'encodeService', 'quizzService', '$routeParams', 'questionService',
            function ($http, $scope, $window, $filter, $location, $rootScope, $cookies, encodeService, quizzService, $routeParams, questionService) {
                var self = this;
                if (!$cookies.get("token")) {
                    $location.path("/sign_in");
                    return;
                }

                $rootScope.currentPage = "account";
                self.user = JSON.parse(encodeService.decode64($cookies.get('user')));

                self.quizzId = $routeParams.id;
                self.quizz = {};

                self.selectedQuestions = [];

                self.deleteQuizz = function () {

                };

                self.addQuestion = function (question) {
                    var index = getSelectedQuestionIndex(question);
                    if (index > -1) {
                        self.selectedQuestions.splice(index, 1);
                        console.log(self.selectedQuestions);
                        return;
                    }
                    self.selectedQuestions.push(question);
                };

                var getSelectedQuestionIndex = function (question) {
                    for(var i = 0; i < self.selectedQuestions.length; i++) {
                        var q = self.selectedQuestions[i];
                        if (q._id === question._id) {
                            return i;
                        }
                    }
                    return -1;
                };

                self.isSelected = function (question) {
                    return getSelectedQuestionIndex(question) > -1;
                };

                self.saveSelection = function () {
                    console.log(self.quizz.questions);
                    self.quizz.questions = [];
                    self.quizz.questions = JSON.parse(JSON.stringify(self.selectedQuestions));
                    console.log(self.quizz.questions);
                    quizzService.updateQuizz(self.quizz)
                        .then(function (result) {
                            console.log(result);
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                };

                var getQuizz = function () {
                    quizzService.getQuizz(self.quizzId)
                        .then(function (result) {
                            self.quizz = result;
                            self.selectedQuestions = [];
                            getQuestions();
                        })
                        .catch(function (err) {
                            Materialize.toast('Error retrieving Quizzes. Try again later.', 4000)
                        });
                };

                var getQuestions = function () {
                    questionService.getInstructorQuestions(self.user.email)
                        .then(function (data) {
                            self.questions = data;
                            for(var i = 0; i < self.questions.length; i++) {
                                var question = self.questions[i];
                                if (checkSelection(question)) {
                                    self.addQuestion(question);
                                }
                            }
                        });
                };

                var checkSelection = function (question) {
                    for(var i = 0; i < self.quizz.questions.length; i++) {
                        var q = self.quizz.questions[i];
                        if (q._id === question._id) {
                            return true;
                        }
                    }
                    return false;
                };

                getQuizz();
            }]);
})();