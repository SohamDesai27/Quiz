
'use strict';

(function () {
    var app = angular.module('CS4570');
    app.controller('ProblemUploadController',
        ['$http', '$scope', '$window', '$filter', '$location', '$rootScope', '$cookies', 'uploadService', 'encodeService',
        function ($http, $scope, $window, $filter, $location, $rootScope, $cookies, uploadService, encodeService) {
            var self = this;
            self.fileUploading = false;
            $rootScope.currentPage = "upload";

            self.submit = function () {
                if ($scope.questionFile) {
                    console.log($scope.questionFile);
                    self.fileUploading = true;
                    var user = JSON.parse(encodeService.decode64($cookies.get("user")));
                    uploadService.uploadFile($scope.questionFile, user.email)
                        .then(function (response) {
                            self.fileUploading = false;
                            console.log(response);
                            $location.path("/questionPreview/" + response.data._id);
                        });
                }
            };

        }]);
})();