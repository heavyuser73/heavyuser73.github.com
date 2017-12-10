'use strict';

var app = angular.module("myApp", ['ngRoute']);

app.controller('mainController', function($scope, $rootScope) {
    $scope.langs = [{name:"한글", value:"data/saying_ko.json"},
       {name:"English", value:"data/saying_en.json"}];

     $rootScope.langPath = "data/saying_ko.json"

     $scope.selectedLangChanged = function () {
        $rootScope.langPath = $scope.selectLang.value;
     }
});

app.controller('typingController', function($scope, $interval, $http, $rootScope) {

    $scope.returnAudio = new Audio('res/typewriter-line-break.mp3');

    var path;
    if($rootScope.langPath) {
        path = $rootScope.langPath;
    }
    else {
        path = "data/saying_ko.json"
    }
    $http.get(path).then(function (value) {
        $scope.sayingData = value.data;
        $scope.init();
    });

    $scope.outputStyle = {
        "background-color" : "lightskyblue",
        width:"100%",
        "font-size" : "18px",
        "padding" : "5px"
    };

    $scope.inputStyle = {
        "background-color" : "lightskyblue",
        width:"100%",
        "font-size" : "18px",
        "padding" : "5px"
    };

    $scope.isStart = false;

    $scope.inputData="";
    $scope.outputData="";
    $scope.curScore=0;
    $scope.maxScore=0;
    $scope.spendSecond=0;
    $scope.startTime=0;

    $interval(function () {
        if($scope.isStart == true) {
            $scope.spendSecond = Math.floor((new Date().getTime() - $scope.startTime)/1000);
        }
    }, 10);

    $scope.init = function () {
        var index = Math.floor((Math.random() * $scope.sayingData.length) + 1);
        $scope.inputData = $scope.sayingData[index];
        $scope.inputDataLength = Hangul.disassemble($scope.inputData).length;
    }

    $scope.typing = function ($event) {

        if($scope.isStart == false) {
            $scope.startTime = new Date().getTime();
            $scope.isStart = true;
        }

        // Enter key down
        if($event.keyCode == 13) {
            $scope.returnAudio.play();
            if($scope.typeCheck() == true)
                $scope.typeDone();
        }
    }

    $scope.typeDone = function () {
        $scope.outputData = "";
        $scope.takeTime = new Date().getTime() - $scope.startTime;
        $scope.curScore=Math.floor(($scope.inputDataLength/($scope.takeTime/1000))*60);
        if($scope.maxScore < $scope.curScore) {
            $scope.maxScore = $scope.curScore;
        }
        $scope.isStart = false;
        $scope.init();
    }

    $scope.typeCheck = function () {
        var source = $scope.inputData.trim();
        var target = $scope.outputData.trim();
        if(source == target) {
            $scope.outputStyle = {
                "background-color" : "lightskyblue",
                width:"100%",
                "font-size" : "18px",
                "padding" : "5px"
            }
            return true;
        }

        else {
            $scope.outputStyle = {
                "background-color" : "coral",
                width:"100%",
                "font-size" : "18px",
                "padding" : "5px"
            }
            return false;
        }
    }
});

app.config(function($routeProvider) {

    $routeProvider
    .when("/", {
        templateUrl : "main.html"
    })
    .when("/typing", {
        templateUrl : "typing.html"
    })
    .otherwise({redirectTo: '/'});
});


