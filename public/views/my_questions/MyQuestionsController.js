'use strict';

(function () {

    var app = angular.module('CS4570');

    app.controller('MyQuestionsController',
        ['$http', '$scope', '$window', '$filter', '$location', '$rootScope', '$cookies', 'encodeService', 'questionService',
        function ($http, $scope, $window, $filter, $location, $rootScope, $cookies, encodeService, questionService) {
            var self = this;
            if (!$cookies.get("token")) {
                $location.path("/sign_in");
                return;
            }
            $rootScope.currentPage = "my_questions";
            self.singleQuestion = {};
            self.questions = [];
            self.user = JSON.parse(encodeService.decode64($cookies.get('user')));

            self.openDeleteModal = function (data) {
                self.singleQuestion = data;
            };

            self.openEditPage = function (data) {
                $location.path("editQuestion/" + data._id);
            };

            self.viewQuestion = function (data) {
                $location.path("question/" + data._id);
            };

            self.deleteSingleQuestion = function () {
                questionService.deleteQuestion(self.singleQuestion)
                    .then(function (result) {
                        var index = self.questions.indexOf(self.singleQuestion);
                        if (index > -1) {
                            self.questions.splice(index, 1);
                        }
                        self.singleQuestion = {};
                    })
                    .catch(function (err) {
                        console.log(err);
                        Materialize.toast("Error deleting question. Try again later.", 5000);
                });
            };

            self.makeActive = function (question) {
                questionService.updateQuestion(question)
                    .then(function (result) {
                        // we really don't need to do anything here...
                    }).catch(function (err) {
                        Materialize.toast("Error making question active. Try again later.", 4000)
                });
            };

            questionService.getInstructorQuestions(self.user.email)
                .then(function (data) {
                    self.questions = data;
                });

        }]);
})();