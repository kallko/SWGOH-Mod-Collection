const MOD = require ('../data/mod');



const modsController = (module.exports =  {
	verificateModConstructorOptions: function (options, HEROES) {
		const possibleKeys = ['name', 'possibleSets', 'completeSets', 'secondary'].concat((MOD.form));
		let result = [];
		const heroNames = HEROES.map(hero => hero.base_id);
		if (!options.heroes || options.heroes.length < 1){
			result.push ()
		}
		options.heroes.forEach((hero, index) => {
			if (!hero.name) {
				result.push('name for ' + index + ' hero not defined');
			} else {
				if (!heroNames.some(heroName => heroName === hero.name )) {
					result.push('Name ' + hero.name + ' is unknown')
				}
			}
			const heroKeys = Object.keys(hero);
			heroKeys.forEach(key => {
				if (!possibleKeys.some(pKey => pKey === key)) {
					result.push('Key ' + key + ' is unknown');
				}
			});
			let fieldNames = (hero.possibleSets || []).concat([hero.secondary]).concat(hero.triangle).concat(hero.arrow).concat(hero.cross).concat(hero.circle).concat(hero.square).concat(hero.romb);
			fieldNames = fieldNames.filter(n => n);
			let wrong = fieldNames.filter(fName => fName !== 'Critical Avoidance' && !MOD.secondary.some(m => m === fName));
			if (wrong.length > 0) {
				result.push('Wrong field name ', wrong);
			}
		});
		return result;
	},
	verificateSomerOptions: function (units, mods) {

	}
});


