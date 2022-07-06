'use strict';

(function () {
    var app = angular.module('CS4570');
    app.factory('encodeService', encodeService);
    function encodeService() {
        var self = {};

        self.encode64 = function (str) {
            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
        };

        self.decode64 = function (str) {
            return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        };

        return self;
    }
})();