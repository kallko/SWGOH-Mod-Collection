/**
 * Created by kalko on 04.03.17.
 */
"use strict";
var gameLists = require('./gameLists.js');
var Games = new gameLists();


module.exports = ServerLogic;

function ServerLogic (){

}

ServerLogic.prototype.reload = function (id, owner, socketId){
    var result = Games.getGame(id);
    result.players[0].enemy_table = createEnemyTable(result.players[1].main_table);
    result.players[1].enemy_table = createEnemyTable(result.players[0].main_table);
    var player = result.players[+(!owner)];
    var oldId = player.id;
    result.history.forEach(function (history) {
       if (history.next_move == oldId) history.next_move = socketId;
    });
    if (result.next_move == oldId) result.next_move = socketId;
    player.id = socketId;
    return result;
};

ServerLogic.prototype.newGame = function (settings){
    var _data = Games.getData();
    var game;
    _data.players_connected++;

    if (_data.games.length == 0 ||
        _data.games[_data.games.length - 1].players.length == 2){
        game = prePublishGame(settings)
    } else {
        game = publishGame(_data.games[_data.games.length - 1], settings);
        _data.gameId++;
    }

    _data.games.push(game);
    Games.setData(_data);

    return game
};

ServerLogic.prototype.fireHandle = function (data) {
    var _game = Games.getGame(data.gameId);
    var message = {};
    var enemy_table;

    if (_game.players[0].id == data.playerId){
        enemy_table = _game.players[1].main_table;
        message.next_move = _game.players[1].id;
    } else {
        enemy_table = _game.players[0].main_table;
        message.next_move = _game.players[0].id;
    }

    if (enemy_table[data.row][data.index] == 1) {
        enemy_table[data.row][data.index] = 10;
        message.kind = getMessage(enemy_table, data.row, data.index);

        if (message.kind == 3) _game.ended = true; //todo create server statistic
        message.next_move = data.playerId;
    } else {
        enemy_table[data.row][data.index] = 0;
        message.kind = 0;
    }

    Games.setGame(_game);
    _game.history.push(message);
    return message;
};

function prePublishGame(settings) {
    console.log ("PrePublish game");
    var result = {};
    result.players = [];
    result.history = [];
    var player = {};
    player.id = settings.id;
    result.gameId = Games.getData().gameId;
    result.message = "waiting for enemy";
    player.main_table = createFleet(createMatrix(10));
    player.enemy_table = createMatrix(10);
    result.players.push(player);
    result.owner = true;

    return result;
}

function publishGame(preGame, settings) {
    console.log ("Publish Game");
    var result = preGame;
    var player = {};
    player.id = settings.id;
    result.server_statistic = {};
    result.server_statistic.players_connected = Games.getData().players_connected;
    player.main_table = createFleet(createMatrix(10));
    player.enemy_table = createMatrix(10);
    result.players.push(player);
    result.message = "start the game";
    result.owner = false;
    result.next_move = result.players[parseInt(Math.random()*2)].id;

    return result;
}

function createMatrix(size) {
    var result = new Array(size);
    for (var i = 0; i < size; i++){
        result[i] = new Array(size);
    }
    return result;
}

function createFleet(table) {
    table = createBattleCruiser(table);
    table = createLincors(table);
    table = createShips(table);
    table = createSubmarins(table);
    return table;
}

function createBattleCruiser(table) {

    var beginX = parseInt(Math.random()*10);
    var beginY = parseInt(Math.random()*10);
    var direction = parseInt(Math.random()*4);
    do {
       var impossible = false;
       var newX = beginX;
       var newY = beginY;
       for (var i = 0; i < 3; i++){
           newX = nextElement(direction, newX, newY)[0];
           newY = nextElement(direction, newX, newY)[1];
           if (newX < 0 || newX > 9 || newY < 0 || newY > 9) {
               impossible = true;
           }
       }

       direction++;
       if (direction > 3) direction = 0;

    } while (impossible);

    fillShip(4,beginX,beginY,--direction,table);

    return table;
}

