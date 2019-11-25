const MOD = require ('../data/mod');
const GUILD = require ('../data/brazzers');
const loadData = require ('./RequestsforGG');
const lodash = require('lodash');
let currentSecondary = 'test';
let currentUnit = 'test';

const modsController = (module.exports =  {
	getModsForUpgradeForDefence: function (units, mods) {
		units = concatUnitsAndMods(units, mods);
		let upgrades = [];
		units.forEach(unit => {
			const name = unit.data.base_id;
			if (unit.data.mods.length < 6) {
				addPoint(upgrades, name, ' Not all mods presents');
			}
			const arrowMod = unit.data.mods.find(mod => mod.slot === 2);
			if (arrowMod && arrowMod.primary_stat.name !== 'Speed' && name !== 'GRIEVOUS') {
				addPoint(upgrades, name, ' ArrowMod is not for Speed');
			}
			if (arrowMod && arrowMod.primary_stat.name === 'Speed' && arrowMod.primary_stat.value < 300000) {
				addPoint(upgrades, name, ' ArrowMod Speed is not maximum');
			}
			if (unit.data.mods) {
				unit.data.mods.forEach(mod => {
					let point = '';
					if (mod.tier === 1 && mod.rarity < 6) {
						point+= ' White mode presents in ' + MOD.form[mod.slot] + ' ';
					}
					if (mod.level < 15) {
						point+= ' Mod level < 15' + (point ? '' :(' in ' + MOD.form[mod.slot]));
					}
					if (mod.slot !== 2 && !mod.secondary_stats.some(sstat => sstat.name === 'Speed')) {
						point+= ' Mod without speed' + (point ? '' :(' in ' + MOD.form[mod.slot]));
					}
					if (point) {
						addPoint(upgrades, name, point);
					}
				})
			}
			const brokenSet = modSetBroken(unit.data.mods);
			if (brokenSet){
				brokenSet.forEach(modSet => {
					addPoint(upgrades, name, (' ' + modSet + ' is broken'));
				});
			}
		});
		return upgrades;
	},
	getModsForFarming: (units, mods, fleet, arena) => {
		const settings = {
			sets: [
				{id: 4, name: 'Speed', count: 0},
				{id: 5, name: 'Crit Chance', count: 0},
				{id: 3, name: 'Defense', count: 0},
				{id: 8, name: 'Tenacity', count: 0},
				{id: 2, name: 'Offense', count: 0},
				{id: 7, name: 'Efficient', count: 0},
				{id: 1, name: 'Health', count: 0},
				{id: 6, name: 'Crit Damage', count: 0},
			],
			limits: [
				{key: 'arena', minimum: 20, tier: 6, important: 4},
				{key: 'fleet', minimum: 15, tier: 6, important: 3},
				{key: 'best', minimum: 10, tier: 5, important: 2},
				{key: 'rest', minimum: 5, tier: 2, important: 1},
			]
		};
		units = concatUnitsAndMods(units, mods);
		units.forEach((unit, index) => {
			const arrowMod = unit.data.mods.find(mod => mod.slot === 2);
			if (arrowMod && ((arrowMod.primary_stat.name !== 'Speed' && unit.data.base_id !== 'GRIEVOUS') || (arrowMod.primary_stat.name === 'Speed' && arrowMod.primary_stat.value < 300000))) {
				addModForFarming(unit, arrowMod, fleet, arena, settings, index);
			}
			if (unit.data.mods) {
				unit.data.mods.forEach(mod =>{
					if (mod.slot !== 2) {
						addModForFarming(unit, mod, fleet, arena, settings, index);
					}
				})
			}
		});
		return settings.sets;
	},
	getColoredUpMods: async (allyCode) => {
		let members = GUILD;
		let result = [];
		if (allyCode) {
			members = members.filter(member => member.id === parseInt(allyCode));
		}
		if (members.length === 0){
			members.push({
				id: allyCode,
				name: 'Some Player'
			});
		}
		console.log('Members ', members);
		for (let i = 0; i < members.length; i++) {
			let mods = await loadData.getAllMods(members[i].id);
			const bestModsCount = mods.filter(mod => mod.secondary_stats.some(second => second.name === 'Speed' && second.value / 10000 >= 20)).length;
			mods = mods.filter(mod => mod.rarity === 5 && mod.slot !== 2);
			mods = mods.filter(mod =>  {
				const minSpeed = MOD.speedForUpgrade[mod.tier];
				return mod.secondary_stats.some(second => second.name === 'Speed' && second.value / 10000 > minSpeed);
			});
			mods.sort(sortByTier);
			result.push({
				name: members[i].name,
				bestModsCount: bestModsCount,
				mods: mods.map((mod) => {return {
					character: mod.character,
					slot: MOD.form[mod.slot],
					tier: mod.tier
				}})
			})
		}
		return result
	},
	creator: async function (options, id) {
		let result = {};
		let mods = await loadData.getAllMods(id);
		const existingMods = JSON.parse(JSON.stringify(mods));
		const player = await loadData.getPlayer(id);
		let forms = [].concat(MOD.form);
		forms.shift();
		const units = player.units;
		units.forEach(unit => {
			unit.data.speed = getExistingSpeed(mods, unit);
			unit.data.fromMods = getExistingSecondary(mods, unit, 'Health');
		});

		const joda = units.find(unit => unit.data.base_id === 'GRANDMASTERYODA');
		console.log('Joda ', JSON.stringify(joda.data));

		console.log('mods 0 ', mods[0]);

		// //todo check main preference for forma
		// //todo rerun after sync for arrow avoid critical
		// let  checkMain = {};
		// mods.forEach(mod => {
		// 	if (!checkMain[MOD.form[mod.slot]]) {
		// 		checkMain[MOD.form[mod.slot]] = [];
		// 	}
		// 	checkMain[MOD.form[mod.slot]].push(mod.primary_stat.name);
		// });
		// for (let key in checkMain) {
		// 	checkMain[key] = lodash.uniq(checkMain[key]);
		// }
		// console.log('CHECKMAIN ', JSON.stringify(checkMain));
		// const colnel = mods.filter(mod => mod.character === 'COLONELSTARCK');
		// console.log('COLONEL ', JSON.stringify(colnel));

		if (options.blockedHeroes) {
			mods.forEach(mod => mod.character);
			mods = mods.filter(mod => !options.blockedHeroes.some(blocked => blocked === mod.character))
		}
		result.blockedHeroes = [].concat(options.blockedHeroes);

		options.heroes.forEach(hero => {
			const unit = units.find(unit => unit.data.base_id === hero.name);
			let possibleMods = mods.filter(mod => !result.blockedHeroes.some(blocked => blocked === mod.character));
			possibleMods = possibleMods.filter(mod => hero.possibleSets.some(pset =>{
				let set = MOD.sets.find(m => m.id === mod.set);
				return set.name === pset;
			}));
			if (unit.gear_level < 12) {
				possibleMods = possibleMods.filter(mod => mod.rarity <= 5);
			}
			let bestMods = {};
			forms.forEach((form, index) => {
				if (form in hero) {
					possibleMods = possibleMods.filter(mod => (mod.slot !== index + 1 || (mod.slot === index + 1 && hero[form].some(spec => spec === mod.primary_stat.name)) ))
				}
				let temp = possibleMods.filter((mod) => mod.slot === index + 1);
				if (hero.secondary) {
					currentSecondary = hero.secondary;
					currentUnit = hero.name;
				} else {
					currentSecondary = null;
					currentUnit = null;
				}
				temp.sort(sortBySpeed);
				if (temp.length > 3 ){
					temp = cutBestMods(temp);
				}
				bestMods[form] = [].concat(temp)
			});
			// console.log('For ', hero.name, ' best ', JSON.stringify(bestMods));
			let bestModsForUnit = modVariator(hero.name, bestMods, hero.secondary, unit, existingMods);
			let newSpeed = bestModsForUnit[bestModsForUnit.length - 1];
			bestModsForUnit.pop();
			// console.log('best mods for ', hero.name, ' ', JSON.stringify(bestModsForUnit));
			const isNotUpgradeble = bestModsForUnit.every(mod => mod.character === hero.name);
			// console.log(hero.name, ' isUpgradable ', isNotUpgradeble);
			if (isNotUpgradeble) {
				console.log('Congrats ', hero.name, ' have best mod set with speed ', newSpeed);
			} else {
				console.log('You could upgrade ', hero.name, ' and receive speed ', newSpeed, ' instead of ', unit.data.speed.existingSpeed + (hero.secondary ? ' and better secondary ' + hero.secondary : ''));
				bestModsForUnit.forEach(mod => {
					let emod = existingMods.find(eMod => eMod.id === mod.id);
					if (emod.character !== hero.name) {
						//todo !comment for result
						// console.log('MOD ', MOD.form[mod.slot], ' from ', emod.character)
					}
				});
			}

			mods = mods.map(mod => {
				if (mod.character === hero.name) {
					mod.character = '';
				}
				return mod;
			});
			bestModsForUnit.forEach(bMod => {
				let mod = mods.find(m => m.id === bMod.id);
				mod.character = hero.name;
			});
			result.blockedHeroes.push(hero.name);
		});
		return result
	}
});


