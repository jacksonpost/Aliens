



function nameMatcher(source,matchSeries,matchThreshhold){
	
	var dataToMatch;
	var matchnames = [];
	var matchMap = {};

	matchnames = source.map(function(n){ // make an array of just the titles from d3597
		matchMap[n.title] = n;
		return n.title
	});

	for (var i = 0; i < source.length; i++) { // include name order reversed
			if (!source[i].title) continue;
			origname = source[i].title;
			reversename = source[i].title.split(", ")[1] + " " + source[i].title.split(", ")[0];
			matchsource.push(origname); // add original name to the match list
			matchMap[origname] = source[i]; // store the record against the original name
			matchMap[reversename] = source[i]; // store against  reversed name
			matchnames.push(reversename); // add reversed name 
		//	matchlastnames.push(names[i].title.split(", ")[0]);
	};

	matcher = fuzzyset(matchnames);
	console.log("built matcher");

	if (matchSeries == 'a1'){

		fs.readFile("/data/A1.json", 'utf-8', function (err, fileContents) {
		  	if (err) throw err;
		  	a1 = JSON.parse(fileContents);
		  	console.log("loaded " + a1.length + " a1 records");

			for (var i = 0; i < a1.length; i++) {
				var n = a1[i];
				if (!n.TITLE) continue;
				var matches = a1matcher.get(n.TITLE.replace(/(\W|-)+\w+aturali.+/,""));
				if (!matches) continue;
				for (var i=0; i<matches.length; i++){
					var matchresult = matches[i];
					if (matchresult[0] > match_threshhold){
						var match = {
							//'internName': matchresult[1],
							//'internBarcode':matchMap[matchresult[1]].barcode,
							'title':n.TITLE,
							'ctrl':n.CONTROL_SYMBOL,
							'barcode':n.BARCODE_NO,
							'matchScore':matchresult[0],
							'refCode':'a1'
						}

						sourceRecord = matchMap[matchresult[1]];
						sourceRecord.flesh.push(match); // add it to the d3597 record
					}
					console.log('a1 ' + matchresult[1] + ' - ' + n.TITLE + ' - ' + n.CONTROL_SYMBOL);
				}
			} 

		});

	}

	if (matchSeries == 'd2375'){

		fs.readFile("/data/d2375.json", 'utf-8', function (err, fileContents) {
		  	if (err) throw err;
		  	d2375 = JSON.parse(fileContents);
		  	console.log("loaded " + d2375.length + " d2375 records");

			for (var i = 0; i < d2375.length; i++) {
				var n = d2375[i];
				if (!n.controlSymbol) continue;
				var matches = a1matcher.get(n.controlSymbol);
				if (!matches) continue;
				for (var i=0; i<matches.length; i++){
					var matchresult = matches[i];
					if (matchresult[0] > match_threshhold){
						var match = {
							//'internName': matchresult[1],
							//'internBarcode':matchMap[matchresult[1]].barcode,
							'title':n.controlSymbol,
							//'ctrl':n.CONTROL_SYMBOL,
							'barcode':n.Barcode,
							'matchScore':matchresult[0],
							'refCode':'d2375',
						}

						sourceRecord = matchMap[matchresult[1]];
						sourceRecord.flesh.push(match); // add it to the d3597 record
					}
					console.log('d2375 ' + matchresult[1] + ' - ' + n.TITLE + ' - ' + n.CONTROL_SYMBOL);
				}
			} 
		});

	}

	if (matchSeries == 'mp16'){

		fs.readFile("/data/mp16.json", 'utf-8', function (err, fileContents) {
		  	if (err) throw err;
		  	mp16 = JSON.parse(fileContents);
		  	console.log("loaded " + mp16.length + " mp16 records");

			for (var i = 0; i < mp16.length; i++) {
				var n = mp16[i];
				if (!n.title) continue;
				var matches = a1matcher.get(n.title);
				if (!matches) continue;
				
				for (var i=0; i<matches.length; i++){
					var matchresult = matches[i];
					if (matchresult[0] > match_threshhold){
						var match = {
							//'internName': matchresult[1],
							//'internBarcode':matchMap[matchresult[1]].barcode,
							'title':n.title,
							//'ctrl':n.CONTROL_SYMBOL,
							'barcode':n.barcode,
							'matchScore':matchresult[0],
							'refCode':'mp16',
						}
						sourceRecord = matchMap[matchresult[1]];
						sourceRecord.flesh.push(match); // add it to the d3597 record
					}
				console.log('mp16 ' + matchresult[1] + ' - ' + n.title + ' - ' + Number(matchresult[0]).toFixed(2));
				}
			} 
		});

	}



}