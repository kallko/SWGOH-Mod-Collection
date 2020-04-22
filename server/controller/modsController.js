const MOD = require('../../data/mod');
const tritonMods = require('../../data/tritonMods');
const triton = require('../../data/triton');
const GUILD = require('../../data/brazzers');
const STATS = require('../../data/stats');
const loadData = require('../service/RequestsforGG');
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
						point += ' White mode presents in ' + MOD.form[mod.slot] + ' ';
					}
					if (mod.level < 15) {
						point += ' Mod level < 15' + (point ? '' : (' in ' + MOD.form[mod.slot]));
					}
					if (mod.slot !== 2 && !mod.secondary_stats.some(sstat => sstat.name === 'Speed')) {
						point += ' Mod without speed' + (point ? '' : (' in ' + MOD.form[mod.slot]));
					}
					if (point) {
						addPoint(upgrades, name, point);
					}
				});
			}
			const brokenSet = modSetBroken(unit.data.mods);
			if (brokenSet) {
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
			if (arrowMod && ((arrowMod.primary_stat.name !== 'Speed'
				&& unit.data.base_id !== 'GRIEVOUS')
				|| (arrowMod.primary_stat.name === 'Speed'
					&& arrowMod.primary_stat.value < 300000))
			) {
				addModForFarming(unit, arrowMod, fleet, arena, settings, index);
			}
			if (unit.data.mods) {
				unit.data.mods.forEach(mod =>{
					if (mod.slot !== 2) {
						addModForFarming(unit, mod, fleet, arena, settings, index);
					}
				});
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
		if (members.length === 0) {
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
				mods: mods.map((mod) => {
return {
					character: mod.character,
					slot: MOD.form[mod.slot],
					tier: mod.tier
				};
})
			});
		}
		return result;
	},
	creator: async function (options, id) {
		let result = {};
		//todo offline
		// let mods = [].concat(tritonMods.mods);
		// const player = JSON.parse(JSON.stringify(triton));
		let mods = await loadData.getAllMods(id);
		const player = await loadData.getPlayer(id);
		const existingMods = JSON.parse(JSON.stringify(mods));
		let forms = [].concat(MOD.form);
		forms.shift();
		const units = player.units;
		units.forEach(unit => {
			unit.data.speed = getExistingSpeed(mods, unit);
			unit.data.fromMods = getExistingSecondary(mods, unit);
			unit.data.fromMods.forEach(secondary => {
				let secondaryName =  Object.keys(secondary)[0];
				let statsNumber = STATS[secondaryName];
				let existStat = unit.data.stats['' + statsNumber];
				let baseStat = 0;
				switch (secondaryName) {
					case 'Potency':
					case 'Offense':
					case 'Health':
					case 'Tenacity':
					case 'Protection':
					case 'Critical Chance':
					{
						baseStat = (existStat - secondary[secondaryName].additionalSecondary) /
							(1 + secondary[secondaryName].additionalSecondaryPercent / 100 + secondary[secondaryName].secondaryFromSet / 100);
					break;
					}
					case 'Defense': {
						baseStat = (existStat - secondary[secondaryName].additionalSecondaryPercent - secondary[secondaryName].additionalSecondary / 10);
						break;
					}
					case 'Critical Damage': {
						if (secondaryName === 'Critical Damage' && unit.data.base_id === 'JOLEEBINDO') {
							console.log('inside', existStat, ' ', secondary[secondaryName].additionalSecondary / 100, ' ', secondary[secondaryName].secondaryFromSet / 100);
						}
						baseStat = existStat - secondary[secondaryName].additionalSecondaryPercent / 100 - secondary[secondaryName].secondaryFromSet / 100;
						break;
					}
					default: {
						baseStat = 'Uncalc';
					}
				}
				unit.data['base' + secondaryName] = baseStat;
			});
		});

		const joda = units.find(unit => unit.data.base_id === 'GRANDMASTERYODA');
		// console.log('Joda ', JSON.stringify(joda.data));
		if (options.blockedHeroes) {
			// mods.forEach(mod => mod.character);
			mods = mods.filter(mod => !options.blockedHeroes.some(blocked => blocked === mod.character));
		}
		result.blockedHeroes = [].concat(options.blockedHeroes);

		options.heroes.forEach(hero => {
			const unit = units.find(unit => unit.data.base_id === hero.name);
			if (unit) {
				let possibleMods = mods.filter(mod => !result.blockedHeroes.some(blocked => blocked === mod.character));

				possibleMods = possibleMods.filter(mod => hero.possibleSets.some(pset =>{
					let set = MOD.sets.find(m => m.id === mod.set);
					return set.name === pset;
				}));
				if (unit.data.gear_level < 12) {
					possibleMods = possibleMods.filter(mod => mod.rarity <= 5);
				}

				//todo for arena teams:
				possibleMods = possibleMods.filter(mod => mod.rarity >= 5);


				let bestMods = {};
				forms.forEach((form, index) => {
					if (form in hero) {
						possibleMods = possibleMods.filter(mod => (mod.slot !== index + 1 || (mod.slot === index + 1 && hero[form].some(spec => spec === mod.primary_stat.name)) ));
					}

					let temp = possibleMods.filter((mod) => mod.slot === index + 1);
					if (hero.secondary) {
						currentSecondary = hero.secondary;
						currentUnit = unit;
					} else {
						currentSecondary = null;
						currentUnit = null;
					}
					temp.sort(sortBySpeed);
					if (temp.length > 3 ) {
						temp = cutBestMods(temp);
					}
					bestMods[form] = [].concat(temp);
				});

				let bestModsForUnit = modVariator(hero, bestMods, hero.secondary, unit, hero.possibleSets);
				let newSpeed = bestModsForUnit[bestModsForUnit.length - 1];
				bestModsForUnit.pop();
				calculateNewStats(unit, bestModsForUnit);
				const isNotUpgradeble = bestModsForUnit.every(mod => mod.character === hero.name);
				if (isNotUpgradeble) {
					console.log('Congrats ', hero.name, ' have best mod set with speed ', newSpeed);
				} else {
					console.log(hero.name + (hero.secondary ? ' (' + hero.secondary : '') + ') ', unit.data.speed.existingSpeed, '/', newSpeed,
						'Health ', unit.data.stats['1'], '/', Math.round(unit.data.newHealth),
						'Protection', unit.data.stats['28'], '/', Math.round(unit.data.newProtection),
						'Damage', unit.data.stats['6'], '/', Math.round(unit.data.newOffense),
						'Potency', Math.round(unit.data.stats['17'] * 100), '/', Math.round(unit.data.newPotency * 100),
						'C-Chance',  Math.round(unit.data.stats['14']), '/', Math.round(unit.data['newCritical Chance']),
						'C-Damage', Math.round(unit.data.stats['16'] * 100) / 100, '/', Math.round(unit.data['newCritical Damage'] * 100) / 100);
					bestModsForUnit.forEach(mod => {
						let emod = existingMods.find(eMod => eMod.id === mod.id);
						if (emod.character !== hero.name) {
							//todo !comment for result
							const identifikator = mod.secondary_stats[0].name + ' ' + (('' + mod.secondary_stats[0].value).indexOf('0000') !== -1 ? mod.secondary_stats[0].value / 10000 : Math.round(mod.secondary_stats[0].value) / 100 + '%');
							const set = MOD.sets.find(mmm => mmm.id === mod.set);
							// console.log('MOD ', MOD.form[mod.slot], ' from ', emod.character);
							//todo comment uncomment for info:
							console.log('MOD ', MOD.form[mod.slot], ' from ', emod.character, 'SET:', set.name,
								'Prime:', mod.primary_stat.name + ': ' + (('' + mod.primary_stat.value).indexOf('0000') !== -1 ? mod.primary_stat.value / 10000 : Math.round(mod.primary_stat.value) / 100 + '%'),
								'Second:', identifikator,
								'tier', mod.tier, 'rarity', mod.rarity);
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
			}
			result.blockedHeroes.push(hero.name);
		});

		let leftMods = mods.filter(mod => !result.blockedHeroes.some(blocked => blocked === mod.character));
		let niceSpeedValue = 60000;
		leftMods = leftMods.filter(mod => {
			let speedStat = mod.secondary_stats.find(ss => ss.name === 'Speed');
			let niceSpeed = speedStat ? speedStat.value >= niceSpeedValue : false;
			return mod.character === '' && mod.slot !== 2 && niceSpeed;
		});
		console.log('We left behind ', leftMods.length, ' mods with speed ', niceSpeedValue / 10000 + '+');
		currentSecondary = null;
		leftMods.sort(sortBySpeed);
		MOD.sets.forEach(set => {
			let quant = leftMods.filter(mod => mod.set === set.id).length;
			console.log('For set ', set.name, ' we lost ', quant, ' mods');
		});
		return result;
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
	//todo old system
	// const heroRank = getHeroRank(unit, fleet, arena, index);
	// const limit = settings.limits.find(limit => limit.key === heroRank);

	//todo new system
	const heroRank = 'arena';
	const limit = settings.limits.find(limit => limit.key === 'arena');
	const set = settings.sets.find(sset => sset.id === mod.set);
	if ((mod.primary_stat.name !== 'Speed' && unit.data.name !== 'GRIEVOUS')
		|| (mod.primary_stat.name === 'Speed'
			&& mod.primary_stat.value < 300000)) {
		return set.count += limit.important;
	}
	const additionalSpeed = mod.secondary_stats.find(sstat => sstat.name === 'Speed');
	if (!additionalSpeed) {
		return set.count += (limit.important + 1);
	}
	if (additionalSpeed.value / 10000 < limit.minimum) {
		return set.count += limit.important;
	}
}

function getHeroRank(unit, fleet, arena, index) {
	if (arena.some(hero => unit.data.base_id ===  hero)) {
		return 'arena';
	}
	if (fleet.some(hero => unit.data.base_id ===  hero)) {
		return 'fleet';
	}
	if (index < 50) {
		return 'best';
	}
	return 'rest';
}

function modSetBroken(mods) {
	let result = [];
	MOD.sets.forEach(set => {
		const realCount = mods.filter(mod => mod.set === set.id).length;
		if (realCount && (realCount < set.setCount || (realCount % set.setCount !== 0))) {
			result.push(set.name);
		}
	});
	return result;
}

function sortByTier(first, second) {
	return second.tier - first.tier;
}

function sortBySpeed(first, second) {
	if (first.slot !== 2) {
		let firstSpeed = first.secondary_stats.find(ss => ss.name === 'Speed') || {value: 0};
		let secondSpeed = second.secondary_stats.find(ss => ss.name === 'Speed') || {value: 0};
		if (secondSpeed.value - firstSpeed.value === 0 && currentSecondary && currentUnit) {
			let firstSecondarytemp = getAdditionalSecondaryForUnit(first);
			let secondSecondarytemp = getAdditionalSecondaryForUnit(second);
			return secondSecondarytemp - firstSecondarytemp;
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

function modVariator(hero, mods, secondary, unit, possibleSets) {
	let result = [];
	let forms = [].concat(MOD.form);
	forms.shift();
	let bestSpeed = 0;
	mods.square.forEach(mSquare => {
		mods.arrow.forEach(mArrow => {
			mods.romb.forEach(mRomb => {
				mods.triangle.forEach(mTriangle => {
					mods.circle.forEach(mCircle => {
						mods.cross.forEach(mCross => {
							let completeSets = isCompleteSets({mSquare, mArrow, mRomb, mTriangle, mCircle, mCross}, possibleSets);
							const mods = [mSquare, mArrow, mRomb, mTriangle, mCircle, mCross];
							if (!hero.completeSets || (hero.completeSets && completeSets)) {
								const speed = getSpeed([mSquare, mArrow, mRomb, mTriangle, mCircle, mCross]);
								const withNewSetSpeed = Math.round(unit.data.speed.baseSpeed * (1 + speed.speedFromSet / 100) + speed.additionalSpeed);
								if (withNewSetSpeed > bestSpeed ) {
									bestSpeed = withNewSetSpeed;
									result = mods;
								}
							}
						});
					});
				});
			});
		});
	});
	result.push(bestSpeed);
	return result;
}

function isCompleteSets({mSquare, mArrow, mRomb, mTriangle, mCircle, mCross}, possibleSets) {
	const modSets = [mArrow.set, mCircle.set, mCross.set, mRomb.set, mTriangle.set, mSquare.set];
	let existSets = [];
	let result = true;
	modSets.forEach(set => {
		const setCountObj = MOD.sets.find(mSet => mSet.id === set);
		const setCount = setCountObj.setCount;
		const setName = setCountObj.name;
		const modSetExistCount = modSets.filter(mss => mss === set).length;
		if (modSetExistCount % setCount !== 0) {
			result = false;
		} else if (!existSets.some(eSet => eSet === setName)) {
				existSets.push(setName);
			}

	});
	if (!possibleSets.every(es => existSets.some(ps => ps === es))) {
		return false;
	}
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
	if (mods.filter(mod => mod.set === 4 && mod.level >= 1).length >= 4) {
		speedFromSet = 5;
		if (mods.filter(mod => mod.set === 4 && mod.level === 15).length >= 4) {
			speedFromSet = 10;
		}
	}
	return {additionalSpeed, speedFromSet};
}

function getExistingSpeed(mods, unit) {
	const name = unit.data.base_id;
	const heroMods = mods.filter(mod => mod.character === name);
	const speed = getSpeed(heroMods, name);
	const existingSpeed = unit.data.stats['5'];
	const baseSpeed = Math.round((existingSpeed - speed.additionalSpeed) / (1 + speed.speedFromSet / 100));
	return {existingSpeed, baseSpeed};
}

function getExistingSecondary(mods, unit) {
	const name = unit.data.base_id;
	const heroMods = mods.filter(mod => mod.character === name);
	return MOD.secondary.map(secondary => getSecondarySet(heroMods, name, secondary));
}

function getSecondary(mods, secondary) {
	const primaryStat = mods.reduce((sum, mod) =>{
		if (mod.primary_stat.name === secondary) {
			sum += mod.primary_stat.value / 100;
		}
		return sum;
	}, 0);
	let secondaryStat = {
		add: 0,
		percent: 0
	};
	mods.forEach(mod => mod.secondary_stats.forEach(ss => {
		if (ss.name === secondary) {
			if (ss.value > 10000) {
				secondaryStat.add += ss.value / 10000;
			} else {
				secondaryStat.percent += ss.value / 100;
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
	 let additionalSecondary = 0;
	 const addPrimeSecondaryPercent = mods.reduce((summ, mod) => {
	 	if (mod.primary_stat.name === secondary) {
	 		if (secondary === 'Defense') {
				additionalSecondary += mod.primary_stat.value / 100;
	 			return summ;
			} else {
				return summ + mod.primary_stat.value / 100;
			}
		}
		return summ;
	 }, 0);
	 mods.forEach(mod => {
		 mod.secondary_stats.forEach(ss => {
			 if (ss.name === secondary) {
				 if (ss.value % 10000 === 0) {
					 additionalSecondary += ss.value / 10000;
				 } else {
					 additionalSecondaryPercent += ss.value / 100;
				 }
			 }
		 });
	 });
	 additionalSecondaryPercent += addPrimeSecondaryPercent;
	 // todo calculate additional from set
	 const set = MOD.sets.find(set => set.name === secondary);
	 if (!set) {
		 return {[secondary]:
				 {additionalSecondaryPercent, additionalSecondary, secondaryFromSet: 0}
		 };
	 }
	 const setCount = set.setCount;
	 const setId = set.id;
	 const setBonus = set.fullBonus;
	 const fullModInSet = mods.filter(mod => mod.set === setId && mod.level === 15).length;
	 const modInSet = mods.filter(mod => mod.set === setId && mod.level < 15).length;

	 const secondaryFromSet = (fullModInSet / setCount | 0) * setBonus + (((fullModInSet + modInSet) / setCount | 0) - (fullModInSet / setCount | 0)) * setBonus / 2;
	 if (secondary === 'Speed') {
		 additionalSecondary += additionalSecondaryPercent / 100;
		 additionalSecondaryPercent = 0;
	 }
	 return {[secondary]:
			 {additionalSecondaryPercent, additionalSecondary, secondaryFromSet}
		};
 }
 function getAdditionalSecondaryForUnit(mod) {
	let result = 0;
	 let baseStatNumber = STATS[currentSecondary];
	 let baseStat = currentUnit.data.stats[baseStatNumber];
	switch (currentSecondary) {
		case 'Health':
		case 'Protection':
		case 'Offense':
		{
			let addSecondaryStats = mod.secondary_stats.filter(ss => ss.name === currentSecondary);
			let add = 0;
			let addPercent = 0;
			addSecondaryStats.forEach(stat => {
				if (stat.value % 10000 === 0) {
					add += stat.value / 10000;
				} else {
					addPercent += stat.value / 100;
				}
			});
			if (mod.primary_stat.name === currentSecondary) {
				if (mod.primary_stat.value % 10000 === 0) {
					add += mod.primary_stat.value / 10000;
				} else {
					addPercent += mod.primary_stat.value / 100;
				}
			}

			result = baseStat + add + (baseStat * addPercent / 100);
			break;
		}
		case 'Potency':
		case 'Tenacity':
		case 'Critical Chance':
			{
				let secondaryStat = mod.secondary_stats.find(ss => ss.name === currentSecondary);
				if (secondaryStat) {
					result = baseStat + secondaryStat.value / 100;
				}
				if (mod.primary_stat.name === currentSecondary) {
					result += mod.primary_stat.value / 100;
				}
				break;
			}
		default: {
			result = 0;
		}
	}
	 return result;
 }

 function calculateNewStats(unit, mods) {
	['Health', 'Protection', 'Offense', 'Critical Chance', 'Critical Damage', 'Potency'].forEach(secondary => {
		let additional = getSecondarySet(mods, '', secondary)[secondary];
		let addPercent = secondary === 'Critical Damage' ? 1 : unit.data['base' + secondary];
		unit.data['new' + secondary] = unit.data['base' + secondary] + additional.additionalSecondary + addPercent * additional.additionalSecondaryPercent / 100 + addPercent * additional.secondaryFromSet / 100;
	});
 }
