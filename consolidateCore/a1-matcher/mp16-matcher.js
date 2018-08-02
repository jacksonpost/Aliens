
var fs = require('fs');
 var fuzzyset = require('fuzzyset.js');
var namesPath = 'data/alienNames.json';
var mp16Path = 'data/mp16.json';
var matches = [];
var match_threshhold = 0.7;

fs.readFile(namesPath, 'utf-8', function (err, fileContents) {
	if (err) throw err;
	names = JSON.parse(fileContents);
	console.log("loaded " + names.length + " names");

	fs.readFile(mp16Path, 'utf-8', function (err, fileContents) {
	  	if (err) throw err;
	  	mp16 = JSON.parse(fileContents);
	  	console.log("loaded " + mp16.length + " records");

	  	var matchnames = [];
		var matchMap = {};

		// a1 = a1.filter(function(r){ // only naturalisation records
		// 	return r.TITLE.search(/\S+aturali\S+/) > -1;
		// });

		//console.log("filtered to " + mp16.length + " naturalisation records");

/*
		matchnames = a1.map(function(a){
			var key = a.TITLE.replace(/\S+aturali\S+/,"")
			matchMap[key] = a;
		 	return key;
		});
*/

		matchnames = names.map(function(n){ 
			matchMap[n.title] = n;
			return n.title
		});

		//matchlastnames = [];

		for (var i = 0; i < names.length; i++) { // include name order reversed
			if (!names[i].title) continue;
			origname = names[i].title;
			//reversename = names[i].title.split(", ")[1] + " " + names[i].title.split(", ")[0];
			matchnames.push(origname); // add original name to the match list
			matchMap[origname] = names[i]; // store the record against the original name
			//matchMap[reversename] = names[i]; // store against  reversed name
			//matchnames.push(reversename); // add reversed name 
		//	matchlastnames.push(names[i].title.split(", ")[0]);
		};



		//console.log(matchnames);

		matcher = fuzzyset(matchnames);
		//a1lastnamematcher = fuzzyset(matchlastnames);
		console.log("built matcher");

		var matchingNames = [];

		for (var i = 0; i < mp16.length; i++) {
			var n = mp16[i];
			
			if (!n.title) continue;
			
			var matches = matcher.get(n.title);
			//console.log(matches[0]);
			if (!matches) continue;
			if (matches[0][0] > match_threshhold){

				var match = {
					'internName': matches[0][1],
					'internBarcode':matchMap[matches[0][1]].barcode,
					'mp16title':n.title,
					'mp16barcode':n.barcode,
					'matchScore':matches[0][0]
				}

				matchingNames.push(match)

				//matchedNames.push(n);
				console.log(matches[0][1] + ' - ' + n.title + ' - ' + Number(matches[0][0]).toFixed(2));
			} 

			// attempting to match last names only
			/*
			else {
				matches = a1lastnamematcher.get(n.TITLE.replace(/(\W|-)+\w+aturali.+/,""));
				if (!matches) continue;
				if (matches[0][0] > 0.9){

					// var match = {
					// 	'internName': matches[0][1],
					// 	'internBarcode':matchMap[matches[0][1]].barcode,
					// 	'a1title':n.TITLE,
					// 	'a1ctrl':n.CONTROL_SYMBOL,
					// 	'a1barcode':n.BARCODE_NO,
					// 	'matchScore':matches[0][0]
					// }

					//matchingNames.push(match)

					//matchedNames.push(n);
					console.log("last name only " + matches[0][1] + ' - ' + n.TITLE);
				}	
			}

			*/
		};
			

		console.log("found " +  matchingNames.length + " names")

		var outputFilename = 'mp16Matchnames.json';

		fs.writeFile(outputFilename, JSON.stringify(matchingNames, null, 4), function(err) {
		    if(err) {
		      console.log(err);
		    } else {
		      console.log("JSON saved to " + outputFilename);
		    }
		});



	});

});