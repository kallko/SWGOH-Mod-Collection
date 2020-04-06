const express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));
const loadData = require ('./server/RequestsforGG');
const GUILD = require ('./data/brazzers');
const characters = require ('./data/characters');
const modsController = require ('./server/modsController');
const guildController = require ('./server/guildController');
const legendCharacterController = require ('./server/controller/legendCharacterController');
const verificationController = require ('./server/verificationController');
const router = require('./server/serverRouter'),
      port = 1976;

app.use('/', router);
server.listen(port);
console.info('Listening on port ' + (port) + '...\n');
let HEROES;


init();


async function init () {
	// HEROES = JSON.parse(JSON.stringify(characters));
	HEROES = await loadData.getAllHeroes();


	// todo for testing run mod constructor for one persone:
	// const options = require ('./data/setModeOptions');
	// let result = verificationController.verificateModConstructorOptions(options, HEROES);
	// await modsController.creator(options, 621723826);
	// const options2 = require ('./data/modEtalon');
	// await modsController.creator(options2, 621723826);

	// todoCreate squads and top lists
	// const result3 = await guildController.createSquads();

	// const result2 = await modsController.creator(options, 452867287);
	// const result2 = await modsController.creator(options, 724256729);
	// const result2 = await modsController.creator(options, 347317671);
	// console.log('Errors', result);
	//todo check guild progress to legend
	legendCharacterController.checkGuild();
}


let mods,
    units,
    generalData,
    bigData = {};


io.on('connection', function (socket) {

    console.log('Client connected');

	socket.on('requestForMods', async function(allyCode){

		console.log("User connected with code ", allyCode );
		const modsForUser = await loadData.getAllMods(allyCode);
		socket.emit("heroes", HEROES);
		socket.emit("mods", modsForUser);
		socket.emit("guild", GUILD);
	});


    if (units) {
        console.log("Send UNIT");
        socket.emit("units", units)
    }


    if (mods) {
        console.log("Send MODS" , mods);
        socket.emit("mods", mods)
    }

	socket.on('upgradeModsForDefence', async function (allyCode) {
		const modsForUser = await loadData.getAllMods(allyCode);
	    const player = await loadData.getPlayer(allyCode);
		const result = modsController.getModsForUpgradeForDefence(player.units, modsForUser);
		console.log('Result ', result);
		socket.emit('upgradeModsForDefenceResponse', result);
    });

	socket.on('getModsForFarming', async function (allyCode) {
		const modsForUser = await loadData.getAllMods(allyCode);
		const player = await loadData.getPlayer(allyCode);
		const result = modsController.getModsForFarming(player.units, modsForUser, player.data.fleet_arena.members, player.data.arena.members);
		socket.emit('getModsForFarmingResponse', result);
	});

	socket.on('getColorUpMods', async function (allyCode) {
		let result = await modsController.getColoredUpMods(allyCode);
		socket.emit('getColorUpModsResponse', result);
	});

	socket.on('guildWarsConstructor', async function () {
		let result = await guildController.createSquads();
		socket.emit('getColorUpModsResponse', result);
	});

    socket.on('admin', function () {

        for (let key in bigData) {
            console.log(key);
            console.log("Heroes ", bigData[key].heroes.length);
            console.log("Mods ", bigData[key].mods.length);
            console.log("Collection ", bigData[key].collection.length);
        }
    });
});








