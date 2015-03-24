angular.module('noBoundaries.services').factory('storageService', ['localStorageService', function (localStorageService) {

	var factory = {};

    factory.getLocalData = function(){

        var data = {
            username : localStorageService.get('username'),
            userID : localStorageService.get('userID'),

        };
        //console.log('Local data:');
        //console.log(data);
        return data;
    }

    factory.add = function(key, value){
        return localStorageService.set(key, value);
    }

    factory.remove = function(key){
        localStorageService.remove(key);
    }

    return factory;
}]);
