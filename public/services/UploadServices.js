'use strict';

(function () {
    var app = angular.module('CS4570');
    app.factory('uploadService', uploadService);
    uploadService.$inject = ['$window', 'Upload'];

    function uploadService($window, Upload) {
        var self = {};
        /**
         *
         * @param file
         *      The file to be upload
         * @param user
         *      Question that owns this file
         */
        self.uploadFile = function (file, user) {
            return Upload.upload({
                url: $window._base_url + "upload_file?user=" + user,
                data: { file: file }
            }).then(uploadFileComplete).catch(uploadFileFailed);

            function uploadFileComplete(response) {
                return response.data;
            }

            function uploadFileFailed(error) {
                console.log('Failed to upload file: ' + error.data);
                return null;
            }
        };
        return self;
    }

})();