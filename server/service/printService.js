module.exports = printService = {
	printLegendResults: function (results) {
		results.sort(sortByKylo);
		results.forEach((result, index) => console.log(printService.createLineForLegendKyloProgress(index, result)));
		console.log();
		results.sort(sortByRey);
		results.forEach((result, index) => console.log(printService.createLineForLegendReyProgress(index, result)));
	},
	createLineForLegendKyloProgress: function (index, player) {
		const kRelic = player.existRelic.kyloReq;
		let result = '' + (index + 1) + ' ' + player.name + ' ' + player.kyloProgress + '%' + ' (+' + player.kyloDif + '%) ' + kRelic.fragment + '/' + kRelic.partial + '/' + kRelic.broken;
		return result;
	},
	createLineForLegendReyProgress: function (index, player) {
		const rRelic = player.existRelic.reyReq;
		let result = '' + (index + 1) + ' ' + player.name + ' ' + player.reyProgress + '%' + ' (+' + player.reyDif + '%) ' + rRelic.fragment + '/' + rRelic.partial + '/' + rRelic.broken;
		return result;
	}
};

function sortByKylo(first, second) {
	return second.kyloProgress - first.kyloProgress;
}

function sortByRey(first, second) {
	return second.reyProgress - first.reyProgress;
}
