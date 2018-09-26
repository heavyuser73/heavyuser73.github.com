'use strict';

var enLangPath = 'data/saying_en.json';
var koLangPath = 'data/saying_ko.json';

var app = angular.module("myApp", ['ngRoute', 'pascalprecht.translate', 'ngSanitize', 'ngCookies']);

app.controller('mainController', function($scope, $translate, $http) {

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
    TYPING_GAME_EXPAIN: 'It is a place where anyone can typing Hangul game.'
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
    TYPING_GAME_EXPAIN: '한글 타자 게임을 할 수 있는 곳입니다.'
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

app.controller('typingGameController', function($scope, $interval, $http) {
    $scope.onloadFun = function() {
        startGame();
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
    $translateProvider.useSanitizeValueStrategy('sanitize');
    $translateProvider.useLocalStorage();
  }]);









  var testWord = ["참다",
"크기",
"고기",
"남기다",
"서양",
"주요",
"지나치다",
"가져오다",
"냄새",
"부드럽다",
"여기다",
"이",
"공연",
"남녀",
"내놓다",
"떼다",
"만들어지다",
"속도",
"심각하다",
"준비",
"계속되다",
"구월",
"맑다",
"소년",
"소식",
"유월",
"작용",
"허리",
"골",
"공업",
"그중",
"노인",
"벌다",
"살리다",
"새",
"영어",
"출신",
"결정",
"경향",
"기록",
"나름",
"대답하다",
"반면",
"썰다",
"움직임",
"이미지",
"터지다",
"특성",
"교장",
"벗다",
"업무",
"입시",
"준비하다",
"청소년",
"돕다",
"응",
"이기다",
"찾아보다",
"취하다",
"다루다",
"달",
"사장",
"삼월",
"그렇지만",
"선배",
"업체",
"키",
"구하다",
"국회",
"그러므로",
"포함하다",
"걱정",
"결혼하다",
"만약",
"바르다",
"세월",
"숨",
"행사",
"깨닫다",
"누나",
"신",
"왕",
"점점",
"질문",
"특별",
"판단",
"해결하다",
"거리",
"계속하다",
"그치다",
"근처",
"너무나",
"높이다",
"부정",
"사정",
"도대체",
"막",
"부모님",
"수출",
"계시다",
"그",
"자르다",
"데리다",
"마리",
"무척",
"비용",
"비행기",
"옳다",
"원래",
"처리",
"최초",
"꼴",
"놀이",
"뜨겁다",
"뿌리",
"수입",
"초",
"그리하여",
"낮",
"일찍",
"직원",
"찍다",
"가볍다",
"내부",
"다소",
"상대",
"오전",
"피부",
"가게",
"가득",
"그저",
"도",
"벽",
"장군",
"무역",
"부담",
"약속",
"인사",
"줄",
"쳐다보다",
"충분히",
"대",
"신체",
"에너지",
"위원",
"정리하다",
"집안",
"배경",
"죽이다",
"단순하다",
"반대",
"법칙",
"빠지다",
"소금",
"오염",
"자전거",
"참여하다",
"탓",
"푸르다",
"그래",
"목",
"발표",
"범죄",
"위",
"흔들다",
"기초",
"논리",
"드라마",
"뽑다",
"피우다",
"감각",
"미리",
"부족하다",
"인사",
"저희",
"진행되다",
"교통",
"기구",
"법",
"오랜",
"젊은이",
"후보",
"거리",
"과제",
"근거",
"기록하다",
"다가오다",
"불다",
"시각",
"이끌다",
"종합",
"한글",
"가을",
"개발하다",
"내일",
"떨다",
"매일",
"손가락",
"수단",
"자",
"자유롭다",
"적극적",
"판매",
"형성",
"기울이다",
"길이",
"장면",
"점차",
"톤",
"관련되다",
"급",
"나머지",
"날씨",
"더불다",
"동물",
"의사",
"개방",
"건강하다",
"미래",
"앞서",
"여러분",
"왜냐하면",
"인구",
"기대하다",
"네",
"도착하다",
"병",
"소프트웨어",
"흘리다",
"반응",
"주인공",
"당연하다",
"따뜻하다",
"따로",
"비판",
"빌리다",
"세대",
"축구",
"형님",
"놓이다",
"당장",
"무렵",
"밝다",
"사물",
"일반적",
"장소",
"곱다",
"바닥",
"새끼",
"생각되다",
"서비스",
"선택하다",
"심다",
"적다",
"코",
"간단하다",
"고등학교",
"공개",
"교실",
"스스로",
"견디다",
"기사",
"막히다",
"매체",
"별",
"복잡하다",
"뿌리다",
"영역",
"체험",
"구속",
"때로",
"어쩌면",
"극복하다",
"불법",
"비밀",
"색",
"쓰이다",
"일정하다",
"다지다",
"밝혀지다",
"아까",
"알맞다",
"이념",
"희다",
"가리키다",
"모시다",
"발달",
"수많다",
"잘못",
"치르다",
"평화",
"공사",
"돌",
"똑같다",
"박사",
"성",
"전문가",
"단지",
"말씀하다",
"무용",
"불리다",
"싸움",
"자꾸",
"차리다",
"해외",
"그리",
"뜨다",
"문화재",
"미소",
"보통",
"식당",
"의미하다",
"이래",
"체육",
"구성되다",
"독특하다",
"땀",
"사례",
"소개하다",
"잘되다",
"추진하다",
"칠월",
"틀",
"평균",
"훈련",
"흐름",
"십이월",
"쌓이다",
"이익",
"쥐다",
"게다가",
"끓이다",
"논문",
"멈추다",
"사용되다",
"오랫동안",
"위기",
"정당",
"종이",
"찾아가다",
"폭력",
"혹시",
"늘다",
"양",
"절차",
"진짜",
"계시다",
"공기",
"닿다",
"물론",
"속하다",
"올림픽",
"이외",
"재미",
"제공하다",
"증가하다",
"기대",
"떡",
"식물",
"옛",
"외치다",
"적어도",
"편하다",
"평",
"권리",
"끝내다",
"대답",
"시작",
"어려움",
"일주일",
"자원",
"춤",
"넘기다",
"드리다",
"물체",
"분명히",
"시위",
"아무것",
"온",
"젖다",
"제외하다",
"최대",
"평소",
"견해",
"깨끗하다",
"농사",
"더구나",
"안정",
"어둠",
"어둡다",
"어쨌든",
"주택",
"고장",
"관련하다",
"눈길",
"물어보다",
"미안하다",
"밀다",
"스트레스",
"음",
"인사",
"주어지다",
"고려하다",
"과일",
"널리",
"농촌",
"올라오다",
"챙기다",
"고르다",
"바르다",
"벌어지다",
"소재",
"전망",
"포기하다",
"형성되다",
"고치다",
"그림자",
"눈",
"다하다",
"마침내",
"비교하다",
"시월",
"커지다",
"한쪽",
"검사",
"결론",
"들이다",
"맡기다",
"박물관",
"소문",
"싣다",
"쌓다",
"어서",
"자녀",
"제목",
"짓",
"판결",
"팔월",
"하얗다",
"희망",
"가방",
"군대",
"그만큼",
"무어",
"비로소",
"상대방",
"서구",
"소유",
"시골",
"실수",
"잘못되다",
"치료",
"폭",
"호",
"내밀다",
"맞다",
"부문",
"시리즈",
"임신",
"잡히다",
"해",
"규정",
"그램",
"밭",
"분석하다",
"식구",
"아예",
"어찌",
"울리다",
"작용하다",
"확실하다",
"개선",
"그릇",
"글자",
"바람직하다",
"연구하다",
"착하다",
"개",
"라디오",
"마련",
"부동산",
"신화",
"양",
"점",
"직업",
"거두다",
"방학",
"범위",
"조상",
"철학",
"검다",
"곁",
"근본적",
"너희",
"대형",
"따다",
"문제점",
"본격적",
"불가능하다",
"인제",
"충격",
"퍼지다",
"금방",
"남쪽",
"누르다",
"미술",
"백성",
"상당히",
"색깔",
"요리",
"유명하다",
"자네",
"기",
"꽤",
"서로",
"외국인",
"한참",
"군사",
"끊다",
"넘어가다",
"담기다",
"마당",
"부인",
"서두르다",
"지적",
"짝",
"참으로",
"충분하다",
"기쁘다",
"뛰다",
"숙제",
"앞두다",
"예산",
"온갖",
"우려",
"우산",
"기쁨",
"깊이",
"꾸미다",
"늘리다",
"무릎",
"발견되다",
"보호하다",
"시스템",
"이용",
"지난달",
"지르다",
"참여",
"걸음",
"겨우",
"마르다",
"비교적",
"애쓰다",
"올바르다",
"책상",
"춥다",
"흔하다",
"높아지다",
"늙다",
"단위",
"둘째",
"뛰어나다",
"무겁다",
"바람",
"상상",
"소득",
"수도",
"역",
"인식하다",
"자",
"침대",
"권",
"뜨다",
"맺다",
"수요",
"스타",
"시계",
"입술",
"잎",
"중간",
"지도자",
"천천히",
"구성하다",
"대체로",
"때리다",
"몹시",
"문득",
"스포츠",
"위원장",
"저기",
"특별하다",
"효과적",
"가까이",
"낫다",
"넘어서다",
"볶다",
"생산하다",
"언젠가",
"예술가",
"의도",
"저지르다",
"줄어들다",
"가만히",
"건",
"교회",
"대개",
"외부",
"한두",
"한때",
"화",
"흙",
"가난하다",
"고객",
"과학자",
"관광",
"살아오다",
"상대적",
"수술",
"식품",
"연기",
"일월",
"조",
"첫째",
"회원",
"도서관",
"들려오다",
"조금씩",
"조미료",
"풀리다",
"강력하다",
"들여다보다",
"마늘",
"선물",
"습관",
"아주머니",
"위험",
"지하",
"활용하다",
"가꾸다",
"고민",
"떠올리다",
"맨",
"법률",
"상처",
"좁다",
"지하철",
"집다",
"현",
"화면",
"군",
"대표적",
"만일",
"사회적",
"생겨나다",
"이어",
"주부",
"진리",
"태양",
"틀림없다",
"프로",
"피다",
"공급",
"도로",
"동료",
"잘못",
"지다",
"채우다",
"균형",
"기본적",
"부족",
"사무실",
"이월",
"일요일",
"접근",
"지켜보다",
"개성",
"달리다",
"더하다",
"띄다",
"무너지다",
"보통",
"쓰다",
"이러다",
"일어서다",
"죄",
"참",
"총장",
"핵심",
"후반",
"단순히",
"달려가다",
"방문",
"불만",
"불편하다",
"실제",
"종",
"피",
"강",
"관객",
"동작",
"뜻하다",
"막",
"밀리미터",
"비싸다",
"숫자",
"열",
"왼쪽",
"중세",
"택시",
"통합",
"계산",
"꼬리",
"놀랍다",
"양식",
"예전",
"저",
"전기",
"주식",
"틀리다",
"끊임없이",
"모델",
"붓다",
"상식",
"상표",
"시원하다",
"아니하다",
"어디",
"의식하다",
"고모",
"궁금하다",
"둘러싸다",
"딱",
"뛰다",
"민주화",
"보도",
"살피다",
"않다",
"약하다",
"잘못하다",
"잡지",
"거부하다",
"공무원",
"그만두다",
"댁",
"반갑다",
"부족",
"실시",
"운명",
"재정",
"차라리",
"학자",
"다녀오다",
"달다",
"대규모",
"동",
"민간",
"법원",
"비디오",
"사실상",
"아끼다",
"이쪽",
"지대",
"판단하다",
"행복하다",
"굽다",
"기름",
"실천하다",
"쏟아지다",
"연습",
"오른쪽",
"용어",
"익히다",
"지도",
"지위",
"풍부하다",
"화장실",
"기억하다",
"식량",
"실험",
"용기",
"토론",
"고급",
"고생",
"미치다",
"밟다",
"상당하다",
"섞다",
"수석",
"없애다",
"이뤄지다",
"적절하다",
"정상",
"제사",
"주말",
"지혜",
"참새",
"화장품",
"굵다",
"깨끗이",
"낡다",
"내년",
"농산물",
"눈앞",
"대학생",
"방문하다",
"붉다",
"사고",
"순서",
"아무래도",
"연구소",
"올",
"위대하다",
"이사",
"지배하다",
"틈",
"가령",
"거대하다",
"닫다",
"드물다",
"들르다",
"매달리다",
"생일",
"섬",
"이하",
"참석하다",
"토대",
"해결",
"행복",
"걸어가다",
"근로자",
"글쎄",
"목숨",
"백화점",
"변화하다",
"병",
"빠져나가다",
"안녕하다",
"여론",
"의복",
"체조",
"출발하다",
"현실적",
"화제",
"결정되다",
"고양이",
"공격",
"물가",
"민주주의",
"불안",
"소중하다",
"여유",
"의문",
"중학교",
"킬로미터",
"파도",
"흰색",
"가수",
"단",
"방송국",
"빛나다",
"숨다",
"실리다",
"압력",
"예금",
"예상되다",
"입학",
"증권",
"직후",
"차량",
"출산",
"물다",
"선진국",
"약",
"어느새",
"재판",
"저쪽",
"제자",
"창문",
"초",
"치즈",
"회복",
"구역",
"대응",
"반대하다",
"발휘하다",
"소비",
"심장",
"아이고",
"조용히",
"중소기업",
"직접적",
"진실",
"필자",
"협력",
"가스",
"계층",
"구멍",
"담당",
"만화",
"먹이다",
"무시하다",
"보도하다",
"살짝",
"생각나다",
"우유",
"인상",
"차갑다",
"철저하다",
"태아",
"관찰하다",
"괜히",
"끼다",
"날개",
"녀석",
"눈빛",
"단지",
"두르다",
"드디어",
"물속",
"민주",
"성공하다",
"소나무",
"여기저기",
"여인",
"운영하다",
"평가하다",
"표",
"필요성",
"감추다",
"머무르다",
"모",
"부위",
"비우다",
"설치하다",
"십일월",
"싸다",
"아울러",
"지시",
"형성하다",
"형제",
"화려하다",
"거울",
"덧붙이다",
"딴",
"몇몇",
"무기",
"세계적",
"안전",
"양파",
"이상",
"일종",
"처지",
"촬영",
"타다",
"틀다",
"형편",
"가지",
"감다",
"고추",
"규칙",
"본질",
"비치다",
"빵",
"서서히",
"스승",
"신분",
"실시되다",
"아마도",
"안방",
"앓다",
"어제",
"오직",
"위험하다",
"자신",
"잠시",
"졸업하다",
"증거",
"초점",
"포함되다",
"호랑이",
"강화하다",
"공포",
"권위",
"덜",
"둥글다",
"미루다",
"본래",
"부엌",
"세금",
"실정",
"영양",
"육체",
"입구",
"잔뜩",
"적극",
"최소한",
"펼쳐지다",
"경험하다",
"그이",
"넘치다"
];
var myGamePiece;
var myObstacles = [];
var myScore;
var gInterval;
var gId=0;

var bGameOver = false;


function startGame() {  
    gInterval=30;
    myObstacles = [];
    bGameOver = false;
    //myGamePiece = new component(30, 30, "red", 10, 120);
    //myGamePiece = new component("30px", "Consolas", "blue", 280, 100, "text");
    //myGamePiece.gravity = 0.05;
    
    var btnRestart = document.getElementById("restart");
    btnRestart.style.display = "none";

    myScore = new component("30px", "Consolas", "red", 800, 40, "text");
    myScore.text = "SCORE: 0000";
    myGameArea.start();

    window.addEventListener('resize', resizeCanvas, false);
    function resizeCanvas() {
        
        var gapWidth = Math.floor((window.innerWidth - document.body.clientWidth)/2)
    
        myGameArea.canvas.width = window.innerWidth - (gapWidth * 2);
        myGameArea.canvas.height = window.innerHeight - 250;

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
            var aaa = inputTyping.value.trim();
            for(var i=0;i<myObstacles.length;i++) {
                if(myObstacles[i].text == aaa) {
                    myObstacles.splice(i,1);
                    clearInterval(gId);
                    gInterval = gInterval - 1;
                    gId = setInterval(updateGameArea, gInterval);
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

        if(gId > 0) {
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
        ctx.font = "25px Consolas";
        ctx.txt = word;

        var tempSize = ctx.measureText(word).width;
        var randomX = (myGameArea.canvas.width - tempSize) * Math.random();

        var texts = new component("25px", "Consolas", "black", randomX, 40, "text");

        

        texts.text = word;
        myObstacles.push(texts);
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].y += 1;
        myObstacles[i].update();
    }
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.w = myGameArea.canvas.getContext("2d").measureText(myScore.text).width;
    
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

