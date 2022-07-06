/**
 * Created by Kareshma on 4/10/2017.
 */

(function () {
    var app = angular.module('CS4570');

    app.controller('SubmissionsController',
        ['$http', '$scope', '$window', '$filter', '$location', '$rootScope', '$cookies', 'userSubmissionService', 'encodeService',
            function ($http, $scope, $window, $filter, $location, $rootScope, $cookies, submissionsService, encodeService) {
                var self = this;

                if (!$cookies.get("token")) {
                    $location.path("/sign_in");
                    return;
                }

                self.user = JSON.parse(encodeService.decode64($cookies.get('user')));

                $rootScope.currentPage = "submissions";

                self.viewSubmission = function (submission) {
                    $location.path("submissions/" + submission._id);
                };

                submissionsService.getEvaluations(self.user.username)
                    .then(function (data) {
                        self.submissions = data;
                    });

            }]);
})();