
const options =
	{
		heroes:[
			{
				name: 'PADMEAMIDALA',
				possibleSets: ['Health', 'Health', 'Health'],
				completeSets: true,
				arrow:['Speed'],
				triangle: ['Critical Damage'],
				circle: ['Health'],
				secondary: 'Health',
			},
			{
				name: 'ANAKINKNIGHT',
				possibleSets: ['Health', 'Speed'],
				completeSets: true,
				arrow:['Speed'],
				triangle: ['Offense'],
				circle: ['Health'],
				secondary: 'Critical Chance',
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
				name: 'AHSOKATANO',
				possibleSets: ['Speed', 'Critical Chance'],
				completeSets: true,
				arrow:['Speed'],
				triangle: ['Critical Damage'],
				secondary: 'Offense',
			},
			{
				name: 'GENERALKENOBI',
				possibleSets: ['Defense'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Protection'
			},
			{
				name: 'C3POLEGENDARY',
				possibleSets: ['Speed','Potency'],
				completeSets: true,
				arrow:['Speed'],
				cross:['Potency'],
				triangle: ['Protection', 'Health'],
				circle: ['Protection', 'Health'],
				secondary: 'Potency'
			},
			{
				name: 'JEDIKNIGHTREVAN',
				possibleSets: ['Speed', 'Critical Chance'],
				completeSets: true,
				arrow: ['Speed'],
				secondary: 'Offense'
			},
			{
				name: 'JOLEEBINDO',
				possibleSets: ['Speed', 'Health'],
				completeSets: true,
				secondary: 'Health',
				cross: ['Tenacity'],
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
				name: 'BOSSK',
				possibleSets: ['Tenacity'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Health',
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
				name: 'SITHASSASSIN',
				possibleSets: ['Speed', 'Critical Chance'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Offense',
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
				name: 'DARTHMALAK',
				possibleSets: ['Tenacity'],
				completeSets: true,
				arrow:['Critical Avoidance'],
				secondary: 'Health',
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
				name: 'EZRABRIDGERS3',
				possibleSets: ['Speed', 'Critical Chance'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Critical Chance',
			},
			{
				name: 'SHAAKTI',
				possibleSets: ['Health', 'Speed'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Health',
			},
			{
				name: 'CLONESERGEANTPHASEI',
				possibleSets: ['Critical Damage', 'Health'],
				completeSets: true,
				arrow:['Speed'],
				triangle: ['Critical Damage'],
				secondary: 'Offense',
			},
			{
				name: 'CT7567',
				possibleSets: ['Speed', "Critical Chance"],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Critical Chance',
			},
			{
				name: 'CT210408',
				possibleSets: ["Critical Chance", "Critical Damage"],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Offense',
			},
			{
				name: 'CT5555',
				possibleSets: ['Health', "Defense"],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Protection',
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
				name: 'GEONOSIANBROODALPHA',
				possibleSets: ['Speed', 'Critical Chance'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Critical Chance',
				cross: ['Health'],
			},
			{
				name: 'GEONOSIANSOLDIER',
				possibleSets: ['Speed', 'Critical Chance'],
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
				name: 'POGGLETHELESSER',
				possibleSets: ['Potency', 'Health'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Potency',
				cross: ['Potency'],
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
				possibleSets: ['Health', 'Critical Chance'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Offense',
				triangle: ['Critical Damage'],
			},
			{
				name: 'IG88',
				possibleSets: ['Critical Chance'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Offense',
				triangle: ['Critical Damage'],
				cross: ['Potency'],
			},
			{
				name: 'DENGAR',
				possibleSets: ['Critical Chance'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Critical Chance',
				triangle: ['Critical Chance'],
			},
			{
				name: 'CADBANE',
				possibleSets: ['Critical Chance', 'Speed'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Offense',
			},
			{
				name: 'DARTHTRAYA',
				possibleSets: ['Speed', 'Defense'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Defense',
			},
			{
				name: 'VADER',
				possibleSets: ['Speed', 'Potency'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Critical Chance',
				triangle: ['Critical Damage']
			},
			{
				name: 'EMPERORPALPATINE',
				possibleSets: ['Potency', 'Speed'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Potency',
				cross: ['Potency'],
			},
			{
				name: 'DARTHSION',
				possibleSets: ['Speed', 'Defense'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Potency',
			},
			{
				name: 'DARTHNIHILUS',
				possibleSets: ['Speed', 'Health'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Protection',
			},
			{
				name: 'KYLORENUNMASKED',
				possibleSets: ["Health"],
				completeSets: true,
				arrow:['Speed'],
				cross: ["Health"],
				triangle: ["Health"],
				circle: ["Health"],
				secondary: 'Health',
			},
			{
				name: 'FIRSTORDEREXECUTIONER',
				possibleSets: ["Health", "Critical Damage"],
				completeSets: true,
				arrow:['Speed'],
				triangle: ["Critical Damage"],
				secondary: 'Critical Chance',
			},
			{
				name: 'KYLOREN',
				possibleSets: ["Tenacity", "Offense"],
				completeSets: true,
				triangle: ["Critical Damage"],
				arrow:['Speed'],
				cross:['Offense'],
				secondary: 'Critical Chance',
			},
			{
				name: 'FIRSTORDEROFFICERMALE',
				possibleSets: ["Health", "Speed"],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Health',
			},
			{
				name: 'PHASMA',
				possibleSets: ["Health", "Speed"],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Health',
			},



			{
				name: 'EWOKELDER',
				possibleSets: ['Tenacity', "Health"],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Health',
			},
			{
				name: 'CHIEFCHIRPA',
				possibleSets: ['Speed', 'Health'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Health',
			},
			{
				name: 'LOGRAY',
				possibleSets: ['Potency', 'Potency', 'Potency'],
				completeSets: true,
				secondary: 'Potency',
				arrow:['Speed'],
				cross:['Potency']
			},
			{
				name: 'EWOKSCOUT',
				possibleSets: ['Offense', 'Critical Chance'],
				completeSets: true,
				arrow:['Speed'],
				triangle: ['Critical Damage'],
				secondary: 'Offense',
			},
			{
				name: 'PAPLOO',
				possibleSets: ['Defense'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Protection'
			},
			{
				name: 'COMMANDERLUKESKYWALKER',
				possibleSets: ['Speed', 'Potency'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Potency',
			},
			{
				name: 'STORMTROOPERHAN',
				possibleSets: ['Defense'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Protection',
			},
			{
				name: 'CARTHONASI',
				possibleSets: ['Speed', 'Critical Chance'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Critical Chance',
			},
			{
				name: 'CANDEROUSORDO',
				possibleSets: ['Offense', 'Critical Chance'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Potency',
			},
			{
				name: 'ZAALBAR',
				possibleSets: ['Defense', 'Health'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Critical Chance',
			},
			{
				name: 'MISSIONVAO',
				possibleSets: ['Offense', "Health"],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Health',
			},
			{
				name: 'JUHANI',
				possibleSets: ['Health', 'Defense'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Critical Chance',
			},
			{
				name: 'SABINEWRENS3',
				possibleSets: ['Speed', 'Potency'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Potency',
			},
			{
				name: 'HERASYNDULLAS3',
				possibleSets: ['Speed', "Defense"],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Health',
			},
			{
				name: 'CHOPPERS3',
				possibleSets: ['Defense', 'Health'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Protection',
			},
			{
				name: 'ZEBS3',
				possibleSets: ['Speed', 'Potency'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Health',
			},
			{
				name: 'KANANJARRUSS3',
				possibleSets: ['Defense', 'Health'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Health',
			},
			{
				name: 'MOTHERTALZIN',
				possibleSets: ["Potency"],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Potency',
			},
			{
				name: 'DAKA',
				possibleSets: ["Speed", "Health"],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Potency',
			},
			{
				name: 'NIGHTSISTERZOMBIE',
				possibleSets: ['Defense', 'Tenacity', 'Health'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Health',
			},
			{
				name: 'ASAJVENTRESS',
				possibleSets: ["Critical Chance", "Potency"],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Potency',
			},
			{
				name: 'NIGHTSISTERSPIRIT',
				possibleSets: ["Potency"],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Potency',
			},
			{
				name: 'GRANDMOFFTARKIN',
				possibleSets: ["Potency", "Health"],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Potency',
			},
			{
				name: 'GRANDADMIRALTHRAWN',
				possibleSets: ["Health", "Potency",],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Protection',
			},
			{
				name: 'TIEFIGHTERPILOT',
				possibleSets: [ "Health"],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Potency',
			},
			{
				name: 'ROYALGUARD',
				possibleSets: ["Defense"],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Protection',
			},
			{
				name: 'IMPERIALPROBEDROID',
				possibleSets: ["Health"],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Defense',
			},
			{
				name: 'JYNERSO',
				possibleSets: ["Health", "Critical Chance"],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Critical Chance',
			},
			{
				name: 'OLDBENKENOBI',
				possibleSets: ["Defense", "Health"],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Potency',
			},
			{
				name: 'R2D2_LEGENDARY',
				possibleSets: ["Potency"],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Potency',
			},
			{
				name: 'CASSIANANDOR',
				possibleSets: ["Potency", "Health"],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Potency',
			},
			{
				name: 'K2SO',
				possibleSets: ["Defense", "Health"],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Protection',
			},
			{
				name: 'MACEWINDU',
				possibleSets: ['Defense', 'Health'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Protection',
			},
			{
				name: 'JEDIKNIGHTCONSULAR',
				possibleSets: ['Health'],
				completeSets: true,
				arrow:['Speed'],
				secondary: 'Protection',
			},
			{
				name: 'FIRSTORDERTIEPILOT',
				possibleSets: [ 'Defense',  'Potency', 'Health', ],
				completeSets: true,
				secondary: 'Critical Chance',
			},

		],
	blockedHeroes: [
		// 'ADMIRALACKBAR',
		// 'GENERALKENOBI'
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

// const options =
// 	{
// 		heroes:[
// 			{
// 				name: 'EMPERORPALPATINE',
// 				possibleSets: ['Speed', 'Potency'],
// 				completeSets: true,
// 				arrow: ['Speed'],
// 				secondary: 'Potency'
// 			},
// 			{
// 				name: 'VADER',
// 				possibleSets: ['Speed', 'Potency'],
// 				completeSets: true,
// 				secondary: 'Potency',
// 				arrow:['Speed']
// 			},
// 			{
// 				name: 'DARTHTRAYA',
// 				possibleSets: ['Speed', 'Health', 'Defense'],
// 				completeSets: true,
// 				secondary: 'Protection',
// 				arrow:['Speed']
// 			},
// 			{
// 				name: 'DARTHSION',
// 				possibleSets: ['Speed', 'Health', 'Defense'],
// 				completeSets: true,
// 				secondary: 'Protection',
// 				arrow:['Speed']
// 			},
// 			{
// 				name: 'DARTHNIHILUS',
// 				possibleSets: ['Speed', 'Health'],
// 				completeSets: true,
// 				triangle: ['Critical Damage'],
// 				arrow:['Speed'],
// 				secondary: 'Protection'
// 			}
// 		],
// 		blockedHeroes: [
// 		]}
// ;


// // todo Shaman
// const options =
// 	{
// 		heroes:[
// 			{
// 				name: 'BASTILASHANDARK',
// 				possibleSets: ['Speed', 'Critical Chance', 'Defense', 'Tenacity', 'Offense', 'Potency', 'Health', 'Critical Damage'],
// 				completeSets: false,
// 				arrow: ['Speed'],
// 				secondary: 'Potency'
// 			},
// 			{
// 				name: 'DARTHREVAN',
// 				possibleSets: ['Speed', 'Potency'],
// 				completeSets: true,
// 				secondary: 'Offense',
// 				arrow:['Speed'],
// 				triangle: ['Critical Damage']
// 			},
// 			// {
// 			// 	name: 'DARTHMALAK',
// 			// 	possibleSets: ['Tenacity'],
// 			// 	completeSets: true,
// 			// 	secondary: 'Protection',
// 			// 	arrow:['Speed'],
// 			// 	// cross: ['Tenacity']
// 			// },
// 			// {
// 			// 	name: 'SITHTROOPER',
// 			// 	possibleSets: ['Health', 'Defense'],
// 			// 	completeSets: true,
// 			// 	secondary: 'Health',
// 			// 	arrow:['Speed'],
// 			// 	cross: ['Tenacity']
// 			//
// 			// },
// 			{
// 				name: 'HK47',
// 				possibleSets: ['Critical Damage', 'Critical Chance'],
// 				completeSets: true,
// 				triangle: ['Critical Damage'],
// 				arrow:['Speed'],
// 				secondary: 'Offense'
// 			},
// 			{
// 				name: 'PADMEAMIDALA',
// 				possibleSets: ['Health'],
// 				completeSets: true,
// 				triangle: ['Health'],
// 				arrow:['Health'],
// 				cross: ['Health'],
// 				secondary: 'Health'
// 			},
// 			{
// 				name: 'ANAKINKNIGHT',
// 				possibleSets: ['Critical Damage', 'Critical Chance'],
// 				completeSets: true,
// 				triangle: ['Offense'],
// 				cross:['Offense'],
// 				arrow:['Speed'],
// 				secondary: 'Offense'
// 			},
// 			{
// 				name: 'AHSOKATANO',
// 				possibleSets: ['Offense', 'Critical Chance'],
// 				completeSets: true,
// 				triangle: ['Offense'],
// 				arrow:['Speed'],
// 				cross:['Offense'],
// 				secondary: 'Offense'
// 			},
// 			{
// 				name: 'GENERALKENOBI',
// 				possibleSets: ['Speed', 'Health'],
// 				completeSets: true,
// 				arrow:['Speed'],
// 				secondary: 'Protection'
// 			},
// 			{
// 				name: 'CT7567',
// 				possibleSets: ['Speed', 'Health'],
// 				completeSets: true,
// 				triangle: ['Critical Damage'],
// 				arrow:['Speed'],
// 				cross:['Offense'],
// 				secondary: 'Offense'
// 			},
// 			{
// 				name: 'JEDIKNIGHTREVAN',
// 				possibleSets: ['Speed', 'Critical Chance'],
// 				completeSets: true,
// 				arrow:['Speed'],
// 				secondary: 'Offense'
// 			},
// 			{
// 				name: 'GRANDMASTERYODA',
// 				possibleSets: ['Offense', 'Critical Chance'],
// 				completeSets: true,
// 				triangle: ['Critical Damage'],
// 				arrow:['Speed'],
// 				secondary: 'Critical Chance'
// 			},
// 			{
// 				name: 'BASTILASHAN',
// 				possibleSets: ['Speed', 'Health'],
// 				completeSets: true,
// 				arrow:['Speed'],
// 				secondary: 'Offense'
// 			},
// 			{
// 				name: 'JOLEEBINDO',
// 				possibleSets: ['Speed', 'Health'],
// 				completeSets: true,
// 				cross: ['Tenacity'],
// 				arrow:['Speed'],
// 				secondary: 'Health'
// 			},
// 			{
// 				name: 'HERMITYODA',
// 				possibleSets: ['Speed', 'Critical Chance', 'Defense', 'Tenacity', 'Offense', 'Potency', 'Health', 'Critical Damage'],
// 				completeSets: false,
// 				arrow:['Speed'],
// 				secondary: 'Health'
// 			},
// 			{
// 				name: 'GEONOSIANBROODALPHA',
// 				possibleSets: ['Speed', 'Health'],
// 				completeSets: true,
// 				cross: ['Health'],
// 				arrow:['Speed'],
// 				secondary: 'Health'
// 			},
// 			{
// 				name: 'GEONOSIANSOLDIER',
// 				possibleSets: ['Speed', 'Potency'],
// 				completeSets: true,
// 				cross: ['Potency'],
// 				arrow:['Speed'],
// 				secondary: 'Potency'
// 			},
// 			{
// 				name: 'POGGLETHELESSER',
// 				possibleSets: ['Potency', 'Speed'],
// 				completeSets: true,
// 				cross: ['Potency'],
// 				arrow:['Speed'],
// 				secondary: 'Potency'
// 			},
// 			{
// 				name: 'GEONOSIANSPY',
// 				possibleSets: ['Speed', 'Critical Chance'],
// 				completeSets: true,
// 				triangle: ['Critical Damage'],
// 				arrow:['Speed'],
// 				secondary: 'Critical Chance'
// 			},
// 			{
// 				name: 'SUNFAC',
// 				possibleSets: ['Health', 'Defense'],
// 				completeSets: true,
// 				arrow:['Speed'],
// 				secondary: 'Protection'
// 			},
// 			{
// 				name: 'GRANDADMIRALTHRAWN',
// 				possibleSets: [],
// 				completeSets: false,
// 				arrow:['Speed'],
// 				secondary: 'Health'
// 			},
// 		],
// 		blockedHeroes: [
// 			'SITHTROOPER', 'DARTHMALAK', 'GRIEVOUS'
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
