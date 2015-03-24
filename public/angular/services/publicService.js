angular.module('noBoundaries.services').factory('publicService', ['$http','$window', function ($http,$window) {

    var factory = {};

    //Register
    factory.registerUser = function(username,password,email,birthDate,recaptcha){
        var promise = $http({
            method: 'POST',
            url: '/registerUser',
            params: { username : username, password : password, email : email, birthDate : birthDate, recaptcha : recaptcha}
            })
        .success(function(data, status, headers, config) {
            console.log('Successful register ');
            $window.location.assign('/login?message=2');
        })
        .error(function(data, status, headers, config) {
            console.log('Error in register');
            $window.location.assign('/register?error=3');
        });
        return promise;
    }

    //Login
    factory.login = function (username, password) {
        var promise = $http({method: 'POST',
                url: '/logUser',
                params: { "username" : username, "password" : password }
            })
            .success(function (data, status, headers, config) {
                console.log("Success in login: "+data.username);
                return {username : data.username, language: data.language, sessionToken: data.sessionToken, isOnline: true,response: true};
            })
            .error(function (data, status, headers, config) {
                console.log("Error in login: "+data.username);
                return {"response": false};
            });
        return promise;
    }

    return factory;
}]);