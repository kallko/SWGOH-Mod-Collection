/**
 * Created by kalko on 04.03.17.
 */
"use strict";

angular.module('seaBattle').controller('socketController', ['$rootScope', '$scope', function (rootVm, vm) {
    var  socket;
    vm.gameId;

    firstInit();


    socket.on('message', function (data) {
        localStorage.setItem('socketId', data);
        vm.socketId = data;
        socket.emit('gameId', {"gameId": vm.gameId, "owner": localStorage.getItem("owner")})
    });

    socket.on('game', function (data) {
       if (data.history && data.history.length >0 ){
           vm.$emit('createHistory', data.history);
       }

       vm.message = data.message;
       vm.gameId = data.gameId;

       if (data.players.length > 1) {
          if(vm.owner == 'true') {
               data.players.length = 1;
           } else {
               data.players.splice(0, 1);
           }
       }

        vm.$emit("newGame", data);
        localStorage.setItem('gameId', vm.gameId);
        if (vm.owner == undefined) localStorage.setItem('owner', data.owner);
    });

    socket.on('start', function (data) {
        vm.message = "start the game";
        vm.$emit('start', data);
        vm.$apply();
    });

    socket.on('turn', function (data) {
       console.log("turn", data);
    });

    socket.on('result', function (data) {
        console.log("result", data);
        vm.$emit('result', data);
    });


    rootVm.$on("fire", function (event, object) {
        socket.emit('fire', object);
    });

    rootVm.$on('changeMessage', function (event, data) {
        vm.message = data;
    });


    function firstInit(){
        vm.gameId = localStorage.getItem('gameId');
        vm.owner = localStorage.getItem('owner');
        socket = io.connect('http://localhost:9021');
    }

}]);