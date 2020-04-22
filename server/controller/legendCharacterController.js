const loadData = require("../service/RequestsforGG");
const brazzers = require("../../data/brazzers");
const readWriteService = require("../service/readWriteService");
const printService = require("../service/printService");
const {
  RAY_REQ_UNITS,
  KAYLO_REQ_UNITS,
} = require("../../data/requirementsForUnit");
const CANTINA_RELIC_RESOURCE = require('../../data/relicUpgradeResorce').CANTINA_RELIC_RESOURCE;

module.exports = legendCharacterController = {
	checkGuild: async function (guild = brazzers) {
		let exitingData;
		try {
			exitingData = JSON.parse(
				await readWriteService.readJson('brazzers.json')
			);
		} catch (err) {
			console.log('ERRROR READ FILE');
			exitingData = [];
		}

		let result = [];
		let testLength;
		for (let i = 0; i < (testLength || guild.length); i++) {
			const player = guild[i];
			console.log('Process ', player.name);
			const units = (await loadData.getPlayer(player.id)).units;
			const mods = await loadData.getAllMods(player.id);
			const kyloProgress = await legendCharacterController.playerProgressToLegend(
				units,
				mods,
				KAYLO_REQ_UNITS
			);
			const reyProgress = await legendCharacterController.playerProgressToLegend(
				units,
				mods,
				RAY_REQ_UNITS
			);
			const existRelic = legendCharacterController.getExistRelic(units);
			result.push({
				name: player.name,
				kyloProgress: kyloProgress,
				reyProgress: reyProgress,
				existRelic
			});
		}
		result = legendCharacterController.compareProgress(exitingData, result);
		printService.printLegendResults(result);
		exitingData.push(result);
		readWriteService.saveLegendProgressForGuild(exitingData);
	},
	playerProgressToLegend: async function (units, mods, legendUnits) {
		const oneLegenddUnits = units.filter((unit) =>
			legendUnits.some((KRunit) => KRunit.base_id === unit.data.base_id)
		);
		const progress = legendUnits.map((krUnit) => {
			const unit = oneLegenddUnits.find(
				(playerUnit) => playerUnit.data.base_id === krUnit.base_id
			);
			return unit
				? Math.min(
						parseInt(
							(legendCharacterController.unitPowerCorrection(unit, mods) /
								krUnit.power) *
								100
						),
						100
				  )
				: 0;
		});
		return parseInt(
			progress.reduce((sum, prog) => sum + prog) / progress.length
		);
	},
	unitPowerCorrection(unit, mods) {
		const unitMods = mods.filter((mod) => mod.character === unit.data.base_id)
			.length;
		const modsPower = 750 * unitMods;
		return unit.data.power - modsPower;
	},
	compareProgress: function (existingData, newData) {
		const previous = existingData[0] || [];
		newData.forEach((player) => {
			const prev = previous.find(
				(prevPlayer) => prevPlayer.name === player.name
			);
			player.kyloDif = prev
				? player.kyloProgress - prev.kyloProgress
				: player.kyloProgress;
			player.reyDif = prev
				? player.reyProgress - prev.reyProgress
				: player.reyProgress;
		});
		return newData;
	},
	getExistRelic: function (units) {
		let kyloUnits = units.filter((unit) =>
			KAYLO_REQ_UNITS.some((KRunit) => KRunit.base_id === unit.data.base_id)
		);
		let kyloReqUnits = KAYLO_REQ_UNITS.map((kRUnit) => {
			const kUnit = kyloUnits.find(ekUnit => ekUnit.data.base_id === kRUnit.base_id);
			const begin = kUnit ? kUnit.data.relic_tier - 1 : 0;
			const end = kRUnit.relic;
			return {
				base_id: kRUnit.base_id,
				existRelic: kUnit ? kUnit.data.relic_tier - 2 : 0,
				begin,
				end,
				fragment: kRUnit.relic ? legendCharacterController.calculateCantinaDetailsReq('fragment', begin, end) : 0,
				partial: kRUnit.relic ? legendCharacterController.calculateCantinaDetailsReq('partial', begin, end) : 0,
				broken: kRUnit.relic ? legendCharacterController.calculateCantinaDetailsReq('broken', begin, end) : 0,
			};
		});
		let reyUnits = units.filter((unit) =>
			RAY_REQ_UNITS.some((KRunit) => KRunit.base_id === unit.data.base_id)
		);
		let reyReqUnits = RAY_REQ_UNITS.map((rRUnit) => {
			const rUnit = reyUnits.find(rkUnit => rkUnit.data.base_id === rRUnit.base_id);
			const begin = rUnit ? rUnit.data.relic_tier - 1 : 0;
			const end = rRUnit.relic;
			return {
				base_id: rRUnit.base_id,
				existRelic: rUnit ? rUnit.data.relic_tier - 2 : 0,
				begin,
				end,
				fragment: rRUnit.relic ? legendCharacterController.calculateCantinaDetailsReq('fragment', begin, end) : 0,
				partial: rRUnit.relic ? legendCharacterController.calculateCantinaDetailsReq('partial', begin, end) : 0,
				broken: rRUnit.relic ? legendCharacterController.calculateCantinaDetailsReq('broken', begin, end) : 0,
			};
		});
		const kyloReq = {
			fragment: kyloReqUnits.reduce((sum, kUnit) => sum + kUnit.fragment, 0),
			partial: kyloReqUnits.reduce((sum, kUnit) => sum + kUnit.partial, 0),
			broken: kyloReqUnits.reduce((sum, kUnit) => sum + kUnit.broken, 0),
		};
		const reyReq = {
			fragment: reyReqUnits.reduce((sum, rUnit) => sum + rUnit.fragment, 0),
			partial: reyReqUnits.reduce((sum, rUnit) => sum + rUnit.partial, 0),
			broken: reyReqUnits.reduce((sum, rUnit) => sum + rUnit.broken, 0),
		};
		return { kyloReq, reyReq };
	},
	calculateCantinaDetailsReq: function (key, begin, end) {
		const arrayForUnit = CANTINA_RELIC_RESOURCE[key].slice(begin, end);
		return arrayForUnit.reduce((sum, level) => sum + level, 0);
	}
};


