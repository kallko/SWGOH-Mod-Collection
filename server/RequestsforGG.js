const fetch = require("node-fetch");

const loadData = (module.exports =  {
	getAllHeroes: async function () {
		const url = 'https://swgoh.gg/api/characters/';
		const result = await fetch(url);
		const resp = await result.json();
		return resp;

	},
	getAllMods: async function (allyCode) {
		const url = 'https://swgoh.gg/api/players/'+ allyCode + '/mods/';
		const result = await fetch(url);
		const resp = await result.json();
		return resp.mods;
	},
	getPlayer: async function (allyCode) {
		const url = 'https://swgoh.gg/api/player/'+ allyCode + '/';
		const result = await fetch(url);
		const resp = await result.json();
		return resp;
	}
});
