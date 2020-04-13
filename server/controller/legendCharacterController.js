const loadData = require("../../server/RequestsforGG");
const brazzers = require("../../data/brazzers");
const readWriteService = require("../service/readWriteService");
const printService = require("../service/printService");
const {
  RAY_REQ_UNITS,
  KAYLO_REQ_UNITS,
} = require("../../data/requirementsForUnit");

module.exports = legendCharacterController = {
	checkGuild: async function(guild = brazzers) {
		let exitingData = JSON.parse(await readWriteService.readJson('brazzers.json'));
		let result = [];
		let testLength;
		for (let i = 0; i < (testLength || guild.length); i++) {
			const player = guild[i];
			console.log('Process ', player.name);
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
		result = legendCharacterController.compareProgress(exitingData, result);
		printService.printLegendResults(result);
		exitingData.push(result);
		readWriteService.saveLegendProgressForGuild(exitingData);
	},
	playerProgressToLegend: async function (units, mods, legendUnits) {
		const kayloUnits = units.filter(unit => legendUnits.some(KRunit => KRunit.base_id === unit.data.base_id));
		const progress = legendUnits.map(krUnit => {
			const unit = kayloUnits.find(playerUnit => playerUnit.data.base_id === krUnit.base_id);
			return unit ? Math.min(parseInt((legendCharacterController.unitPowerCorrection(unit, mods) / krUnit.power) * 100), 100) : 0;
		});
		return parseInt((progress.reduce((sum, prog) => sum + prog)) / progress.length);
	},
	unitPowerCorrection(unit, mods) {
		const unitMods = (mods.filter(mod => mod.character === unit.data.base_id).length);
		const modsPower = 750 * unitMods;
		return unit.data.power - modsPower;
	},
	compareProgress: function(existingData, newData) {
		const previous = existingData[0];
		newData.forEach(player => {
			const prev = previous.find(prevPlayer => prevPlayer.name === player.name);
			player.kyloDif = prev ? player.kyloProgress - prev.kyloProgress : player.kyloProgress;
			player.reyDif = prev ? player.reyProgress - prev.reyProgress : player.reyProgress;
		});
		return newData;
	}
};


