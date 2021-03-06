function oldloadAllHeroes() {
	let url = "https://swgoh.gg";

	request(url, function (error, response, body) {
		if (!error) {
			let heroForParsing = html2json(body);
			heroesCollection = hrParser.heroColectionParser(heroForParsing);
		}
		console.log("heroesCollection LOADED");
	})

}



function loadDataForNewUser(container, login, socket) {


	container[login] = container[login] || [];
	container[login].mods = [];

	let url = "https://swgoh.gg/u/" + login + "/collection/";
	console.log('Send request ', url);
	request(url, function (error, response, body) {
		if (!error) {

			if (body.indexOf('Not Found') !== -1) {
				socket.emit('notLogin');
				return;
			}

			if (body.indexOf('第九军团') !== -1) {
				addGuildMember(login);
			}



			let heroForParsing = html2json(body);
			//console.log(JSON.stringify(heroForParsing));
			container[login].heroes = hrParser.heroParser(heroForParsing);
		} else {
			console.log("ERROR " + error);
		}
	});

	let modRequestIndex = 0;
	modeRequest(login, modRequestIndex);
	let modPreparsed;



	function modeRequest(login, i) {
		console.log("SEND REQ ", i);
		container[login].mods =  container[login].mods || [];
		//console.log( "230 ", container[login].mods.length);
		//https://swgoh.gg/u/dominnique/mods/

		let url = 'https://swgoh.gg/u/' + login + '/mods/?page=' + (++i);
		request(url, function (error, response, body) {

			if (!error) {
				//console.log("received ModData ", body);
				if (body.indexOf('Not Found') === -1) {
					modRequestIndex++;
					modPreparsed = html2json(body);
					if (modPreparsed.child[1] && hrParser.modeParser(modPreparsed.child[1])) {
						container[login].mods = container[login].mods.concat(hrParser.modeParser(modPreparsed.child[1]));
						//console.log( "243 ", container[login].mods.length);

						modeRequest(login, modRequestIndex);
					} else {
						if (socket) {
							container[login].finished = true;
							container[login].started = true;
							socket.emit('errorSWOGH');
						}
					}

				} else {

					if (container[login].mods && container[login].mods.length > 0 && container[login].heroes && container[login].heroes.length > 0) {
						joinModsAndUnits(container[login].mods, container[login].heroes);
						container[login].collection = heroesCollection;
						container[login].finished = true;
						container[login].started = true;
						container[login].heroes = dataCalc.calcSets(container[login].heroes, heroesCollection, setsProps);

						if (socket) {
							socket.emit("heroes", container[login]);
						} else {
							bigData[login].mods =  JSON.parse(JSON.stringify(container[login].mods));
							//console.log( "265 ", bigData[login].mods.length);

							bigData[login].collection =  JSON.parse(JSON.stringify(container[login].collection));
							bigData[login].heroes =  JSON.parse(JSON.stringify(container[login].heroes));
							bigData[login].started =  true;
							bigData[login].finished =  true;

						}
					}
				}
			} else {
				console.log("ERROR " + error);

			}
		});
	}


	function joinModsAndUnits(mods, units) {


		mods.forEach(mod => {
			let hero = units.find(unit => unit.name === mod.hero);
			if (hero) {
				hero[mod.forma] = mod;
			} else {
				console.log(" HERO Not FINDED ", mod.hero)
			}
		});
	}
}


function loadGuildMembers() {

	setTimeout(() => {
		Schemas.guild.collection.find({}).toArray(function (err, result) {

			if (err) throw err;
			createDataForGuild(result);

		});
	}, 1000)
}


function createDataForGuild(members) {
	members.forEach(member => {
		if (!bigData[member.name]) {
			bigData[member.name] = {};
		}
	});
	updateDataFromServer();
}

function createUpdate() {
	console.log("CREATE TASK for Update");
	setTimeout(updateDataFromServer,  4 * 60 * 60 * 1000); //
}

function updateDataFromServer() {
	console.log("Start Update ", bigData);
	let i = 0;
	smallData = {};
	for (let key in bigData) {
		console.log("Member", key);
		if (bigData[key].finished || !bigData[key].started) {
			setTimeout(() => {loadDataForNewUser(smallData, key)}, 3 * i * 60 * 1000);
			//loadDataForNewUser(smallData, key);
			i++;
		}
	}
	createUpdate();
}


