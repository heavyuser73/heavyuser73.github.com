
angular.module("myApp", []).controller('typingController', function($scope) {
    $scope.names = [
        {data:'가까운 데 집은 깎이고 먼 데 절은 비친다'},
        {data:'가는 날이 장날'},
        {data:'가는 말이 고와야 오는 말도 곱다'},
        {data:'개구리 올챙이 시절 모른다'},
        {data:'나는 새도 떨어뜨린다'},
        {data:'방귀 뀐 놈이 성낸다'},
        {data:'사공이 많으면 배가 산으로 간다'},
        {data:'사흘 굶어 아니나는 생각 없다'},
        {data:'손바닥으로 하늘가리기'},
        {data:'나는 새도 떨어뜨린다'},

        {data:'늦게 배운 도둑질이 날 새는 줄 모른다'},
        {data:'때리는 시어머니보다 말리는 시누이가 더 밉다'},
        {data:'도둑이 제 발 저린다'},
        {data:'못된 송아지 엉덩이에 뿔난다'},
        {data:'방귀 뀐 놈이 성낸다'},
        {data:'벙어리 냉가슴 앓듯'},
        {data:'보기 좋은 떡이 먹기도 좋다'},
        {data:'비온 뒤 땅이 굳는다'},
        {data:'빈대 잡다 초가삼간 태운다'},
        {data:'소 귀에 경 읽기'},

        {data:'아니 땐 굴뚝에 연기나랴'},
        {data:'어물전 망신은 꼴뚜기가 시킨다'},
        {data:'울며 겨자 먹기'},
        {data:'원숭이도 나무에서 떨어진다'},
        {data:'이미 엎질러진 물이다'},
        {data:'칼로써 흥한자 칼로써 망한다'},
        {data:'티끌 모아 태산'},
        {data:'하늘의 별 따기'},
        {data:'하늘이 무너저도 솟아날 구멍은 있다'},
        {data:'호랑이도 제 말 하면 온다'}

    ];

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

    $scope.init = function () {
        var index = Math.floor((Math.random() * $scope.names.length) + 1);
        $scope.inputData = $scope.names[index].data;
        $scope.outputData = "";
        $scope.curScore=0;
        $scope.maxScore=0;

    }
    $scope.typing = function ($event) {


        if($scope.isStart == false) {
            $scope.startTime = new Date().getTime();
            $scope.isStart = true;
        }

        if($event.keyCode == 13) {
            if($scope.typeCheck() == true)
                $scope.typeDone();
        }
    }

    $scope.typeDone = function () {
        var index = Math.floor((Math.random() * 10) + 1);
        $scope.inputData = $scope.names[index].data;
        $scope.inputDataLength = $scope.inputData.length;
        $scope.outputData = "";
        $scope.takeTime = new Date().getTime() - $scope.startTime;
        $scope.curScore=Math.floor(($scope.inputDataLength/($scope.takeTime/1000))*60);
        if($scope.maxScore < $scope.curScore) {
            $scope.maxScore = $scope.curScore;
        }
        $scope.isStart = false;
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
    $scope.init();
});



