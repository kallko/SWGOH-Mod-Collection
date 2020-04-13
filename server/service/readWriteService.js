const fs = require('fs');
const baseSaveUrl = './files/';

module.exports = readWriteService = {
	saveLegendProgressForGuild: function (results, name = 'brazzers1.json') {
		results.sort(sortByName);
		const fileName = join(baseSaveUrl, name);
		fs.writeFile(fileName, JSON.stringify(results), 'utf8', (err) => {
			if (err) {
				return console.log(err);
			}
			console.log("The file was saved!");
			});
		},
	readJson: async function(name = 'brazzers1.json') {
		const fileName = join(baseSaveUrl, name);
		return fs.readFileSync(fileName, 'utf8', function (err, data) {
			if (err) throw err;
			return JSON.parse(data);
		});
	}
};

function sortByName(first, second) {
	return second.name - first.name;
}

function join() {
	let args = [...arguments];
	return args.reduce((sum, arg) => sum + arg, '');
}
