var memoryApp = angular.module("memoryApp", ['ngRoute']);
/**
 * Configure the Routes
 */
memoryApp.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/", {templateUrl: "partials/home.html", controller: "PageCtrl"})
    // Pages
    .when("/help", {templateUrl: "partials/help.html", controller: "OtherCtrl"})
    .when("/user", {templateUrl: "partials/settings.html", controller: "OtherCtrl"})
    .when("/user/settings_gen", {templateUrl: "partials/settings_page.html", controller: "OtherCtrl"})
    .when("/user/settings_pri", {templateUrl: "partials/settings_page.html", controller: "OtherCtrl"})
    .when("/user/sign_out", {templateUrl: "partials/sign_out.html", controller: "OtherCtrl"})
    // else 404
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "OtherCtrl"});
}]);

/**
 * Controls all other Pages
 */
memoryApp.controller('PageCtrl', function ($scope) {

  $scope.start = function() {
    console.log("Start button clicked");
  }

});

memoryApp.controller('OtherCtrl', function ($scope) {});