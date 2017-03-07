angular.module('seaBattle',[]);
angular.module('seaBattle').controller('viewGameController', ['$rootScope', '$scope', function (rootVm, vm) {

    vm.main_table = {};
    vm.enemy_table = {};
    vm.next_move = false;
    vm.history = [];

    vm.shooting = function (event, obj) {
        if (!vm.next_move) {
            alert ("Not your turn, Captain!");
            return;
        }
        var target = event.target;
        //todo check for repeat fire;
        if (vm.enemy_table.rows[obj].row[target.cellIndex-1] != undefined) {
            alert("You already shoot in this area, captain");
            return;
        }
        vm.$emit("fire", {gameId: vm.gameId, playerId: vm.id, row:obj, index:target.cellIndex-1});
        vm.next_move = false;
        console.log(vm.next_move);
    };

    vm.getImage = function (value) {
       if (value == undefined) return;
       if (value == 10) return "#";
       if (value) return "[]";
       return "O"
    };

    vm.getAction = function (youTurn, action) {
        if((youTurn && action) || (!youTurn && !action)) return "Shoot";
        return "Rafale"
    };



    vm.getResult = function (value) {
        if (!value) {
            return "missing";
        } else {
            if (value == 1) return "shoot down";
        }
        return "killing";
    };

    vm.getTarget = function(value) {
      if (value == 0) return "A";
      if (value == 1) return "B";
      if (value == 2) return "C";
      if (value == 3) return "D";
      if (value == 4) return "E";
      if (value == 5) return "F";
      if (value == 6) return "G";
      if (value == 7) return "H";
      if (value == 8) return "J";
      return "K";
    };

    rootVm.$on("newGame", function (event, data) {

        vm.id = data.players[0].id;
        vm.gameId = data.gameId;
        vm.main_table = {};
        vm.main_table.rows = [];
        vm.enemy_table.rows = [];
        for (var i = 0; i < data.players[0].main_table.length; i++){
            vm.main_table.rows.push({
                "key" : i,
                "row" : data.players[0].main_table[i]
            });
            vm.enemy_table.rows.push({
                "key" : i,
                "row" : data.players[0].enemy_table[i]
            });
        }

        if (!data.history || data.history.length == 0) {
            vm.next_move = (vm.id == data.next_move);
            console.log(vm.next_move);
        } else {
            vm.next_move = (data.history[data.history.length - 1].next_move == vm.id);
            console.log(vm.next_move);
        }
        changeMessage(vm.next_move);
        vm.$apply();
    });


    rootVm.$on('start', function (event, id) {
        console.log(id , vm.id, (id == vm.id));
        vm.next_move = (id == vm.id);
        changeMessage(vm.next_move);
    });

    rootVm.$on('result', function(event, data){
        vm.history.push(data);
        if(data.kind == 3){
            if (data.next_move == vm.id) {
                alert("Congratulations! You are winner");
            } else {
                alert("Sorry! You are loose");
            }
            localStorage.removeItem('gameId');
            localStorage.removeItem('socketId');
            localStorage.removeItem('owner');
        }
        if (data.next_move == vm.id) {
            if (data.kind == 0) {

                vm.main_table.rows[data.row].row[data.index] = vm.main_table.rows[data.row].row[data.index] * 10 * (data.kind && 1);
                vm.next_move = true;

            } else {
                vm.enemy_table.rows[data.row].row[data.index] = (data.kind && 10);
                vm.next_move = true;
            }

        } else {
            if (data.kind == 0) {

                vm.enemy_table.rows[data.row].row[data.index] = (data.kind && 10);

            } else {

                vm.main_table.rows[data.row].row[data.index] = vm.main_table.rows[data.row].row[data.index] * 10 * (data.kind && 1);
                vm.next_move = false;

            }

        }
        changeMessage(vm.next_move);

        vm.$apply();
    });

    rootVm.$on('createHistory', function (event, data) {
        vm.history = data;
        vm.$apply();
    });

    function changeMessage(next) {
        if (next) {
            vm.$emit('changeMessage', "Your action, captain");
        } else {
            vm.$emit('changeMessage', "Wait for enemy action, captain");
        }
    }
}]);