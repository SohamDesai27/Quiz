'use strict';

(function () {

    var app = angular.module('CS4570');

    app.controller('HomeController', ['$http', '$scope', '$window', '$filter', '$location', '$rootScope', '$cookies', 'encodeService', 'questionService',
        function ($http, $scope, $window, $filter, $location, $rootScope, $cookies, encodeService, questionService) {
            var self = this;

            if (!$cookies.get("token")) {
                $location.path("/sign_in");
                return;
            }

            $rootScope.currentPage = "home";

            self.activeQuestions = [];
            self.date = new Date();
            self.activeTopics = [];

            questionService.getAllQuestions()
                .then(function (data) {
                    self.activeQuestions = data;
                });

        }]);
})();