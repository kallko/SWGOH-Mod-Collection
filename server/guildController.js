const MOD = require ('../data/mod');
const tritonMods = require ('../data/tritonMods');
const triton = require ('../data/triton');
const GUILD = require ('../data/brazzers');
const STATS = require ('../data/stats');
const SQUADS = require ('../data/squads');
const loadData = require ('./RequestsforGG');
const lodash = require('lodash');
let currentSecondary = 'test';
let currentUnit = 'test';
const DEF = ['Shakti', 'Juki', 'OldRepablik', 'GrivaS', 'GrivaD', 'DRevan'];

const guildController = (module.exports =  {
	async createSquads(){
		let result = [];
		let guildSquads = [];
		let topspeedUnits = [];
		let members = GUILD;
		//todo for first testing
		// members.length = 2;
		for (let i = 0; i < members.length; i++){
			const player = await loadData.getPlayer(members[i].id);
			let memberSquads = [];
			const units = player.units;
			let usedUnits = [];
			//todo create top speed
			// units.sort(sortBySpeed);
			units.sort(sortBylife);

			topspeedUnits.push(
				{
				name: units[0].data.base_id,
				master: members[i].name,
				data: units[0].data
				},
				{
					name: units[1].data.base_id,
					master: members[i].name,
					data: units[1].data
				},
				{
					name: units[2].data.base_id,
					master: members[i].name,
					data: units[2].data
				},
				);
			console.log('Define squads for ', members[i].name);
			SQUADS.forEach(squad => {
				let possibleSoldiers = units.filter(unit => !usedUnits.some(usedUnit => usedUnit === unit.data.base_id) &&
				squad.soldiers.some(squadUnit => squadUnit === unit.data.base_id) && (unit.data.rarity === 7 || (unit.data.base_id === 'GENERALSKYWALKER' || unit.data.base_id === 'DARTHMALAK') && unit.data.level === 85));
				if (possibleSoldiers.length > 4) {
					possibleSoldiers.sort(sortByPowerDesc);
					if (squad.leader) {
						const leader = JSON.parse(JSON.stringify(possibleSoldiers.filter(soldier => soldier.data.base_id === squad.leader)));
						if (leader) {
							const squadWithoutLeader = JSON.parse(JSON.stringify(possibleSoldiers.filter(soldier => soldier.data.base_id !== squad.leader)));
							possibleSoldiers = leader.concat(squadWithoutLeader);
						}
					}
					possibleSoldiers.length = 5;
					const soldierNames = possibleSoldiers.map(soldier => soldier.data.base_id);
					memberSquads.push({
						master: members[i].name,
						squadName: squad.name,
						soldiers: soldierNames,
						power: possibleSoldiers.reduce((sum, soldier) => sum + soldier.data.power, 0),
						avgSpeed: parseInt(possibleSoldiers.reduce((sum, soldier) => sum + soldier.data.stats['5'], 0)/5)
					});
					usedUnits = usedUnits.concat(soldierNames);
				}
			});
			memberSquads.sort(sortByPowerDesc);
			guildSquads = guildSquads.concat(memberSquads);
		}
		console.log('guildSquads ', JSON.stringify(guildSquads));
		// guildSquads.sort(sortByPowerDesc);
		// guildSquads.length = 600;
		// let defSquads = guildSquads.filter((squad, index) => index >=350);
		// defSquads = lodash.sortBy(defSquads, 'squadName');
		// console.log('DefSquads ', JSON.stringify(defSquads));
		let defSquads = guildSquads.filter(squad => DEF.some(def => def === squad.squadName));
		defSquads = lodash.sortBy(defSquads, 'squadName');
		// console.log(defSquads.length, ' DefSquads ', JSON.stringify(defSquads));
		//todo top Life
		topspeedUnits.sort(sortBylife);


		//top speed
		// topspeedUnits.sort(sortBySpeed);
		topspeedUnits.length = 10;
		// topspeedUnits.forEach(unit => console.log(unit.master, unit.name, unit.data.stats['5']));
		topspeedUnits.forEach(unit => console.log(unit.master, unit.name, unit.data.stats['1']));
		return result;
	}
});

function sortByPowerDesc(first, second) {
	return (second.power || second.data.power) - (first.power ||first.data.power);
}

function sortByName(first, second) {
	return first.name - second.name;
}

function sortBySpeed(first, second) {
	return second.data.stats['5'] - first.data.stats['5'];
}

function sortBylife(first, second) {
	return second.data.stats['1'] - first.data.stats['1'];
}

function sortBySquadName(first, second) {
	console.log('First ', first);
	console.log('Return', first.squadName - second.squadName);
	return first.squadName - second.squadName;
}
