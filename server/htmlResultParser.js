/**
 * Created by andreyk on 08.03.2018.
 */
module.exports = htmlResultParser;

function htmlResultParser (){
}


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

    let block = htmlData.child[1].child[3].child[15].child[3].child[3].child[1].child[5].child[1];
    let i = 0;
    let lastError  = 0;
    let result = [];

    while (block.child[i] !== undefined) {
        let hero = {};

        if (block.child[i].child){

            try {

                hero.name =     block.child[i].child[1].child[5].child[0].child[0].text;
                hero.maxPower = block.child[i].child[1].child[3].attr.title[3];
                hero.realPower = block.child[i].child[1].child[3].attr.title[1];
                hero.level = block.child[i].child[1].child[1].child[1].child[19].child[0].text;
                hero.tir = block.child[i].child[1].child[1].child[1].child[21].child[0].text;
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
    let errorMods = [];

    let i = 0;
    let modsArray = htmlData.child[3].child[15].child[3].child[3].child[1].child[5].child[1];
    while (modsArray.child[i] !== undefined) {
        if (modsArray.child[i].attr) {
            let mod = {};
            let j = 0;

            while (modsArray.child[i].child[1].child[1].child[3].child[1].child[3].child[j] !== undefined) {
                try {

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
                    //errorMods.push(mod);
                }

                j++;
            }

                clearCrit(mod);
            for (let i = 0; i < setsProps.length; i++){
               calculateMod(mod, setsProps[i].name);
            }

            result.push(mod);
        }
        i++;

    }
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
        if (mod[key].indexOf("Critical") !== -1){
            //console.log("1 ", mod[key]);
            mod[key] = mod[key].replace("Critical", "Crit");
            let newKey = mod[key].replace("Critical", "Crit");
            mod["add" + newKey] = 0;
        }
    }
}