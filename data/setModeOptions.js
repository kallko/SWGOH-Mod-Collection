const options =
	{
		heroes:[
			{
				name: 'JEDIKNIGHTREVAN',
				possibleSets: ['Speed', 'Critical Chance'],
				completeSets: true,
				arrow: ['Speed'],
				secondary: 'Defense'
			},
			{
				name: 'GRANDMASTERYODA',
				possibleSets: ['Offense', 'Critical Chance'],
				completeSets: true,
				secondary: 'Critical Chance',
				triangle: ['Critical Damage'],
				arrow:['Speed']
			},
			{
				name: 'BASTILASHAN',
				possibleSets: ['Speed', 'Health'],
				completeSets: true,
				secondary: 'Offense',
				arrow:['Speed']
			},
			{
				name: 'JOLEEBINDO',
				possibleSets: ['Speed', 'Health', ],
				completeSets: true,
				secondary: 'Health',
				triangle: ['Critical Damage'],
				cross: ['Tenacity'],
				arrow:['Speed']
			},
			{
				name: 'GENERALKENOBI',
				possibleSets: ['Defense'],
				completeSets: true,
				arrow:['Speed'],
				cross: ['Defense', 'Protection', 'Tenacity'],
				secondary: 'Tenacity'
			},
			{
				name: 'BOSSK',
				possibleSets: ['Tenacity'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Health',
				cross: ['Defense', 'Protection', 'Tenacity'],
			},
			{
				name: 'HANSOLO',
				possibleSets: ['Critical Damage', 'Health'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Critical Chance',
				triangle: ['Critical Damage'],
			},
			{
				name: 'CHEWBACCALEGENDARY',
				possibleSets: ['Critical Chance', 'Speed'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Potency',
				cross: ['Potency'],
			},
			{
				name: 'SITHASSASSIN',
				possibleSets: ['Speed', 'Critical Chance'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Critical Chance',
				triangle: ['Critical Damage'],
			},
			{
				name: 'BASTILASHANDARK',
				possibleSets: ['Speed', 'Potency'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Potency',
			},
			{
				name: 'DARTHREVAN',
				possibleSets: ['Speed', 'Potency'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Potency',
				triangle: ['Critical Damage']
			},
			{
				name: 'DARTHMALAK',
				possibleSets: ['Tenacity'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Tenacity',
			},
			{
				name: 'SITHMARAUDER',
				possibleSets: ['Offense', 'Critical Chance'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Offense',
				triangle: ['Critical Damage'],
				cross: ['Offense'],
			},
			{
				name: 'GEONOSIANBROODALPHA',
				possibleSets: ['Speed', 'Health'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Health',
				cross: ['Health'],
			},
			{
				name: 'GEONOSIANSOLDIER',
				possibleSets: ['Speed', 'Potency'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Potency',
				cross: ['Potency'],
			},
			{
				name: 'POGGLETHELESSER',
				possibleSets: ['Potency', 'Health'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Potency',
				cross: ['Potency'],
			},
			{
				name: 'GEONOSIANSPY',
				possibleSets: ['Speed', 'Critical Chance'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Critical Chance',
				triangle: ['Critical Damage'],
			},
			{
				name: 'SUNFAC',
				possibleSets: ['Health', 'Defense'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Protection',
			},
			{
				name: 'BOBAFETT',
				possibleSets: ['Potency', 'Critical Chance'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Offense',
				triangle: ['Critical Damage'],
			},
			{
				name: 'IG88',
				possibleSets: ['Offense', 'Critical Chance'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Offense',
				triangle: ['Critical Damage'],
				cross: ['Potency'],
			},
			{
				name: 'CADBANE',
				possibleSets: ['Critical Chance'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Critical Chance',
				triangle: ['Critical Chance'],
			},
			{
				name: 'DENGAR',
				possibleSets: ['Critical Chance'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Critical Chance',
			},
		],
	blockedHeroes: [
		'ADMIRALACKBAR'
	]}
;


// const options =
// 	{
// 		heroes:[
// 			{
// 				name: 'BASTILASHANDARK',
// 				possibleSets: ['Speed', 'Potency', 'Health'],
// 				completeSets: true,
// 				arrow: ['Speed'],
// 				secondary: 'Offense'
// 			},
// 			{
// 				name: 'DARTHREVAN',
// 				possibleSets: ['Offense', 'Critical Chance'],
// 				completeSets: true,
// 				triangle: ['Critical Damage'],
// 				arrow:['Speed']
// 			},
// 			{
// 				name: 'GRANDADMIRALTHRAWN',
// 				possibleSets: ['Speed', 'Health'],
// 				completeSets: true,
// 				arrow:['Speed']
// 			},
// 			{
// 				name: 'GEONOSIANBROODALPHA',
// 				possibleSets: ['Speed', 'Health'],
// 				completeSets: true,
// 				arrow:['Speed']
// 			},
// 			{
// 				name: 'HK47',
// 				possibleSets: ['Speed', 'Critical Chance', 'Health'],
// 				completeSets: true,
// 				triangle: ['Critical Damage'],
// 				arrow:['Speed'],
// 				secondary: 'Protection'
// 			}
// 		],
// 		blockedHeroes: [
// 			'ADMIRALACKBAR', 'HANSOLO', 'CHEWBACCALEGENDARY'
// 		]}
// ;



// const secondary = [
// 	'Defense',
// 	'Potency',
// 	'Offense',
// 	'Speed',
// 	'Health',
// 	'Tenacity',
// 	'Protection',
// 	'Critical Chance'];
//
// const possibleKeys = ['name', 'possibleSets', 'completeSets', 'secondary'];
// const form = ['square','arrow','romb', 'triangle', 'circle', 'cross'];
// const sets = [
// 	{id: 4, name: 'Speed', setCount: 4},
// 	{id: 5, name: 'Critical Chance', setCount: 2},
// 	{id: 3, name: 'Defence', setCount: 2},
// 	{id: 8, name: 'Tenacity', setCount: 2},
// 	{id: 2, name: 'Offense', setCount: 4},
// 	{id: 7, name: 'Efficient', setCount: 2},
// 	{id: 1, name: 'Health', setCount: 2},
// 	{id: 6, name: 'Critical Damage', setCount: 4}
// ];



module.exports = options;
