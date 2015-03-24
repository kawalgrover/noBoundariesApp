angular.module('noBoundaries.services').factory('publicService', ['$http','$window', function ($http,$window) {

    var factory = {};

    //Login
    factory.myEvents = function () {
        var promise = $http({method: 'GET',
                url: '/myEvents'
            })
            .success(function (data, status, headers, config) {
                console.log("Success getting events");
                return data;
            })
            .error(function (data, status, headers, config) {
                console.log("Error getting events");
                return {"success": false};
            });
        return promise;
    }

    return factory;
}]);