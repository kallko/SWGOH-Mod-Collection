const express = require('express'),
    app = express(),
    server = require('http').Server(app),
    request = require("request"),
    io = require('socket.io')(server),
    util = require('util'),
    html2json = require('html2json').html2json;

app.use(express.static(__dirname + '/public'));
let Schemas = require('./public/connector/mongo-connector');
const router = require('./server/serverRouter'),
      port = 9021,
      CreateViewModels = require('./server/createViewModels');



console.log(new Date());

app.use('/', router);
server.listen(port);

console.info('Listening on port ' + (port) + '...\n');
const cvm = new CreateViewModels();

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
];




let mods,
    //parsedMods = [],
    errorsdMods = [],
    units,
    generalData,
    bigData = {},
    parsedData,
    //heroes = [],
    heroesCollection = [];


loadAllHeroes();




io.on('connection', function (socket) {



    console.log("New connection");

    socket.on('newUserData', function(login){

        if (bigData[login] && bigData[login].finished) {
            console.log("DATA ALREADY CREATED ", login);
            socket.emit("heroes", bigData[login])

        } else {

            if (bigData[login] &&  bigData[login].started) {
                return;
            } else {
                bigData[login] = {};
                bigData[login].started = true;
                bigData[login].mods = [];
                loadDataForNewUser(login, socket);
            }



        }
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


    socket.on('admin', function () {

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

    socket.on('needDetails', function(zip){

        let dataForSend = {};
        const selectedDistrict = parsedData.data.find(district => district.zip === zip);
        socket.emit('selectedDistrict' , selectedDistrict);
        dataForSend = cvm.findNearestDistricts(parsedData.data, selectedDistrict, 10);

        //send nearest districts
        socket.emit('details', dataForSend);
    });

    console.log("USER CONNECTED");

});

//create data obj from body
function customParser(body) {
    let result = {data:[]};

    let lastCharAtString = 0;
    let lastCharAtSingleString = 0;

    body = body.substring(body.indexOf("\n") + 1);

    while ( lastCharAtString !== -1 ) {
         lastCharAtString = body.indexOf("\n");
         let singleString = body.substring(0, lastCharAtString);
         body = body.substring(lastCharAtString + 1);
         let obj = {};
         lastCharAtSingleString = findNextObjectStartChar(singleString);
         singleString = singleString.substring(lastCharAtSingleString + 1);
         lastCharAtSingleString = findNextObjectStartChar(singleString);
         obj.zip = singleString.substring(0, lastCharAtSingleString);
         singleString = singleString.substring(lastCharAtSingleString + 1);
         lastCharAtSingleString = findNextObjectStartChar(singleString);
         obj.lon = singleString.substring(0, lastCharAtSingleString);
         singleString = singleString.substring(lastCharAtSingleString + 1);
         lastCharAtSingleString = findNextObjectStartChar(singleString);
         obj.lat = singleString.substring(0, lastCharAtSingleString);
         singleString = singleString.substring(lastCharAtSingleString + 1);
         lastCharAtSingleString = findNextObjectStartChar(singleString);
         obj.city = singleString;

         result.data.push(obj);

    }

    console.log("Create data finished");
    return result;
}

//find in string needed char
function findNextObjectStartChar (simpleString){
    for (let i = 0; i < simpleString.length; i++) {
        if (simpleString.charCodeAt(i) === 9) {
            return i;
        }
    }
    return -1;
}


function loadAllHeroes() {
    let url = "https://swgoh.gg";

    request(url, function (error, response, body) {
        if (!error) {

            let preData = html2json(body);
            //console.log("All right", JSON.stringify(preData));
            let i = 0;
            while (preData.child[1].child[3].child[15].child[3].child[3].child[1].child[i] !== undefined) {

                let hero = {};

                if (preData.child[1].child[3].child[15].child[3].child[3].child[1].child[i].attr &&
                    preData.child[1].child[3].child[15].child[3].child[3].child[1].child[i].attr.class &&
                    preData.child[1].child[3].child[15].child[3].child[3].child[1].child[i].attr.class.some(clas => clas === 'character')) {


                     hero.name = preData.child[1].child[3].child[15].child[3].child[3].child[1].child[i].child[1].child[3].child[3].child[0].text;
                     hero.speed = preData.child[1].child[3].child[15].child[3].child[3].child[1].child[i].child[1].child[7].child[5].child[0].text;
                     hero.health = preData.child[1].child[3].child[15].child[3].child[3].child[1].child[i].child[1].child[7].child[3].child[0].text;
                     hero.damage = preData.child[1].child[3].child[15].child[3].child[3].child[1].child[i].child[1].child[7].child[6].child[1].child[0].text;

                     heroesCollection.push(hero);
                }
                i++;
            }
        }
        console.log("heroesCollection LOADED");
    })

}


function loadDataForNewUser(login, socket) {


    let url = "https://swgoh.gg/u/" + login + "/collection/";

    request(url, function (error, response, body) {
        if (!error) {

            //console.log(JSON.stringify(body));
            //body =
            if (body.indexOf('Not Found') !== -1) {
                socket.emit('notLogin');
                return;
            }

            bigData[login].heroes = [];
            //todo {"node":"element","tag":"div","attr":{"class":["col-xs-6","col-sm-3","col-md-3","col-lg-2"]} - begin string with pers
            // parsedData = customParser(body);
            // generalData = cvm.createGeneralModel(parsedData);
            //generalData.data.length = 70; //for development
            let preData = html2json(body);

            let block = preData.child[1].child[3].child[15].child[3].child[3].child[1].child[5].child[1];
            let i = 0;
            let lastError  = 0;

            while (block.child[i] !== undefined) {
                let hero = {};



                if (block.child[i].child){

                    //console.log("HERO ", JSON.stringify(block.child[i]));

                    try {

                        hero.name =     block.child[i].child[1].child[5].child[0].child[0].text;
                        hero.maxPower = block.child[i].child[1].child[3].attr.title[3];
                        hero.realPower = block.child[i].child[1].child[3].attr.title[1];
                        hero.level = block.child[i].child[1].child[1].child[1].child[19].child[0].text;
                        hero.tir = block.child[i].child[1].child[1].child[1].child[21].child[0].text;
                        bigData[login].heroes.push(hero);
                    } catch (e) {
                        console.log (" ERROR ");
                        if (lastError !== i) {
                            lastError = i;
                            i--;
                        } else {
                            i = 500;
                        }
                    }
                }
                i++;
            }

        } else {
            console.log("ERROR " + error);
        }
    });

    let modRequestIndex = 0;
    modeRequest(login, modRequestIndex);
    let modPreparsed;


    async function modeParser(data, login) {


        console.log("Mode parser");

        let i = 0;
        let modsArray = data.child[3].child[15].child[3].child[3].child[1].child[5].child[1];
        while (modsArray.child[i] !== undefined) {
            if (modsArray.child[i].attr) {
                let mod = {};
                let j = 0;

                while (modsArray.child[i].child[1].child[1].child[3].child[1].child[3].child[j] !== undefined) {
                    try {

                        let h = 0;

                        if (modsArray.child[i].child[1].child[1].child[1].child[0].child[3].attr.alt[2] === "Crit") {
                            mod.set =  modsArray.child[i].child[1].child[1].child[1].child[0].child[3].attr.alt[2] + " " + modsArray.child[i].child[1].child[1].child[1].child[0].child[3].attr.alt[3];
                            mod.forma =  modsArray.child[i].child[1].child[1].child[1].child[0].child[3].attr.alt[4];
                        } else {
                            mod.set =  modsArray.child[i].child[1].child[1].child[1].child[0].child[3].attr.alt[2];
                            mod.forma =  modsArray.child[i].child[1].child[1].child[1].child[0].child[3].attr.alt[3];
                        }



                        mod.level = modsArray.child[i].child[1].child[1].child[1].child[0].child[1].child[0].text;
                        mod.hero =  modsArray.child[i].child[1].child[1].child[1].child[0].child[3].attr.alt[0];
                        mod.class =  modsArray.child[i].child[1].child[1].child[1].child[0].child[3].attr.alt[1];

                        mod.mainStatValue = modsArray.child[i].child[1].child[1].child[3].child[1].child[1].child[1].child[0].child[0].text;
                        mod.mainStat = modsArray.child[i].child[1].child[1].child[3].child[1].child[1].child[1].child[2].child[0].text;
                        //3-5-7
                        try {
                            mod.firstStat      = modsArray.child[i].child[1].child[1].child[3].child[1].child[3].child[1].child[3].child[0].text;
                            mod.firstStatValue = modsArray.child[i].child[1].child[1].child[3].child[1].child[3].child[1].child[1].child[0].text;
                        } catch (e) {
                            mod.firstStat      = '';
                            mod.firstStatValue = '';
                        }



                        try {
                            mod.secondStat      = modsArray.child[i].child[1].child[1].child[3].child[1].child[3].child[3].child[3].child[0].text;
                            mod.secondStatValue = modsArray.child[i].child[1].child[1].child[3].child[1].child[3].child[3].child[1].child[0].text;
                        } catch (e) {
                            mod.secondStat      = '';
                            mod.secondStatValue = '';
                        }




                        try {
                            mod.thirdStat      = modsArray.child[i].child[1].child[1].child[3].child[1].child[3].child[5].child[3].child[0].text;
                            mod.thirdStatValue = modsArray.child[i].child[1].child[1].child[3].child[1].child[3].child[5].child[1].child[0].text;
                        } catch (e) {
                            mod.thirdStat      = '';
                            mod.thirdStatValue = '';
                        }



                        try {
                            mod.forthStat      = modsArray.child[i].child[1].child[1].child[3].child[1].child[3].child[7].child[3].child[0].text;
                            mod.forthStatValue = modsArray.child[i].child[1].child[1].child[3].child[1].child[3].child[7].child[1].child[0].text;
                        } catch (e) {
                            mod.forthStat      = '';
                            mod.forthStatValue = '';
                        }



                        mod.hero =  modsArray.child[i].child[1].child[1].child[1].child[0].child[2].child[0].attr.title.join(' ');

                    } catch (e) {
                        mod.hero = modsArray.child[i].child[1].child[1].child[1].child[0].child[2].child[0].attr.title;

                        if (!mod.hero) {
                            console.log("ERROR in  ", mod.hero = modsArray.child[i].child[1].child[1].child[1].child[0].child[2].child[0].attr);
                        }
                        errorsdMods.push(mod);
                    }

                    // console.log("DATA ", j);
                    // console.log(JSON.stringify(modsArray.child[i].child[1].child[1].child[3].child[1].child[3].child[j]));
                    j++;
                }
                // i = 10000;

                for (let i = 0; i < setsProps.length; i++){
                    calculateMod(mod, setsProps[i].name);
                }


                // calculateMod(mod, "Speed");
                // calculateMod(mod, "Health");
                // calculateMod(mod, "Offense");
                // calculateMod(mod, "Tenacity");
                // calculateMod(mod, "Defense");
                // calculateMod(mod, "Protection");
                // calculateMod(mod, "Critical Chance");
                // calculateMod(mod, "Potency");
                // calculateMod(mod, "Critical Damage");

                //console.log(i, "MOD => ", mod);
                bigData[login].mods.push(mod);
            }
            i++;

        }

        //console.log(JSON.stringify(errorsdMods))
    }



    async function modeRequest(login, i) {
        //console.log("SEND REQ ", i, parsedMods.length, parsedMods[i * 36 - 1]);
        //https://swgoh.gg/u/dominnique/mods/

        let url = 'https://swgoh.gg/u/' + login + '/mods/?page=' + (++i);
        request(url, function (error, response, body) {

            if (!error) {
                //console.log("received ModData ", body);
                if (body.indexOf('Not Found') === -1) {
                    modRequestIndex++;
                    modPreparsed  = html2json(body);
                    modeParser(modPreparsed.child[1], login);
                    modeRequest(login, modRequestIndex);
                } else {

                    if (bigData[login].mods && bigData[login].mods.length > 0 && bigData[login].heroes && bigData[login].heroes.length > 0) {
                        joinModsAndUnits(bigData[login].mods, bigData[login].heroes);

                        bigData[login].collection = heroesCollection;
                        bigData[login].finished = true;
                        calculateSets(bigData[login].heroes);


                        socket.emit("heroes", bigData[login]);
                    }


                }
                //generalData.data.length = 70; //for development
            } else {
                console.log("ERROR " + error);

            }
        });
    }


    function joinModsAndUnits(mods, units) {
        //console.log("Heroes", units);
        mods.forEach(mod => {
            let hero = units.find(unit => unit.name === mod.hero);
            if (hero) {
                hero[mod.forma] = mod;
            } else {
                console.log(" HERO Not FINDED ", mod.hero)
            }


        });

        console.log("JOIN FINISHED");
        //calculateSets(units);
    }
}



function calculateMod (mod, field) {
    let name = "add" + field.toString();
    mod[name] = 0;
    mod[name + "Percent"] = 0;
    for (let key in mod) {
        //console.log("mod[key] ", mod[key], "field ", field);
        if (mod[key] === field && key.length > 3) {
                let newKey = key.toString().substring(0, key.toString().length - 4);
                if ((mod[newKey + "StatValue"] && mod[newKey + "StatValue"].indexOf(".") !== -1) || key === "mainStat") {
                    mod[name + "Percent"] += parseFloat(mod[newKey + "StatValue"]);
                } else {
                    mod[name] += parseInt(mod[newKey + "StatValue"]);
                }



        }
    }

}


function calculateSets(units) {
    if (heroesCollection && heroesCollection.length > 0 ){

        for (let i = 0; i < units.length; i++) {
            let unit = units[i];

                let hero = heroesCollection.find(her => her.name = unit.name);
                unit.speed = hero.speed;
                unit.health = hero.health;
                unit.damage = hero.damage;

                   for (let key in unit) {
                        if (unit[key].set){
                            let newKey = '';

                            if (unit[key].level === '15') {
                                newKey = unit[key].set + "MaxSet"
                            } else {
                                newKey = unit[key].set + "Set"
                            }


                            if (unit[newKey]) {
                                unit[newKey]++
                            } else {
                                unit[newKey] = 1;
                            }


                        }
                    }

                    unit.mods = [];

                    for (let key in unit) {
                       if (unit[key].set) {
                           unit.mods.push(unit[key]);
                           delete unit[key];
                       }
                    }

                    for (let i = 0; i < unit.mods.length; i++) {
                     let mod = unit.mods[i];

                        for (let key in mod) {
                            if (key.indexOf("add") === 0 && mod[key] > 0){

                                if (unit[key]) {
                                    unit[key] += mod[key];
                                } else {
                                    unit[key] = mod[key];
                                }

                            }

                        }


                    }


                    if (unit.name === "Talia") {

                        console.log("TALIA addDefensePercent ", unit.addDefensePercent );
                        for (let key in unit) {

                            console.log("KEY - ", key);

                            unit.checked = true;

                            let setName = '';

                            if (key.indexOf("Set") !== -1 && key.indexOf("MaxSet") === -1) {

                                //console.log("WORK with ", key);

                                let additionalKey = key.replace("Set", "MaxSet");
                                let setName = key.replace("Set", '');

                                //console.log(additionalKey, "&&&&& ", setName);

                                let set = setsProps.find(setProp => setProp.name === setName);

                                if (unit[additionalKey]) {
                                    let maxBonus = set.maxBonus * (Math.floor(unit[additionalKey]/set.count));

                                   // unit["maxBonus" + setName] = maxBonus;

                                    unit["add" + setName + "Percent"] += maxBonus;
                                    unit[additionalKey] -= Math.floor(unit[additionalKey]/set.count) * set.count;
                                    unit[key] += unit[additionalKey];
                                }

                                let bonus = set.bonus * (Math.floor(unit[key]/set.count));
                                unit["add" + setName + "Percent"] += bonus;




                            } else {

                                let additionalKey = key.replace("MaxSet", "Set");

                                //console.log("ELSE KEY ", key, " additional key ", additionalKey);

                                if (key.indexOf("MaxSet") !== -1 && !unit[additionalKey]) {

                                   //console.log("GO IN HEALTH");

                                    let setName = key.replace("MaxSet", '');


                                    let set = setsProps.find(setProp => setProp.name === setName);
                                    let maxBonus = set.maxBonus * (Math.floor(unit[key]/set.count));
                                    unit["add" + setName + "Percent"] += maxBonus;
                                }
                            }
                        }
                    }




        }



    }


}
//receive data from url
// request(url, function (error, response, body) {
//     if (!error) {
//         parsedData = customParser(body);
//         generalData = cvm.createGeneralModel(parsedData);
//         //generalData.data.length = 70; //for development
//     } else {
//         console.log("ERROR " + error);
//     }
// });




// setTimeout(() => {
//     Schemas.mods.collection.find({}).toArray(function(err, result) {
//
//     if (err) throw err;
//     console.log(result);
//     mods = result;
// });
//
//
//
//     Schemas.units.collection.find({}).toArray(function(err, result) {
//
//         if (err) throw err;
//         console.log(result);
//         units = result
//     });
//     }, 500);


// //receive data from url
// url = 'https://swgoh.gg/u/kalko/mods/';
// request(url, function (error, response, body) {
//     if (!error) {
//         console.log("MODS.first");
//         //generalData.data.length = 70; //for development
//     } else {
//         console.log("ERROR " + error);
//     }
// });
//
// url = 'https://swgoh.gg/u/kalko/mods/?page=12';
// request(url, function (error, response, body) {
//     if (!error) {
//         console.log("MODS.second ", body);
//         //generalData.data.length = 70; //for development
//     } else {
//         console.log("ERROR " + error);
//     }
// });

// if (generalData) {
//     //send to client info about size of collection
//     socket.emit("size", generalData.data.length - 1);
//
//     let firstSendData = {};
//     firstSendData.data = [];
//     for (let i = 0; i < 5; i++){
//         firstSendData.data.push(generalData.data[i]);
//     }
//     socket.emit('generalData', firstSendData);
//
// } else {
//     console.log("General Data NOT ready");
// }