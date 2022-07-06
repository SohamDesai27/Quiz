'use strict';

(function () {

    var app = angular.module('CS4570');

    app.controller('StudentCourseController',
        ['$http', '$scope', '$window', '$filter', '$location', '$rootScope', '$cookies', 'encodeService', 'courseService',
            'quizzService', '$routeParams', 'userSubmissionService',
            function ($http, $scope, $window, $filter, $location, $rootScope, $cookies, encodeService, courseService,
                      quizzService, $routeParams, userSubmissionService) {
                var self = this;
                if (!$cookies.get("token")) {
                    $location.path("/sign_in");
                    return;
                }

                $rootScope.currentPage = "account";
                self.user = JSON.parse(encodeService.decode64($cookies.get('user')));

                self.quizz = {};
                self.courseId = $routeParams.id;
                self.grades = [];

                for(var i = 0; i < self.user.enrolledCourses.length; i++) {
                    var c = self.user.enrolledCourses[i];
                    if (c._id == self.courseId) {
                        self.course = c;
                    }
                }

                userSubmissionService.getEvaluations(self.user.email)
                    .then(function (result) {
                        console.log(result);
                        self.grades = result;
                    });

                self.viewSubmission = function (sub) {
                    $location.path("question/" + sub.question._id).search("subId",sub._id);
                };

            }]);
})();