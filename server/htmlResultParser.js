/**
 * Created by andreyk on 08.03.2018.
 */
module.exports = htmlResultParser;

function htmlResultParser (){
}

let complete = false;

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


htmlResultParser.prototype.heroColectionParser = function (htmlData) {
    let i = 0;
    let result = [];
    while (htmlData.child[1].child[3].child[15].child[3].child[3].child[1].child[i] !== undefined) {

        let hero = {};

        if (htmlData.child[1].child[3].child[15].child[3].child[3].child[1].child[i].attr &&
            htmlData.child[1].child[3].child[15].child[3].child[3].child[1].child[i].attr.class &&
            htmlData.child[1].child[3].child[15].child[3].child[3].child[1].child[i].attr.class.some(clas => clas === 'character')) {


            //console.log(JSON.stringify(htmlData.child[1].child[3].child[15].child[3].child[3].child[1].child[i].child[1]));


            hero.name = htmlData.child[1].child[3].child[15].child[3].child[3].child[1].child[i].child[1].child[3].child[3].child[0].text;
            hero.speed = htmlData.child[1].child[3].child[15].child[3].child[3].child[1].child[i].child[1].child[7].child[5].child[0].text;
            hero.health = htmlData.child[1].child[3].child[15].child[3].child[3].child[1].child[i].child[1].child[7].child[3].child[0].text;
            hero.damage = htmlData.child[1].child[3].child[15].child[3].child[3].child[1].child[i].child[1].child[7].child[6].child[1].child[0].text;

            result.push(hero);
        }
        i++;
    }

    return result;
};