function addPoint(upgrades, name, point) {
	if (!upgrades.some(up => up.name === name)) {
		upgrades.push({name: name, points: []});
	}
	const unit = upgrades.find(up => up.name === name);
	unit.points.push(point);
}

function sortByPower(first, second) {
	return second.data.power - first.data.power;
}

function concatUnitsAndMods (units, mods) {
	units = units.filter(unit => unit.data.combat_type === 1 && unit.data.power > 10000);
	units.forEach(unit => {
		const unitMods = mods.filter(mod => unit.data.base_id === mod.character);
		unit.data.mods = unitMods;
	});
	units.sort(sortByPower);
	return units;
}

function addModForFarming(unit, mod, fleet, arena, settings, index) {
	const heroRank = getHeroRank(unit, fleet, arena, index);
	const limit = settings.limits.find(limit => limit.key === heroRank);
	const set = settings.sets.find(sset => sset.id === mod.set);
	if ((mod.primary_stat.name !== 'Speed' && unit.data.name !== 'GRIEVOUS') || (mod.primary_stat.name === 'Speed' && mod.primary_stat.value < 300000)) {
		return set.count+= limit.important
	}
	const additionalSpeed = mod.secondary_stats.find(sstat => sstat.name === 'Speed');
	if (!additionalSpeed){
		return set.count+= (limit.important + 1);
	}
	if (additionalSpeed.value / 10000 < limit.minimum) {
		return set.count+= limit.important;
	}
}

