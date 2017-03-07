var express = require('express'),
    app = express(),
    fs = require('fs'),
    server = require('http').Server(app),
    io = require('socket.io')(server);


app.use(express.static(__dirname + '/public'));

var router = require('./server/gameRouter'), // подключение основного роутера для монитора диспетчера
    port = 9021,
    MainGameLogic = require('./server/gameLogic');

var GameLogic = new MainGameLogic();

console.log(new Date());

app.use('/', router);
server.listen(port);
console.info('Listening on port ' + (port) + '...\n');



io.on('connection', function (socket) {

    socket.on('gameId', function (data) {

       var game;
       if (data.gameId !== null) {
           console.log("Reload existing game");
           game = GameLogic.reload(data.gameId, data.owner, socket.id);
           socket.emit('game', game);
       } else {
           console.log("Create new game");
           console.log(socket.id);
           game = GameLogic.newGame({id:socket.id});
           console.log ("Join Game", game.gameId);
           socket.join(game.gameId);
           socket.emit('game', game);
           if (game.next_move) {
               var turn;
               if (game.history && game.history.length > 0) {
                   turn = game.history[game.history.length - 1].next_move;
               } else {
                   turn = game.next_move;
               }
               console.log ("Start Action", game.gameId, turn);
               io.sockets.in(game.gameId).emit('start', turn);}
       }
    });


    socket.on('fire', function(data){
        var message = GameLogic.fireHandle(data);
        message.row = data.row;
        message.index = data.index;
        io.sockets.in(data.gameId).emit('result', message);

    });

    socket.on('disconnect', function() {
        console.log("Disconnect"); //todo calculate server statistic
    });


    console.log("USER CONNECTED");
    socket.send(socket.id);

});
