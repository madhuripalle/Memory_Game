var memoryApp = angular.module("memoryApp", ['ngRoute']);
  /**
  * Configuring the routes
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
        // Else 404
        .otherwise("/404", {templateUrl: "partials/404.html", controller: "OtherCtrl"});
    }]);

/**
* Controller for the home page
*/
memoryApp.controller('PageCtrl', function ($scope, $timeout) {
    $scope.moduleState = 'startModule';
    $scope.isGuarding = true;
    $scope.inGame = false;
    $scope.numberRows = 4;
    $scope.numberColumns = 5;
    $scope.possibleMatches = ($scope.numberRows * $scope.numberColumns) / 2;
    $scope.previousSelected = false;
    $scope.previousCard = null;
    $scope.currentCard = null;
    $scope.matchedPairs = 0;
    $scope.deck = {};
    $scope.randomKeys = [];

    $scope.startgame = function() {
      $scope.moduleState = 'gameModule';
    }

    $scope.createRandomKeys = function() {
        /*Contains all 52 cards in a deck, jokers exclusive*/
        var imageSources = ['2_of_clubs.png', '2_of_diamonds.png', '2_of_hearts.png', '2_of_spades.png',
        '3_of_clubs.png', '3_of_diamonds.png', '3_of_hearts.png', '3_of_spades.png',
        '4_of_clubs.png', '4_of_diamonds.png', '4_of_hearts.png', '4_of_spades.png',
        '5_of_clubs.png', '5_of_diamonds.png', '5_of_hearts.png', '5_of_spades.png',
        '6_of_clubs.png', '6_of_diamonds.png', '6_of_hearts.png', '6_of_spades.png',
        '7_of_clubs.png', '7_of_diamonds.png', '7_of_hearts.png', '7_of_spades.png',
        '8_of_clubs.png', '8_of_diamonds.png', '8_of_hearts.png', '8_of_spades.png',
        '9_of_clubs.png', '9_of_diamonds.png', '9_of_hearts.png', '9_of_spades.png',
        '10_of_clubs.png', '10_of_diamonds.png', '10_of_hearts.png', '10_of_spades.png',
        'jack_of_clubs.png', 'jack_of_diamonds.png', 'jack_of_hearts.png', 'jack_of_spades.png',
        'queen_of_clubs.png', 'queen_of_diamonds.png', 'queen_of_hearts.png', 'queen_of_spades.png',
        'king_of_clubs.png', 'king_of_diamonds.png', 'king_of_hearts.png', 'king_of_spades.png',
        'ace_of_clubs.png', 'ace_of_diamonds.png', 'ace_of_hearts.png', 'ace_of_spades.png'];

        /*Creating an image array*/
        var imageArray = new Array();
        for (var k = 0; k < 52; k++) {
              imageArray[k] = new Image();
              imageArray[k].src = "imgs/" + imageSources[k];
        }

        /*Creating seperate random arrays for card and positions of card*/
        var pool = [];
        for (var i = 0; i < $scope.possibleMatches * 2; i++) {
              pool.push(i);
        }

        for (var n = 0; n < $scope.possibleMatches; n++) {
              var randIndex = Math.floor((Math.random() * imageArray.length));
              var randImage = imageArray[randIndex];
              imageArray.splice(randIndex, 1);

              for(var i = 0; i < 2; i++) {
                    var randPool = Math.floor((Math.random() * pool.length));
                    $scope.randomKeys.splice(pool[randPool], 0, randImage.src);
                    pool.splice(randPool, 1);
              }

        }
    }

    $scope.createDeck = function() {
        $scope.createRandomKeys();
        $scope.deck.rows = [];
        for(var i = 0; i < $scope.numberRows; i++) {
              var row = {};
              row.cards = [];
              for (var j = 0; j < $scope.numberColumns; j++) {
                    var card = {};
                    card.isFaceUp = false;
                    card.src = $scope.randomKeys.pop();
                    row.cards.push(card);
              }
              $scope.deck.rows.push(row);
        }
    }

    
    /*Matching Pair Functionality*/
    $scope.check = function(card) {
        $scope.currentCard = card;
        if($scope.currentCard.isFaceUp) {
            return;
        }
        if(!$scope.previousSelected) {
            $scope.currentCard.isFaceUp = true;
            $scope.previousSelected = true;
            $scope.previousCard = $scope.currentCard;
            return;
        }
        if($scope.previousCard.src == $scope.currentCard.src) {
            $scope.currentCard.isFaceUp = true;
            $scope.previousCard = null;
            $scope.matchedPairs++;
        }
        else {
            $scope.isGuarding = true;
            $scope.currentCard.isFaceUp = true; 
            $timeout(function() {
                  $scope.previousCard.isFaceUp = $scope.currentCard.isFaceUp = false;
                  $scope.previousCard = null;
                  $scope.isGuarding = $scope.timeLimit ? false : true;
            }, 750);
        }
        $scope.previousSelected = false;
        if ($scope.matchedPairs == $scope.possibleMatches) {
            $scope.stopTimer();
        }
    }

    /*Timer Functionality*/
    $scope.timeLimit = 60000;
    $scope.isCritical = false;
    $scope.timer = null;


    $scope.start = function(){
    $scope.createDeck();
    $scope.timeLimit = 60000;
    $scope.isGuarding = false;
    $scope.inGame = true;

    ($scope.startTimer =function() {
        $scope.timeLimit -= 1000;
        $scope.isCritical = $scope.timeLimit <= 10000 ? true : false;

        $scope.timer = $timeout($scope.startTimer, 1000);
        if ($scope.timeLimit === 0) {
              $scope.stopTimer();
              $scope.isGuarding = true;
        }
    })();
    } 

    $scope.stopTimer = function() {
        $timeout.cancel($scope.timer);
        $scope.inGame = false;
        previousCard = null;
        previousSelected = false;
        matchedPairs = 0;
    }
});

memoryApp.controller('OtherCtrl', function ($scope) {});
