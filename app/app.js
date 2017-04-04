
'use strict';
var evoApp = angular.module('evolentApp', ['ui.router']);

evoApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'app/views/templates/homePageTemplate.html'
        })
        .state('manage', {
            url: '/manage',
            templateUrl: 'app/views/templates/manageTemplate.html',
        })
        .state('readme', {
            url: '/readme',
            templateUrl: 'app/views/templates/readmeTemplate.html'
        });
});



