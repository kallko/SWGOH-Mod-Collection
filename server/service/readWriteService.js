const fs = require('fs');

module.exports = readWriteService = {
	saveLegendProgressForGuild: function (results, name = 'brazzers1.json') {
		results.sort(sortByName);
		fs.writeFile('./files/' + name, JSON.stringify(results), 'utf8', (err) => {
			if (err) {
				return console.log(err);
			}
			console.log("The file was saved!");
			});
		}
};

function sortByName(first, second) {
	return second.name - first.name;
}
