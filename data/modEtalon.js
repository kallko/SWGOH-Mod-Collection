const options =
	{
		heroes:[
			{
				name: 'PADMEAMIDALA',
				possibleSets: ['Health', 'Health', 'Health'],
				completeSets: true,
				arrow:['Speed'],
				triangle: ['Health'],
				circle: ['Health'],
				secondary: 'Health',
			},
			{
				name: 'ANAKINKNIGHT',
				possibleSets: ['Critical Chance', 'Critical Damage'],
				completeSets: true,
				arrow:['Speed'],
				triangle: ['Critical Damage'],
				circle: ['Health'],
				secondary: 'Critical Chance',
			},
			{
				name: 'GRANDMASTERYODA',
				possibleSets: ['Health', 'Speed'],
				completeSets: true,
				secondary: 'Critical Chance',
				triangle: ['Critical Damage'],
				arrow:['Speed'],
				cross:['Offense']
			},
			{
				name: 'AHSOKATANO',
				possibleSets: ['Offense', 'Health'],
				completeSets: true,
				arrow:['Speed'],
				triangle: ['Critical Damage'],
				secondary: 'Offense',
			},
			{
				name: 'C3POLEGENDARY',
				possibleSets: ['Speed', 'Potency'],
				completeSets: true,
				arrow:['Speed'],
				cross:['Potency'],
				triangle: ['Protection', 'Health'],
				circle: ['Protection', 'Health'],
				secondary: 'Potency'
			},
			]
	};

module.exports = options;
