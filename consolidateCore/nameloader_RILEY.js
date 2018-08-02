
var fs = require('fs');
var fuzzyset = require('fuzzyset.js');
var namesPath = 'data/alienNames.json';
var mp16Path = 'data/mp16.json';
var matches = [];
var match_threshhold = 0.9;
var d3597, mp16;

fs.readFile(namesPath, 'utf-8', function (err, fileContents) {
	if (err) throw err;
	names = JSON.parse(fileContents);
	console.log("loaded " + names.length + " names");

	fs.readFile(mp16Path, 'utf-8', function (err, fileContents) {
	  	if (err) throw err;
	  	mp16 = JSON.parse(fileContents);
	  	console.log("loaded " + mp16.length + " mp16 records");

	  	var matchnames = [];
		var matchMap = {};

		matchnames = names.map(function(n){ 
			matchMap[n.title] = n;
			return n.title
		});

		for (var i = 0; i < names.length; i++) { // include name order reversed
			if (!names[i].title) continue;
			origname = names[i].title;
			//reversename = names[i].title.split(", ")[1] + " " + names[i].title.split(", ")[0];
			matchnames.push(origname); // add original name to the match list
			matchMap[origname] = names[i]; // store the record against the original name
		};

		matcher = fuzzyset(matchnames);
		console.log("built matcher");

		var matchingNames = [];

		for (var i = 0; i < mp16.length; i++) {
			var n = mp16[i];
			/*
			if (!n.TITLE) continue;
			var matches = matcher.get(n.TITLE.replace(/(\W|-)+\w+aturali.+/,""));
			*/
			if (!n.title) continue;
			var matches = matcher.get(n.title);
			if (!matches) continue;
			if (matches[0][0] > match_threshhold){

				// consistent field names, save all these matches against their d3597 records
				var match = {
					'title': matches[0][1],
					'barcode':matchMap[matches[0][1]].barcode,
					//'originalTitle':n.TITLE,
					//'controlSymbol':n.CONTROL_SYMBOL,
					//'originalBarcode':n.BARCODE_NO,
					'matchScore':matches[0][0]
				}

				matchingNames.push(match)
				console.log(matches[0][1] + ' - ' + n.TITLE + ' - ' + n.CONTROL_SYMBOL);
			} 
		};
			
		console.log("processed names")

		var outputFilename = 'names_RILEY.json';


	///////////////////
		fs.writeFile(outputFilename, JSON.stringify(matchingNames, null, 4), function(err) {
		    if(err) {
		      console.log(err);
		    } else {
		      console.log("JSON saved to " + outputFilename);
		    }
		});
	///////////////////
	});

});