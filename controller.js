'use strict';

var enLangPath = 'data/saying_en.json';
var koLangPath = 'data/saying_ko.json';
var testWord;
var app = angular.module("myApp", ['ngRoute', 'pascalprecht.translate', 'ngSanitize', 'ngCookies']);

app.controller('mainController', function($scope, $translate, $http, $window, $location) {
    

    $window.gtag('config', 'UA-81190170-7', {'page_path': $location.path()});
    $window.gtag('event', 'page_view');

    $scope.init = function () {
        
    };

    $scope.langs = [
        {name:"한글", value:koLangPath, langKey:"ko"},
        {name:"English", value:enLangPath, langKey:"en"}
    ];
    
    $scope.gameLevelSel = [
        {name:'BEGINNER', value:"1"},
        {name:"INTERMEDIATE", value:"2"},
        {name:"ADVANCED", value:"3"},
        {name:"MASTER", value:"4"}
    ];

    $scope.selectedLangChanged = function () {
        localStorage.langPath = $scope.selectLang.value;
    };

    $scope.selectedGameLevelChanged = function () {
        localStorage.gameLevel = $scope.selectGameLevel.value;
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


    if (localStorage.gameLevel == 'undefined' || localStorage.gameLevel == null) {
        localStorage.gameLevel = 1;
        
    }

    $scope.selectGameLevel = $scope.gameLevelSel[parseInt(localStorage.gameLevel)-1];

    $http({
        method: 'GET',
        url: 'http://ec2-13-125-253-111.ap-northeast-2.compute.amazonaws.com:8080/visitCount'
    }).then(function successCallback(response) {
          var nCount = response.data.visitCount;
          $scope.visitCount = nCount;
    }, function errorCallback(response) {
          response;
    });

    //clock
    var canvas = document.getElementById("clockCanvas");
    var ctx = canvas.getContext("2d");
    var radius = canvas.height / 2;
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
      ctx.lineWidth = radius*0.08;
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
    VISITOR_COUNTER : "Visitor counter : ",
    GAME_START: 'Start',
    TYPING_GAME: 'Typing game for Hangul(beta)',
    TYPING_GAME_EXPAIN: 'It is a place where anyone can typing Hangul game.',
    BEGINNER:'Beginner',
    INTERMEDIATE:'Intermediate',
    ADVANCED:'Advanced',
    MASTER:"Master"
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
    REAL_SPEED_PER_MINUTE : "현재 분당 속도",
    VISITOR_COUNTER : "방문자 카운트 : ",
    GAME_START: '게임 시작',
    TYPING_GAME: '한글 타자 게임(베타)',
    TYPING_GAME_EXPAIN: '한글 타자 게임을 할 수 있는 곳입니다.',
    BEGINNER:"초급",
    INTERMEDIATE:'중급',
    ADVANCED:'고급',
    MASTER:"마스터"
  };


app.controller('typingController', function($scope, $interval, $http, $window, $location) {
    $window.gtag('config', 'UA-81190170-7', {'page_path': $location.path()});
    $window.gtag('event', 'page_view');
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
            if(ret == true) {
                $scope.typeDone();
            }
            else {
                $scope.typeFailed();
            }
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

app.controller('typingGameController', function($scope, $interval, $http, $window, $location) {
    $window.gtag('config', 'UA-81190170-7', {'page_path': $location.path()});
    $window.gtag('event', 'page_view');
    $scope.onloadFun = function() {
        startGame();
    }


    $http.get("data/game_data_ko.json").then(function (value) {
        testWord = value.data;
        $scope.init();
    });

    $scope.init = function () {
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
    .when("/typing_game", {
        templateUrl : "typing_game.html"
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
    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
    $translateProvider.useLocalStorage();
  }]);


var myGamePiece;
var myObstacles = [];
var myScore;
var gInterval;
var gId=0;
var gIntervalId =0;
var bGameOver = false;
var gameValue=0;
var gameIncreaseInterval = 3;
var myScoreCount = 0;
function startGame() {

    myScoreCount = 0;
    if(gIntervalId !=0) {
        clearInterval(gIntervalId);
        gIntervalId = 0;
    } 
    gIntervalId = setInterval(changeInterval, 20000);
    gInterval= 40 - (localStorage.gameLevel * gameIncreaseInterval * 2);
    myObstacles = [];
    bGameOver = false;
    //myGamePiece = new component(30, 30, "red", 10, 120);
    //myGamePiece = new component("30px", "Consolas", "blue", 280, 100, "text");
    //myGamePiece.gravity = 0.05;
    
    var btnRestart = document.getElementById("restart");
    btnRestart.style.display = "none";

    myScore = new component("20px", "Consolas", "blue", 800, 40, "text");
    myScore.text = "SCORE: 0";
    myGameArea.start();

    window.addEventListener('resize', resizeCanvas, false);
    function resizeCanvas() {
        
        var gapWidth = Math.floor((window.innerWidth - document.body.clientWidth)/2)
    
        myGameArea.canvas.width = window.innerWidth - (gapWidth * 2);
        myGameArea.canvas.height = window.innerHeight - 150;

        /**
         * Your drawings need to be inside this function otherwise they will be reset when 
         * you resize the browser window and the canvas goes will be cleared.
         */
        drawStuff(); 
    }
    resizeCanvas();
    
    var inputTyping = document.getElementById("typing");
    inputTyping.addEventListener("keyup", function(event) {
        
        if (event.keyCode === 13 || event.keyCode === 32 ) {
            event.preventDefault();
            var tempStr = inputTyping.value.trim();
            for(var i=0;i<myObstacles.length;i++) {
                if(myObstacles[i].text == tempStr) {
                    myObstacles.splice(i,1);
                    myScoreCount += 10;
                    break;
                }
                
            }
            inputTyping.value = '';
        }
    });



    function drawStuff() {
        myScore.w = myGameArea.canvas.getContext("2d").measureText(myScore.text).width;
        myScore.x = (myGameArea.canvas.width / 2) - (myScore.w);
    }
}

var myGameArea = {
    canvas :  document.createElement("canvas"),
    start : function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        var test = document.getElementById("numberOne");
        test.appendChild( this.canvas );
        this.frameNo = 0;

        if(gId != 0) {
            clearInterval(gId);
            gId = 0;
        }
        gId = setInterval(updateGameArea, gInterval);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.w = 0;
    this.h = 0;
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        var ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);

            

        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function changeInterval() {
    gInterval = gInterval - gameIncreaseInterval;
    if(gInterval < 1) {
        gInterval = 1;
    }

    if(gId != 0) {
        clearInterval(gId);
        gId = 0;
    }
    gId = setInterval(updateGameArea, gInterval);
}
function updateGameArea() {

    if(bGameOver) {
        return;
    }
    for (var i = 0; i < myObstacles.length; i += 1) {
        if(myObstacles[i].y > myGameArea.canvas.height) {
            bGameOver = true;
            var btnRestart = document.getElementById("restart");
            btnRestart.style.display = "block";
            return;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        var x = myGameArea.canvas.width;
        
        var minHeight = 20;
        var maxHeight = 200;
        var height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        var minGap = 50;
        var maxGap = 200;
        var gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        // myObstacles.push(new component(10, height, "green", x, 0));
        // myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));

        var index = Math.floor((Math.random() * testWord.length));
        var word = testWord[index];

        var ctx=myGameArea.canvas.getContext("2d");
        ctx.font = "20px Consolas";
        ctx.txt = word;
        var tempSize = ctx.measureText(word).width;
        var randomX = (myGameArea.canvas.width - tempSize) * Math.random();

        var texts = new component("20px", "Consolas", "black", randomX, 40, "text");

        

        texts.text = word;
        myObstacles.push(texts);
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].y += 1;
        myObstacles[i].update();
    }
    myScore.text= "SCORE: " + String(myScoreCount);
    var ctx=myGameArea.canvas.getContext("2d");
    ctx.font = "25px Consolas";
    ctx.txt = myScore.text;
    myScore.w = ctx.measureText(myScore.text).width;
    
    myScore.update();
    // Canvas can tell us the width
    

    //myGamePiece.newPos();
    //myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    //myGamePiece.gravity = n;
}

function clickRestartFunc() {
    location.reload();
}

