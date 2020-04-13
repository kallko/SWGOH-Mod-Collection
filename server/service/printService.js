module.exports = printService = {
	printLegendResults: function (results) {
		results.sort(sortByKylo);
		results.forEach((result, index) => console.log(printService.createLineForLegendKyloProgress(index, result)));
		console.log();
		results.sort(sortByRey);
		results.forEach((result, index) => console.log(printService.createLineForLegendReyProgress(index, result)));
	},
	createLineForLegendKyloProgress: function (index, player) {
		let result = '' + (index + 1) + ' ' + player.name + ' ' + player.kyloProgress + '%' + ' (+' + player.kyloDif + '%)';
		return result;
	},
	createLineForLegendReyProgress: function (index, player) {
		let result = '' + (index + 1) + ' ' + player.name + ' ' + player.reyProgress + '%' + ' (+' + player.reyDif + '%)';
		return result;
	}
};

function sortByKylo(first, second) {
	return second.kyloProgress - first.kyloProgress;
}

function sortByRey(first, second) {
	return second.reyProgress - first.reyProgress;
}
