module.exports = testService = {
	printLegendResults: function (results) {
		results.sort(sortByKylo);
		results.forEach((result, index) => console.log(index + 1, result.name, result.kyloProgress + '%'));
		console.log();
		results.sort(sortByRey);
		results.forEach((result, index) => console.log(index + 1, result.name, result.reyProgress + '%'));
	}
};

function sortByKylo(first, second) {
	return second.kyloProgress - first.kyloProgress;
}

function sortByRey(first, second) {
	return second.reyProgress - first.reyProgress;
}
