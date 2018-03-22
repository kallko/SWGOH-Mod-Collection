/**
 * Created by andreyk on 08.03.2018.
 */
module.exports = dataCalc;

function dataCalc (){
}

dataCalc.prototype.calcSets = function (units, heroesCollection, setsProps) {
    if (heroesCollection && heroesCollection.length > 0 ){

        console.log("START CALC SETS");
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

                //console.log("TALIA addDefensePercent ", unit.addDefensePercent );
                for (let key in unit) {

                    //console.log("KEY - ", key);

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

    return units;
};

