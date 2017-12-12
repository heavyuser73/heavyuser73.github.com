'use strict';

var enLangPath = 'data/saying_en.json';
var koLangPath = 'data/saying_ko.json';

var app = angular.module("myApp", ['ngRoute', 'pascalprecht.translate', 'ngSanitize', 'ngCookies']);

app.controller('mainController', function($scope, $translate) {
    $scope.langs = [
        {name:"한글", value:koLangPath, langKey:"ko"},
        {name:"English", value:enLangPath, langKey:"en"}
    ];
   
    
    $scope.selectedLangChanged = function () {
        localStorage.langPath = $scope.selectLang.value;
        $translate.use($scope.selectLang.langKey);    
            
    }
    var langPath = localStorage.langPath;
    if(langPath){
        if(langPath == koLangPath) {
            $scope.selectLang = $scope.langs[0];
        }
        else {
            $scope.selectLang = $scope.langs[1];
        }
    }
    else {
        localStorage.langPath = koLangPath;
        $scope.selectLang = $scope.langs[0];
    }
    
    
});


var translationsEN = {
    SAYING_TYPING_MAIN_TITLE: 'Saying Typing Exercise',
    SAYING_TYPING_SUB_TITLE: "Let's practice typing!",
    TYPING_EXERCISE: 'Typing exercise',
    TYPING_EXERCISE_EXPAIN: 'It is a place where anyone can practice typing.',
    KOREAN: 'Hangul',
    ENGLISH: 'English',
    START: 'Start',
    DEVELOPER: 'Developer',
    GO_HOME : 'Go home',
    SAYING : 'Saying',
    INPUT_SAYING : "Input Saying",
    SPEED_PER_MINUTE : "Speed per minute",
    MAX_SPEED_PER_MINUTE : "Max speed per minute",
    HOURS : "Hour",
    SECONDS : "Second"
  };
  
  var translationsKO= {
    SAYING_TYPING_MAIN_TITLE: '속담 타자 연습',
    SAYING_TYPING_SUB_TITLE: '타자 연습 열심히 해 봅시다!',
    TYPING_EXERCISE: '타자 연습',
    TYPING_EXERCISE_EXPAIN: '누구나 타자 연습을 할 수 있는 곳입니다.',
    KOREAN: '한글',
    ENGLISH: 'English',
    START: '시작',
    DEVELOPER: '만든사람',
    GO_HOME : '홈으로',
    SAYING : '속담',
    INPUT_SAYING : "속담을 입력 하세요",
    SPEED_PER_MINUTE : "분당 속도",
    MAX_SPEED_PER_MINUTE : "분당 최고 속도",
    HOURS : "시간",
    SECONDS : "초"
  };


app.controller('typingController', function($scope, $interval, $http) {
    $scope.returnAudio = new Audio('res/typewriter-line-break.mp3');
    var langPath = localStorage.langPath;
    var path;
    if(langPath != "") {
        path = langPath;
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

app.config(['$translateProvider', function ($translateProvider) {
    // add translation tables
    $translateProvider.translations('en', translationsEN);
    $translateProvider.translations('ko', translationsKO);
    $translateProvider.fallbackLanguage('ko');
    $translateProvider.preferredLanguage('ko');   
    // Enable escaping of HTML
    $translateProvider.useSanitizeValueStrategy('sanitize');
    $translateProvider.useLocalStorage();
  }]);