function getHeroRank(unit, fleet, arena, index) {
	if (arena.some(hero => unit.data.base_id ===  hero)) {
		return 'arena'
	}
	if (fleet.some(hero => unit.data.base_id ===  hero)) {
		return 'fleet'
	}
	if (index < 50) {
		return 'best'
	}
	return 'rest'
}

function modSetBroken(mods) {
	let result = [];
	MOD.sets.forEach(set => {
		const realCount = mods.filter(mod => mod.set === set.id).length;
		if (realCount && (realCount < set.setCount || (realCount%set.setCount !== 0))) {
			result.push(set.name);
		}
	});
	return result;
}

function sortByTier(first, second) {
	return second.tier - first.tier
}

function sortBySpeed(first, second) {
	if (first.slot !== 2) {
		let firstSpeed = first.secondary_stats.find(ss => ss.name === 'Speed') || {value: 0};
		let secondSpeed = second.secondary_stats.find(ss => ss.name === 'Speed') || {value: 0};
		if (secondSpeed.value - firstSpeed.value === 0 && currentSecondary && currentUnit) {
			let firstSecondary = first.secondary_stats.find(ss => ss.name === currentSecondary) || {value: 0};
			let secondSecondary = second.secondary_stats.find(ss => ss.name === currentSecondary) || {value: 0};
			return secondSecondary.value - firstSecondary.value;
		} else {
			return secondSpeed.value - firstSpeed.value;
		}
	}
	let firstSpeed = first.primary_stat.name === 'Speed' ? first.primary_stat.value : 0;
	let secondSpeed = second.primary_stat.name === 'Speed' ? second.primary_stat.value : 0;
	if (secondSpeed - firstSpeed === 0 && currentSecondary) {
		let firstSecondary = first.secondary_stats.find(ss => ss.name === currentSecondary) || {value: 0};
		let secondSecondary = second.secondary_stats.find(ss => ss.name === currentSecondary) || {value: 0};
		return secondSecondary.value - firstSecondary.value;
	} else {
		return secondSpeed - firstSpeed;
	}

}

