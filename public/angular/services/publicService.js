angular.module('noBoundaries.services').factory('publicService', ['$http','$window', function ($http,$window) {

    var factory = {};

    factory.myUser = function () {
        var promise = $http({method: 'GET',
                url: '/myUser'
            })
            .success(function (data, status, headers, config) {
                console.log("Success getting myUser");
                return data;
            })
            .error(function (data, status, headers, config) {
                console.log("Error getting myUser");
                return {"success": false};
            });
        return promise;
    }

    return factory;
}]);