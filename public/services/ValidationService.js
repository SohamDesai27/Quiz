'use strict';

(function () {
    var app = angular.module('CS4570');
    app.factory('validationService', validationService);
    function validationService() {
        var self = {};

        self.isValidEmail = function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        };

        self.emptyInput = function (input) {
            return (input === "");
        };

        return self;
    }
})();