
angular.module("myApp", []).controller('typingController', function($scope, $interval, $http) {

    $scope.returnAudio = new Audio('typewriter-line-break.mp3');

    $http.get('saying.json').then(function (value) {
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
    }, 1000);

    $scope.init = function () {
        var index = Math.floor((Math.random() * $scope.sayingData.length) + 1);
        $scope.inputData = $scope.sayingData[index];
    }

    $scope.typing = function ($event) {

        if($scope.isStart == false) {
            $scope.startTime = new Date().getTime();
            $scope.isStart = true;
        }

        // Enter key down
        if($event.keyCode == 13) {
            if($scope.typeCheck() == true)
                $scope.typeDone();
        }
    }

    $scope.typeDone = function () {
        var index = Math.floor((Math.random() * 10) + 1);
        $scope.inputData = $scope.sayingData[index];
        $scope.inputDataLength = $scope.inputData.length;
        $scope.outputData = "";
        var takeTime = new Date().getTime() - $scope.startTime;
        $scope.curScore=Math.floor(($scope.inputDataLength/(takeTime/1000))*60);
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
            $scope.returnAudio.play();
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



