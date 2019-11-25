const mod = {
	form: ['', 'square','arrow','romb', 'triangle', 'circle', 'cross'],
	sets: [
		{id: 4, name: 'Speed', setCount: 4, fullBonus: 10 },
		{id: 5, name: 'Critical Chance', setCount: 2, fullBonus: 8},
		{id: 3, name: 'Defense', setCount: 2, fullBonus: 25},
		{id: 8, name: 'Tenacity', setCount: 2, fullBonus: 20},
		{id: 2, name: 'Offense', setCount: 4, fullBonus: 15},
		{id: 7, name: 'Potency', setCount: 2, fullBonus: 15},
		{id: 1, name: 'Health', setCount: 2, fullBonus: 10},
		{id: 6, name: 'Critical Damage', setCount: 4, fullBonus: 30}
		],
	speedForUpgrade: [0, 5, 7, 11, 15, 19, 20],
	secondary: [
		'Defense',
		'Potency',
		'Offense',
		'Speed',
		'Health',
		'Tenacity',
		'Protection',
		'Critical Chance',
		'Critical Damage'
	],
	mainStat: {
		'cross': ['Protection', 'Potency', 'Tenacity', 'Defense', 'Offense', 'Health'],
		'arrow': ['Speed', 'Offense', 'Health', 'Critical Avoidance', 'Defense'],
		'circle': ['Health', 'Protection'],
		'romb': ['Defense'],
		'triangle': ['Protection', 'Critical Chance', 'Health', 'Offense', 'Critical Damage', 'Defense'],
		'square': ['Offense']
	}
};


module.exports = mod;