htmlResultParser.prototype.heroParser = function (htmlData) {

    //todo {"node":"element","tag":"div","attr":{"class":["col-xs-6","col-sm-3","col-md-3","col-lg-2"]} - begin string with pers

    // let block = htmlData.child[1].child[3].child[15].child[3].child[3].child[1].child[5].child[1];
    let block = htmlData.child[1].child[3].child[15].child[5].child[3].child[1].child[5].child[1];

    let i = 0;
    let lastError  = 0;
    let result = [];

    while (block.child[i] !== undefined) {
        let hero = {};

        if (block.child[i].child){

            try {

                hero.name =      block.child[i].child[1].child[5].child[0].child[0].text;
                hero.maxPower =  block.child[i].child[1].child[3].attr.title[3];
                hero.realPower = block.child[i].child[1].child[3].attr.title[1];
                hero.level =     block.child[i].child[1].child[1].child[1].child[19].child[0].text;
                hero.tir =       block.child[i].child[1].child[1].child[1].child[21].child[0].text;
                hero.progress = parseInt(parseInt(hero.realPower)/parseInt(hero.maxPower) * 100);
                hero.progress = hero.progress > 100 ? parseInt(hero.progress / 100) : hero.progress;

                result.push(hero);
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
    return result;
};

htmlResultParser.prototype.modeParser = function (htmlData) {
    let result = [];
    //let errorMods = [];

    let i = 0;
    let modsArray;
    try {
        // modsArray = htmlData.child[3].child[15].child[3].child[3].child[1].child[5].child[1];
        modsArray = htmlData.child[3].child[15].child[5].child[3].child[1].child[5].child[1];
    } catch (e) {
        console.log( "Some Error");
        return false;
    }

    if (!complete) {let result = paths (modsArray.child[1], 0);}
    console.log('RESULT ', result);
    // const modStatSimpleHeroOne = modsArray.child[3].child[1].child[1].child[1].child[0]; // hero
    // const modStatSimpleHeroOneAndHalf = modsArray.child[3].child[1].child[1].child[1].child[0].child[2]; // level
    // const modStatSimpleHeroTwo = modsArray.child[3].child[1].child[1].child[3]; // stats
    //
    // for (let i = 0; i < modStatSimpleHeroOne.child.length; i++) {
    //     console.log(i, ' ', JSON.stringify(modStatSimpleHeroOne.child[i]));
    // }

    // for (let i = 3; i < modsArray.child.length; i+= 2) {
	// 	console.log(i, ': modsArray ', JSON.stringify(modsArray.child[i]));
	// 	for (let j = 0; j < modsArray.child.length; j ++ ) {
	// 		console.log(i, ' ', j, ': modsArray ', JSON.stringify(modsArray.child[j]));
	// 		for (let k = 0; k < modsArray.child.length; k ++ ) {
	// 			console.log(i, ' ', j, ' ', k, ': modsArray ', JSON.stringify(modsArray.child[k]));
	// 			for (let l = 0; l < modsArray.child.length; l ++ ) {
	// 				console.log(i, ' ', j, ' ', k, ' ', l, ': modsArray ', JSON.stringify(modsArray.child[l]));
	// 			}
	// 		}
	// 	}
	// }

    // while (modsArray && modsArray.child[i] !== undefined && false) {
    //     if (modsArray.child[i].attr) {
    //         let mod = {};
    //         // let j = 0;
    //         // while (modsArray.child[i].child[1].child[1].child[3].child[1].child[3].child[j] !== undefined) {
    //         //     try {
    //         //
    //         //         if (modsArray.child[i].child[1].child[1].child[1].child[0].child[3].attr.alt[2] === "Crit") {
    //         //             mod.set =  modsArray.child[i].child[1].child[1].child[1].child[0].child[3].attr.alt[2] + " " + modsArray.child[i].child[1].child[1].child[1].child[0].child[3].attr.alt[3];
    //         //             mod.forma =  modsArray.child[i].child[1].child[1].child[1].child[0].child[3].attr.alt[4];
    //         //         } else {
    //         //             mod.set =  modsArray.child[i].child[1].child[1].child[1].child[0].child[3].attr.alt[2];
    //         //             mod.forma =  modsArray.child[i].child[1].child[1].child[1].child[0].child[3].attr.alt[3];
    //         //         }
    //         //
    //         //
    //         //
    //         //         mod.level = modsArray.child[i].child[1].child[1].child[1].child[0].child[1].child[0].text;
    //         //         mod.hero =  modsArray.child[i].child[1].child[1].child[1].child[0].child[3].attr.alt[0];
    //         //         mod.class =  modsArray.child[i].child[1].child[1].child[1].child[0].child[3].attr.alt[1];
    //         //
    //         //         mod.mainStatValue = modsArray.child[i].child[1].child[1].child[3].child[1].child[1].child[1].child[0].child[0].text;
    //         //         mod.mainStat = modsArray.child[i].child[1].child[1].child[3].child[1].child[1].child[1].child[2].child[0].text;
    //         //         //3-5-7
    //         //         try {
    //         //             mod.firstStat      = modsArray.child[i].child[1].child[1].child[3].child[1].child[3].child[1].child[3].child[0].text;
    //         //             mod.firstStatValue = modsArray.child[i].child[1].child[1].child[3].child[1].child[3].child[1].child[1].child[0].text;
    //         //         } catch (e) {
    //         //             mod.firstStat      = '';
    //         //             mod.firstStatValue = '';
    //         //         }
    //         //
    //         //         try {
    //         //             mod.secondStat      = modsArray.child[i].child[1].child[1].child[3].child[1].child[3].child[3].child[3].child[0].text;
    //         //             mod.secondStatValue = modsArray.child[i].child[1].child[1].child[3].child[1].child[3].child[3].child[1].child[0].text;
    //         //         } catch (e) {
    //         //             mod.secondStat      = '';
    //         //             mod.secondStatValue = '';
    //         //         }
    //         //
    //         //
    //         //         try {
    //         //             mod.thirdStat      = modsArray.child[i].child[1].child[1].child[3].child[1].child[3].child[5].child[3].child[0].text;
    //         //             mod.thirdStatValue = modsArray.child[i].child[1].child[1].child[3].child[1].child[3].child[5].child[1].child[0].text;
    //         //         } catch (e) {
    //         //             mod.thirdStat      = '';
    //         //             mod.thirdStatValue = '';
    //         //         }
    //         //
    //         //         try {
    //         //             mod.forthStat      = modsArray.child[i].child[1].child[1].child[3].child[1].child[3].child[7].child[3].child[0].text;
    //         //             mod.forthStatValue = modsArray.child[i].child[1].child[1].child[3].child[1].child[3].child[7].child[1].child[0].text;
    //         //         } catch (e) {
    //         //             mod.forthStat      = '';
    //         //             mod.forthStatValue = '';
    //         //         }
    //         //
    //         //         mod.hero =  modsArray.child[i].child[1].child[1].child[1].child[0].child[2].child[0].attr.title.join(' ');
    //         //
    //         //     } catch (e) {
    //         //         // mod.hero = modsArray.child[i].child[1].child[1].child[1].child[0].child[2].child[0].attr.title;
	// 		// 		console.log(mod.hero = modsArray.child[i].child[1].child[1].child[1].child[0].child[2].child[0]);
    //         //
    //         //         if (!mod.hero) {
    //         //             console.log("ERROR in  ", mod.hero = modsArray.child[i].child[1].child[1].child[1].child[0].child[2].child[0].attr);
    //         //         }
    //         //         //errorMods.push(mod);
    //         //     }
    //         //
    //         //     j++;
    //         // }
    //             console.log('The mod is ', mod);
    //             clearCrit(mod);
    //         for (let i = 0; i < setsProps.length; i++){
    //            calculateMod(mod, setsProps[i].name);
    //         }
    //
    //         result.push(mod);
    //     }
    //     i++;
    //
    // }
    //console.log("Find Error in mods :", errorMods.length);
    return result;
};


function calculateMod (mod, field) {
    let name = "add" + field.toString();
    mod[name] = 0;
    mod[name + "Percent"] = 0;
    for (let key in mod) {
        //console.log("mod[key] ", mod[key], "field ", field);
        if (mod[key] === field && key.length > 3) {
            let newKey = key.toString().substring(0, key.toString().length - 4);
            if (key !== "mainStat") {
                if ((mod[newKey + "StatValue"] && mod[newKey + "StatValue"].indexOf(".") !== -1) ) {
                    mod[name + "Percent"] += parseFloat(mod[newKey + "StatValue"]);
                } else {
                    mod[name] += parseInt(mod[newKey + "StatValue"]);
                }
            } else {
                if (mod[key] === "Speed") {
                    mod.addSpeed += parseInt(mod.mainStatValue);
                }
                if (mod[key] === "Health") {
                    mod.addHealthPercent += parseFloat(mod.mainStatValue);
                }
                if (mod[key] === "Offense") {
                    mod.addOffensePercent += parseFloat(mod.mainStatValue);
                }
                if (mod[key] === "Tenacity") {
                    mod.addTenacityPercent += parseInt(mod.mainStatValue);
                }

                if (mod[key] === "Potency") {
                    mod.addPotencyPercent += parseInt(mod.mainStatValue);
                }

                if (mod[key] === "Defense") {
                    mod.addDefensePercent += parseFloat(mod.mainStatValue);
                }

                if (mod[key] === "Accuracy") {
                    mod.addAccuracyPercent += parseFloat(mod.mainStatValue);
                }

                if (mod[key] === "Critical Avoidance") {
                    mod['addCritical Avoidance'] += parseFloat(mod.mainStatValue);
                }

                if (mod[key] === "Protection") {
                    mod.addProtectionPercent += parseFloat(mod.mainStatValue);
                }

            }




        }
    }

}


function clearCrit (mod) {
    for (let key in mod){
        console.log('MKODKEY ', mod[key]);
        if (mod[key].indexOf("Critical") !== -1){
            //console.log("1 ", mod[key]);
            mod[key] = mod[key].replace("Critical", "Crit");
            let newKey = mod[key].replace("Critical", "Crit");
            mod["add" + newKey] = 0;
        }
    }
}

let indexes = [];
let level = 0;
function recurs (mod, level) {
	for (let k in mod)  {
		if (typeof mod[k] === "object" && mod[k] !== null && k === 'child') {
		    indexes[level] = level;
		    level ++;
			recurs(mod[k], level);
		} else {
		    console.log(indexes.join(' '));
        }
	};
}


function paths(item) {
	function iter(r, p) {
		var keys = Object.keys(r);
		if (keys.length) {
			return keys.forEach(x => iter(r[x], p.concat(x)));
		}
		result.push([p])
	}
	var result = [];
	iter(item, []);
	return result;
}

function attributeSearcher (mod) {
    const search = 'statmod-level';
    const indexes = [];
    for (let i0 = 0; mod.child[i0]; i0++) {
        indexes[0] = i0;
        const nextMod = mod.child[i0];
        if (nextMod.attr && nextMod.attr.class && nextMod.attr.class === search) {
            console.log('We have found ', search);
            break;
        }
		for (let i1 = 0; nextMod.child && nextMod.child[i1]; i1++) {
			const nextMod = mod.child[i1];
			indexes[1] = i1;
			if (nextMod.attr && nextMod.attr.class && nextMod.attr.class === search) {
				console.log('We have found ', search);
				break;
			}
			for (let i2 = 0; nextMod.child && nextMod.child[i2]; i2++) {
				indexes[2] = i2;
				const nextMod = mod.child[i2];
				if (nextMod.attr && nextMod.attr.class && nextMod.attr.class === search) {
					console.log('We have found ', search);
					break;
				}
				for (let i3 = 0; nextMod.child && nextMod.child[i3]; i3++) {
					indexes[3] = i3;
					const nextMod = mod.child[i3];
					if (nextMod.attr && nextMod.attr.class && nextMod.attr.class === search) {
						console.log('We have found ', search);
						break;
					}
					for (let i4 = 0; nextMod.child && nextMod.child[i4]; i4++) {
						indexes[4] = i4;
						const nextMod = mod.child[i4];
						if (nextMod.attr && nextMod.attr.class && nextMod.attr.class === search) {
							console.log('We have found ', search);
							break;
						}
						for (let i5 = 0; nextMod.child && nextMod.child[i5]; i5++) {
							indexes[5] = i5;
							const nextMod = mod.child[i5];
							if (nextMod.attr && nextMod.attr.class && nextMod.attr.class === search) {
								console.log('We have found ', search);
								break;
							}
							for (let i6 = 0; nextMod.child && nextMod.child[i6]; i6++) {
								indexes[6] = i6;
								const nextMod = mod.child[i6];
								if (nextMod.attr && nextMod.attr.class && nextMod.attr.class === search) {
									console.log('We have found ', search);
									break;
								}
								for (let i7 = 0; nextMod.child && nextMod.child[i7]; i7++) {
									indexes[7] = i7;
									const nextMod = mod.child[i7];
									if (nextMod.attr && nextMod.attr.class && nextMod.attr.class === search) {
										console.log('We have found ', search);
										break;
									}
									for (let i8 = 0; nextMod.child && nextMod.child[i8]; i8++) {
										indexes[8] = i8;
										const nextMod = mod.child[i8];
										if (nextMod.attr && nextMod.attr.class && nextMod.attr.class === search) {
											console.log('We have found ', search);
											break;
										}
										for (let i9 = 0; nextMod.child && nextMod.child[i9]; i9++) {
											indexes[9] = i9;
											console.log (indexes.join(' '), nextMod.child[i9]);
										}
									}
								}
							}
						}
					}
				}
			}
		}
    }


    complete = true;
}
