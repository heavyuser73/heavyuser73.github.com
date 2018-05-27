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
            
    };
    $scope.clickKoLang = function (event) {
        $translate.use("ko");
    };
    $scope.clickEnLang = function (event) {
        $translate.use("en");
    };

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
    
    //clock
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var radius = canvas.height / 4;
    ctx.translate(radius, radius);
    radius = radius * 0.90
    setInterval(drawClock, 1000);
    
    function drawClock() {
      drawFace(ctx, radius);
      drawNumbers(ctx, radius);
      drawTime(ctx, radius);
    }
    
    function drawFace(ctx, radius) {
      var grad;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2*Math.PI);
      ctx.fillStyle = 'white';
      ctx.fill();
      grad = ctx.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
      grad.addColorStop(0, '#333');
      grad.addColorStop(0.5, 'white');
      grad.addColorStop(1, '#333');
      ctx.strokeStyle = grad;
      ctx.lineWidth = radius*0.1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, radius*0.1, 0, 2*Math.PI);
      ctx.fillStyle = '#333';
      ctx.fill();
    }
    
    function drawNumbers(ctx, radius) {
      var ang;
      var num;
      ctx.font = radius*0.15 + "px arial";
      ctx.textBaseline="middle";
      ctx.textAlign="center";
      for(num = 1; num < 13; num++){
        ang = num * Math.PI / 6;
        ctx.rotate(ang);
        ctx.translate(0, -radius*0.85);
        ctx.rotate(-ang);
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius*0.85);
        ctx.rotate(-ang);
      }
    }
    
    function drawTime(ctx, radius){
        var now = new Date();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        //hour
        hour=hour%12;
        hour=(hour*Math.PI/6)+
        (minute*Math.PI/(6*60))+
        (second*Math.PI/(360*60));
        drawHand(ctx, hour, radius*0.5, radius*0.07);
        //minute
        minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
        drawHand(ctx, minute, radius*0.8, radius*0.07);
        // second
        second=(second*Math.PI/30);
        drawHand(ctx, second, radius*0.9, radius*0.02);
    }
    
    function drawHand(ctx, pos, length, width) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.moveTo(0,0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
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
    SECONDS : "Second",
    KOREAN_LANG : "한국어",
    ENGLISH_LANG : "English",
    REAL_SPEED_PER_MINUTE : "Realtime speed per minute",
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
    SECONDS : "초",
    KOREAN_LANG : "한국어",
    ENGLISH_LANG : "English",
    REAL_SPEED_PER_MINUTE : "현재 분당 속도"
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
    if(!localStorage.maxScore) {
        $scope.maxScore = localStorage.maxScore=0;
    }
    else {
        $scope.maxScore = localStorage.maxScore;
    }
    $scope.spendSecond=0;
    $scope.startTime=0;
    $scope.realTimeScore=0;

    $interval(function () {
        if($scope.isStart == true) {
            $scope.spendSecond = Math.floor((new Date().getTime() - $scope.startTime)/1000);
            var takeTime = new Date().getTime() - $scope.startTime;
            var realTimeLeng = Hangul.disassemble($scope.outputData).length;
            $scope.realTimeScore=Math.floor((realTimeLeng/(takeTime/1000))*60);
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
            var ret = $scope.typeCheck();
            if(ret == true)
                $scope.typeDone();
            else
                $scope.typeFailed();
        }
    }

    $scope.typeDone = function () {        
        var takeTime = new Date().getTime() - $scope.startTime;
        $scope.curScore=Math.floor(($scope.inputDataLength/(takeTime/1000))*60);
        var realTimeLeng = Hangul.disassemble($scope.outputData).length + 1;
        $scope.realTimeScore=Math.floor((realTimeLeng/(takeTime/1000))*60);
        if(localStorage.maxScore < $scope.curScore) {
            $scope.maxScore = localStorage.maxScore = $scope.curScore;
        }
        $scope.isStart = false;
        $scope.outputData = "";
        $scope.init();
    }

    $scope.typeFailed = function () {      
        $scope.curScore=0;
        $scope.realTimeScore=0;
        $scope.isStart = false;
        $scope.outputData = "";
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

    var userLang = navigator.languages
    ? navigator.languages[0]
    : (navigator.language || navigator.userLanguage)

    $translateProvider.fallbackLanguage('en');
    if (userLang == 'ko') {
        $translateProvider.preferredLanguage('ko');
    } 
    else {
        $translateProvider.preferredLanguage('en');
    }

    // Enable escaping of HTML
    $translateProvider.useSanitizeValueStrategy('sanitize');
    $translateProvider.useLocalStorage();
  }]);