function modVariator(hero, mods, secondary, unit, existingMods) {
	let result = [];
	let forms = [].concat(MOD.form);
	forms.shift();
	let bestChoise = {};
	let bestSpeed = 0;
	mods.square.forEach(mSquare => {
		mods.arrow.forEach(mArrow => {
			mods.romb.forEach(mRomb => {
				mods.triangle.forEach(mTriangle => {
					mods.circle.forEach(mCircle => {
						mods.cross.forEach(mCross => {
							let completeSets = isCompleteSets({mSquare, mArrow, mRomb, mTriangle, mCircle, mCross});
							const mods = [mSquare, mArrow, mRomb, mTriangle, mCircle, mCross];
							if (unit.data.name === 'GENERALKENOBI') {
								console.log('!!!!!', (!hero.completeSets || (hero.completeSets && completeSets)));
							}
							if (!hero.completeSets || (hero.completeSets && completeSets)) {
								const speed = getSpeed([mSquare, mArrow, mRomb, mTriangle, mCircle, mCross], hero);
								const setSecondary = getSecondary([mSquare, mArrow, mRomb, mTriangle, mCircle, mCross], secondary);
								const withNewSetSpeed = Math.round(unit.data.speed.baseSpeed * (1 + speed.speedFromSet/100) + speed.additionalSpeed);
								// console.log('unit ', unit.data.name, ' ', unit.data.speed.existingSpeed, '/', withNewSetSpeed);
								if (unit.data.name === 'GENERALKENOBI') {
									console.log('!!!!!', JSON.stringify(speed));
								}
								if (withNewSetSpeed > bestSpeed) {
									bestSpeed = withNewSetSpeed;
									result = mods;
								}
							}
						})
					})
				})
			})
		})
	});
	result.push(bestSpeed);
	return result;
}

function isCompleteSets({mSquare, mArrow, mRomb, mTriangle, mCircle, mCross}) {
	const modSets = [mArrow.set, mCircle.set, mCross.set, mRomb.set, mTriangle.set, mSquare.set];
	let result = true;
	modSets.forEach(set => {
		const setCountObj = MOD.sets.find(mSet => mSet.id === set);
		const setCount = setCountObj.setCount;
		const modSetExistCount = modSets.filter(mss => mss === set).length;
		if (modSetExistCount % setCount !== 0) {
			result = false;
		}

	});
	return result;
}

function getSpeed(mods) {
	let speedFromSet = 0;
	let additionalSpeed = mods.reduce((summ, mod) => {
		const addPrimeSpeed = mod.primary_stat.name === 'Speed' ? mod.primary_stat.value / 10000 : 0;
		let addSecSpeed = 0;
		const addSecSpeedStat = mod.secondary_stats.find(ss => ss.name === 'Speed');
		if (addSecSpeedStat) {
			addSecSpeed = addSecSpeedStat.value / 10000;
		}
		return summ + addPrimeSpeed + addSecSpeed;
	}, 0);
	if (mods.filter(mod => mod.set === 4 && mod.level >=1).length >= 4) {
		speedFromSet = 5;
		if (mods.filter(mod => mod.set === 4 && mod.level === 15).length >= 4) {
			speedFromSet = 10
		}
	}
	return {additionalSpeed, speedFromSet}
}

