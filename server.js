const express = require('express'),
    app = express(),
    server = require('http').Server(app),
    request = require("request"),
    io = require('socket.io')(server),
    util = require('util'),
    html2json = require('html2json').html2json;

app.use(express.static(__dirname + '/public'));
const HtmlResultParser = require ('./server/htmlResultParser');
const loadData = require ('./server/RequestsforGG');
const DataCalc = require ('./server/dataCalc');
const GUILD = require ('./data/brazzers');
const modsController = require ('./server/modsController');
const verificationController = require ('./server/verificationController');
// let Schemas = require('./public/connector/mongo-connector');
const router = require('./server/serverRouter'),
      port = 1976;

app.use('/', router);
server.listen(port);
console.info('Listening on port ' + (port) + '...\n');
let HEROES;


init();


async function init () {
	HEROES = await loadData.getAllHeroes();
	//todo for testing
	const options = require ('./data/setModeOptions');
	let result = verificationController.verificateModConstructorOptions(options, HEROES);
	console.log('Result is ', result);
	const result2 = await modsController.creator(options, 621723826);
	// const result2 = await modsController.creator(options, 452867287);
	console.log('Result 2', result);
}






let hrParser  = new HtmlResultParser();
let dataCalc  = new DataCalc();








const setsProps = [
    {name : "Speed", count : 4, bonus: 5, maxBonus: 10 },
    {name : "Health", count : 2, bonus: 2.5, maxBonus: 5 },
    {name : "Offense", count : 4, bonus: 5, maxBonus: 10 },
    {name : "Tenacity", count : 2, bonus: 2.5, maxBonus: 5 },
    {name : "Defense", count : 2, bonus: 2.5, maxBonus: 5 },
    {name : "Protection", count : 0, bonus: 0, maxBonus: 0 },
    {name : "Crit Chance", count : 2, bonus: 2.5, maxBonus: 5 },
    {name : "Potency", count : 2, bonus: 5, maxBonus: 10 },
    {name : "Crit Damage", count : 4, bonus: 15, maxBonus: 30 },
    {name : "Accuracy", count : 0, bonus: 0, maxBonus: 0 },
    {name : "Crit Avoidance", count : 0, bonus: 0, maxBonus: 0 }

];




let mods,
    units,
    generalData,
    bigData = {},
    smallData = {},
    heroesCollection = [];

// loadGuildMembers();

// createUpdate();



io.on('connection', function (socket) {

    console.log('Client connected');

	socket.on('requestForMods', async function(allyCode){

		console.log("User connected with code ", allyCode );
		const modsForUser = await loadData.getAllMods(allyCode);
		socket.emit("heroes", HEROES);
		socket.emit("mods", modsForUser);
		socket.emit("guild", GUILD);
	});



    if(units) {
        console.log("Send UNIT");
        socket.emit("units", units)
    }


    if(mods) {
        console.log("Send MODS" , mods);
        socket.emit("mods", mods)
    }

    socket.on('newHero', function (data) {
        console.log(data.name + "___" + data.class);
        let toSave = new Schemas.units({
           "name" : data.name,
            "class" : data.class
        });
        console.log("to Save HERO", toSave);
        toSave.save()
    });

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

    socket.on('admin', function () {

        console.log('');

        for (let key in bigData) {
            console.log(key);
            console.log("Heroes ", bigData[key].heroes.length);
            console.log("Mods ", bigData[key].mods.length);
            console.log("Collection ", bigData[key].collection.length);
        }

    });

    socket.on('newMod', function (data) {
        console.log("New Mod to save", data);
        let toSave = new Schemas.mods({
            form: data.form,
            set: data.set,
            main: data.main,
            speed: data.speed
        });
        toSave.save()
    });

    //we send information in parts
    socket.on('partReceived', function(size){

        let partData = {};
        partData.data = [];
        let last = size + 5;
        let isAllSent  = false;

        for (let i = size; i < last; i++){
            if (generalData.data[i] && generalData.data[i].cityName &&  generalData.data[i].cityName.length > 0) {
                partData.data.push(generalData.data[i])
            } else {
                isAllSent = true;
                break;
            }
        }
        socket.emit('partData', partData);

        if (!isAllSent){

        } else {
            socket.emit('finished', partData);
        }
    });




});








