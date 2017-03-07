/**
 * Created by kalko on 04.03.17.
 */
module.exports = Game;

var _data = {
        "games" : [],
        "gameId": 0,
        "players_connected" : 0,
        "players_online": 0
};


function Game (){

}

Game.prototype.getData = function (){
    return _data;
};

Game.prototype.getGame = function (id){
    return _data.games[id];
};

Game.prototype.setData = function (data){
    if (!data) {
        console.log("!!!!!!! Try to save ZERRO Data!!!");
        return;
    }
    _data = data;
};

Game.prototype.setGame = function (data){
    if (!data) {
        console.log("!!!!!!! Try to save ZERRO !!!");
        return;
    }
    _data[data.id] = data;
};