function getExistingSpeed(mods, unit) {
	const name = unit.data.base_id;
	const heroMods = mods.filter(mod => mod.character === name);
	const speed = getSpeed(heroMods, name);
	const existingSpeed = unit.data.stats['5'];
	const baseSpeed = Math.round((existingSpeed - speed.additionalSpeed)/(1 + speed.speedFromSet/100));
	return {existingSpeed, baseSpeed}
}

function getExistingSecondary(mods, unit) {
	const name = unit.data.base_id;
	const heroMods = mods.filter(mod => mod.character === name);
	return MOD.secondary.map(secondary => getSecondarySet(heroMods, name, secondary));
	// const existingSpeed = unit.data.stats['5'];
	// const baseSpeed = Math.round((existingSpeed - speed.additionalSpeed)/(1 + speed.speedFromSet/100));
	// return {existingSpeed, baseSpeed}
}

function getSecondary(mods, secondary) {
	const primaryStat = mods.reduce((sum, mod) =>{
		if (mod.primary_stat.name === secondary) {
			sum += mod.primary_stat.value/100;
		}
		return sum
	}, 0);
	let secondaryStat = {
		add: 0,
		percent: 0
	};
	mods.forEach(mod => mod.secondary_stats.forEach(ss => {
		if (ss.name === secondary) {
			if (ss.value > 10000){
				secondaryStat.add += ss.value/10000;
			} else {
				secondaryStat.percent += ss.value/100
			}
		}
	}));
	return {primaryStat, secondaryStat};
}
 function cutBestMods(mods) {
	let result = [];
	MOD.sets.forEach(set => {
		let setMods = mods.filter(mod => mod.set === set.id);
		if (setMods.length > 3) {
			let index = setMods.findIndex((mod, index) => {
				let currentSpeed = getSpeed([mod]);
				let baseSpeed =  getSpeed([setMods[0]]);
				return index >= 2 && currentSpeed.additionalSpeed < baseSpeed.additionalSpeed;
			});
			if (index > 0) {
				setMods.length = index;
			}
			result = result.concat(setMods);
		} else {
			result = result.concat(setMods);
		}
	});
	return result;
 }

 function getSecondarySet(mods, name, secondary) {
	 let additionalSecondaryPercent = 0;
	 const addPrimeSecondaryPercent = mods.reduce((summ ,mod) => {
	 	if (mod.primary_stat.name === secondary) {
	 		return summ + mod.primary_stat.value / 100;
		}
		return summ;
	 }, 0);
	 let additionalSecondary = mods.reduce((summ, mod) => {
		 const addSecSpeedStat = mod.secondary_stats.find(ss => ss.name === secondary);
		 if (addSecSpeedStat && addSecSpeedStat.value % 10000 === 0) {
		 	return summ + addSecSpeedStat.value / 10000;
		 }
		 if (addSecSpeedStat) {
			 additionalSecondaryPercent += addSecSpeedStat.value / 100
		 }
		 return summ;
	 }, 0);
	 additionalSecondaryPercent += addPrimeSecondaryPercent;
	 // todo calculate additional from set
	 const set = MOD.sets.find(set => set.name === secondary);
	 if (!set) {
		 return {[secondary]:
				 {additionalSecondaryPercent, additionalSecondary, secondaryFromSet: 0}
		 }
	 }
	 const setCount = set.setCount;
	 const setId = set.id;
	 const setBonus = set.fullBonus;
	 const fullModInSet = mods.filter(mod => mod.set === setId && mod.level === 15).length;
	 const modInSet = mods.filter(mod => mod.set === setId && mod.level < 15).length;

	 const secondaryFromSet = (fullModInSet/setCount | 0) * setBonus + (((fullModInSet + modInSet) / setCount | 0) - (fullModInSet/setCount | 0)) * setBonus / 2;
	 if (secondary === 'Speed') {
		 additionalSecondary += additionalSecondaryPercent/100;
		 additionalSecondaryPercent = 0;
	 }
	 // console.log(name, ' ', secondary, ' Add ', additionalSecondary, ' Add% ', additionalSecondaryPercent, ' SetAdd ', secondaryFromSet);
	 return {[secondary]:
			 {additionalSecondaryPercent, additionalSecondary, secondaryFromSet}
		}
 }