function createLincors(table) {
    var quantity = 0;
    do {
        var mainCopyTable = table.slice(0);
        var beginX = parseInt(Math.random()*10);
        var beginY = parseInt(Math.random()*10);
        var direction = parseInt(Math.random()*4);
        var  x = beginX;
        var  y = beginY;
        for (var i = 0; i < 2; i ++){
            x = nextElement(direction,x,y)[0];
            y = nextElement(direction,x,y)[1];
        }
        var inTable = checkInTable(x, y);
        var freeWater = checkFreeWater (beginX, beginY, x, y, mainCopyTable);
        if (freeWater && inTable) {
            fillShip(3,beginX,beginY,direction,mainCopyTable);
            quantity++;
        }

        table = mainCopyTable;
    } while (quantity != 2);

    return table;
}

function createShips(table) {
    var quantity = 0;
    do {
        var mainCopyTable = table.slice(0);
        var beginX = parseInt(Math.random()*10);
        var beginY = parseInt(Math.random()*10);
        var direction = parseInt(Math.random()*4);
        var  x = beginX;
        var  y = beginY;
        for (var i = 0; i < 1; i ++){
            x = nextElement(direction,x,y)[0];
            y = nextElement(direction,x,y)[1];
        }
        var inTable = checkInTable(x, y);
        var freeWater = checkFreeWater (beginX, beginY, x, y, mainCopyTable);

        if (freeWater && inTable) {
            fillShip(2,beginX,beginY,direction,mainCopyTable);
            quantity++;
        }

    } while (quantity != 3);
    return table;
}


function createSubmarins(table) {
    var quantity = 0;
    do {
        var mainCopyTable = table.slice(0);
        var beginX = parseInt(Math.random()*10);
        var beginY = parseInt(Math.random()*10);
        var direction = parseInt(Math.random()*4);
        var  x = beginX;
        var  y = beginY;
        var freeWater = checkFreeWater (beginX, beginY, x, y, mainCopyTable);

        if (freeWater) {
            fillShip(1,beginX,beginY,direction,mainCopyTable);
            quantity++;
        }

    } while (quantity != 4);
    return table;
}


function nextElement(direction, x, y) {
    if(!direction) return [++x, y];
    if (direction == 1) return [x, ++y];
    if (direction == 2) return [--x, y];
    return [x, --y];
}


function getMessage(table, i, j) {
    for (var l = i - 1; l < i + 2; l++){
        for(var k = j - 1; k < j + 2; k++){
            if (table[l] && table[l][k] && table[l][k] == 1) {
                return 1; // shoot down
            }
        }
    }

    for (l = 0; l < 10; l++){
        for (k = 0; k < 10; k ++){
            if (table[l][k] == 1) return 2; //killing
        }
    }
    return 3; //game over
}

function checkInTable (x, y) {
    return !(x < 0 || y < 0 || x > 9 || y > 9);
}

function checkFreeWater(bx, by, ex, ey, table) {

    var maxX, maxY, minX, minY;
    bx > ex ? maxX = bx : maxX = ex;
    bx > ex ? minX = ex : minX = bx;
    by > ey ? maxY = by : maxY = ey;
    by > ey ? minY = ey : minY = by;

    var i = minY-1 < 0 ? 0 : minY - 1;
    var j = minX-1 < 0 ? 0 : minX - 1;
    var jEnd = maxX+1 > 9 ? 9 : maxX + 1;
    var iEnd = maxY+1 > 9 ? 9 : maxY + 1;

    for (var k = i; k <= iEnd; k++){
        for (var l = j; l <= jEnd; l++){
            if (table[l][k]) return false;
        }
    }
 return true;
}


function createEnemyTable(table) {
    var result = [];
    for (var i = 0; i < 10; i++){
        result[i] = [];
        for (var j = 0; j < 10; j++){
            result[i][j] = table[i][j];
            if (result[i][j] == 1) result[i][j] = undefined;
        }
    }
    return result;
}

function fillShip(size, x, y, direction, table) {
    for (var i = 0; i < size; i ++){
        table[x][y] = 1;
        x = nextElement(direction,x,y)[0];
        y = nextElement(direction,x,y)[1];
    }
    return table;
}