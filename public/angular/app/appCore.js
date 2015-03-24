var app = angular.module('noBoundaries', ['noBoundaries.controllers','noBoundaries.directives','noBoundaries.services', 'ngRoute','LocalStorageModule']);

//LocalStorage Configuraton
app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('noBoundaries')
    .setStorageType('localStorage')
    .setNotify(true, true)
});

//Controllers mudule
angular.module('noBoundaries.controllers', []);
//Services Module
angular.module('noBoundaries.services', ['LocalStorageModule']);
//Directives Module
angular.module('noBoundaries.directives', []);