function addGuildMember(login) {
	Schemas.guild.collection.find({name: login}).toArray(function (err, result) {

		if (err) throw err;

		if (result.length === 0) {
			let toSave = new Schemas.guild({
				name: login,
			});
			toSave.save();
		}
	});

}
// function calculateSets(units, heroesCollection) {
//     if (heroesCollection && heroesCollection.length > 0 ){
//
//         for (let i = 0; i < units.length; i++) {
//             let unit = units[i];
//
//                 let hero = heroesCollection.find(her => her.name = unit.name);
//                 unit.speed = hero.speed;
//                 unit.health = hero.health;
//                 unit.damage = hero.damage;
//
//                    for (let key in unit) {
//                         if (unit[key].set){
//                             let newKey = '';
//
//                             if (unit[key].level === '15') {
//                                 newKey = unit[key].set + "MaxSet"
//                             } else {
//                                 newKey = unit[key].set + "Set"
//                             }
//
//
//                             if (unit[newKey]) {
//                                 unit[newKey]++
//                             } else {
//                                 unit[newKey] = 1;
//                             }
//
//
//                         }
//                     }
//
//                     unit.mods = [];
//
//                     for (let key in unit) {
//                        if (unit[key].set) {
//                            unit.mods.push(unit[key]);
//                            delete unit[key];
//                        }
//                     }
//
//                     for (let i = 0; i < unit.mods.length; i++) {
//                      let mod = unit.mods[i];
//
//                         for (let key in mod) {
//                             if (key.indexOf("add") === 0 && mod[key] > 0){
//
//                                 if (unit[key]) {
//                                     unit[key] += mod[key];
//                                 } else {
//                                     unit[key] = mod[key];
//                                 }
//
//                             }
//
//                         }
//
//
//                     }
//
//
//                     if (unit.name === "Talia") {
//
//                         console.log("TALIA addDefensePercent ", unit.addDefensePercent );
//                         for (let key in unit) {
//
//                             console.log("KEY - ", key);
//
//                             unit.checked = true;
//
//                             let setName = '';
//
//                             if (key.indexOf("Set") !== -1 && key.indexOf("MaxSet") === -1) {
//
//                                 //console.log("WORK with ", key);
//
//                                 let additionalKey = key.replace("Set", "MaxSet");
//                                 let setName = key.replace("Set", '');
//
//                                 //console.log(additionalKey, "&&&&& ", setName);
//
//                                 let set = setsProps.find(setProp => setProp.name === setName);
//
//                                 if (unit[additionalKey]) {
//                                     let maxBonus = set.maxBonus * (Math.floor(unit[additionalKey]/set.count));
//
//                                    // unit["maxBonus" + setName] = maxBonus;
//
//                                     unit["add" + setName + "Percent"] += maxBonus;
//                                     unit[additionalKey] -= Math.floor(unit[additionalKey]/set.count) * set.count;
//                                     unit[key] += unit[additionalKey];
//                                 }
//
//                                 let bonus = set.bonus * (Math.floor(unit[key]/set.count));
//                                 unit["add" + setName + "Percent"] += bonus;
//
//
//
//
//                             } else {
//
//                                 let additionalKey = key.replace("MaxSet", "Set");
//
//                                 //console.log("ELSE KEY ", key, " additional key ", additionalKey);
//
//                                 if (key.indexOf("MaxSet") !== -1 && !unit[additionalKey]) {
//
//                                    //console.log("GO IN HEALTH");
//
//                                     let setName = key.replace("MaxSet", '');
//
//
//                                     let set = setsProps.find(setProp => setProp.name === setName);
//                                     let maxBonus = set.maxBonus * (Math.floor(unit[key]/set.count));
//                                     unit["add" + setName + "Percent"] += maxBonus;
//                                 }
//                             }
//                         }
//                     }
//
//         }
//     }
// }


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
//CreateViewModels = require('./server/createViewModels');
//const cvm = new CreateViewModels();
//create data obj from body
// function customParser(body) {
//     let result = {data:[]};
//
//     let lastCharAtString = 0;
//     let lastCharAtSingleString = 0;
//
//     body = body.substring(body.indexOf("\n") + 1);
//
//     while ( lastCharAtString !== -1 ) {
//         lastCharAtString = body.indexOf("\n");
//         let singleString = body.substring(0, lastCharAtString);
//         body = body.substring(lastCharAtString + 1);
//         let obj = {};
//         lastCharAtSingleString = findNextObjectStartChar(singleString);
//         singleString = singleString.substring(lastCharAtSingleString + 1);
//         lastCharAtSingleString = findNextObjectStartChar(singleString);
//         obj.zip = singleString.substring(0, lastCharAtSingleString);
//         singleString = singleString.substring(lastCharAtSingleString + 1);
//         lastCharAtSingleString = findNextObjectStartChar(singleString);
//         obj.lon = singleString.substring(0, lastCharAtSingleString);
//         singleString = singleString.substring(lastCharAtSingleString + 1);
//         lastCharAtSingleString = findNextObjectStartChar(singleString);
//         obj.lat = singleString.substring(0, lastCharAtSingleString);
//         singleString = singleString.substring(lastCharAtSingleString + 1);
//         lastCharAtSingleString = findNextObjectStartChar(singleString);
//         obj.city = singleString;
//
//         result.data.push(obj);
//
//     }
//
//     console.log("Create data finished");
//     return result;
// }

// //find in string needed char
// function findNextObjectStartChar (simpleString){
//     for (let i = 0; i < simpleString.length; i++) {
//         if (simpleString.charCodeAt(i) === 9) {
//             return i;
//         }
//     }
//     return -1;
// }
// socket.on('needDetails', function(zip){
//
//     let dataForSend = {};
//     const selectedDistrict = parsedData.data.find(district => district.zip === zip);
//     socket.emit('selectedDistrict' , selectedDistrict);
//     dataForSend = cvm.findNearestDistricts(parsedData.data, selectedDistrict, 10);
//
//     //send nearest districts
//     socket.emit('details', dataForSend);
// });
