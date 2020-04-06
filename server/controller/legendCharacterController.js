const loadData = require("../../server/RequestsforGG");
const brazzers = require("../../data/brazzers");
const fs = require("fs");
const {
  RAY_REQ_UNITS,
  KAYLO_REQ_UNITS,
} = require("../../data/requirementsForUnit");

module.exports = legendCharacterController = {
	checkGuild: async function(guild = brazzers) {
		const result = [];
		for (let i = 0; i < guild.length; i++) {
			const player = guild[i];
			const units = (await loadData.getPlayer(player.id)).units;
			const mods = await loadData.getAllMods(player.id);
			const kyloProgress = await legendCharacterController.playerProgressToLegend(units, mods, KAYLO_REQ_UNITS);
			const reyProgress = await legendCharacterController.playerProgressToLegend(units, mods, RAY_REQ_UNITS);
			result.push({
				name: player.name,
				kyloProgress: kyloProgress,
				reyProgress: reyProgress
			});
		}
		legendCharacterController.printLegendResults(result);
	},
	playerProgressToLegend: async function (units, mods, legendUnits) {
		const kayloUnits = units.filter(unit => legendUnits.some(KRunit => KRunit.base_id === unit.data.base_id));
		const progress = legendUnits.map(krUnit => {
			const unit = kayloUnits.find(playerUnit => playerUnit.data.base_id === krUnit.base_id);
			return unit ? Math.min(parseInt((legendCharacterController.unitPowerCorrection(unit, mods) / krUnit.power) * 100), 100) : 0;
		});
		return parseInt((progress.reduce((sum, prog) => sum + prog)) / progress.length);
	},
	printLegendResults: function (results) {
		results.sort(sortByKylo);
		results.forEach((result, index) => console.log(index + 1, result.name, result.kyloProgress + '%'));
		console.log();
		results.sort(sortByRey);
		results.forEach((result, index) => console.log(index + 1, result.name, result.reyProgress + '%'));
		results.sort(sortByName);
		fs.writeFile('./files/brazzers.json', JSON.stringify(results), 'utf8', (err) => {
			if (err) {
				return console.log(err);
			}
			console.log("The file was saved!");
		});
	},
	unitPowerCorrection(unit, mods) {
		const unitMods = (mods.filter(mod => mod.character === unit.data.base_id).length);
		const modsPower = 750 * unitMods;
		return unit.data.power - modsPower;

	}
};

function sortByKylo(first, second) {
  return second.kyloProgress - first.kyloProgress;
}

function sortByRey(first, second) {
  return second.reyProgress - first.reyProgress;
}

function sortByName(first, second) {
  return second.name - first.name;
}
