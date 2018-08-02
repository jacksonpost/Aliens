var request = require('request');
var fs = require('fs');

var d3597, hsa, d1915, mp16, a1, d2375; // collections
var d3597Pure, hsaPure, d1915Pure, mp16Pure, a1Pure, d2375Pure; // collections without appended values

function runMatch(){

	var url = "data/alienNamesShort.json";

	fs.readFile(url, 'utf-8', function (err, data) {
		if (err) throw err;

		d3597 = JSON.parse(data);

		d3597.sort(compareCN); // sort object by controlNumber (ascending)

		for(var i=0; i<d3597.length; i++){	
			d3597[i]["flesh"]=[];
			
			d3597[i]["refName"]=d3597[i].title.toLowerCase().replace(/,/g, "");
			d3597[i]["reverseName"]=reverseOrder(d3597[i].refName).replace(/,/g, "");
			//console.log(d3597[i].reverseName);
		}

		var url = "data/historysa.json";

	    fs.readFile(url, 'utf-8', function (err, data) {
			if (err) throw err;

			hsa = JSON.parse(data);
			//hsaPure = hsa;
			
			console.log("checking hsa");
			
			var count=0;

			for(var i=0; i<hsa.length; i++){
				var hName = hsa[i].name.toLowerCase().replace(/,/g, "");
				hsa[i]["series"]="hsa";

				for(var h=0; h<d3597.length; h++){
					var dName = d3597[h].refName;
					var rName = d3597[h].reverseName;
					if(dName.indexOf(hName) > -1 || rName.indexOf(hName) > -1){
						d3597[h].flesh.push(hsa[i]);
						
						count++;
					}
				}
			}
			console.log("hsa matched "+count);

			var url = "data/d1915_ww1Only.json";

	    	fs.readFile(url, 'utf-8', function (err, data) {
				if (err) throw err;

				d1915 = JSON.parse(data);
				
				var count=0;
				for(var i=0; i<d1915.length; i++){
					d1915[i]["series"]="d1915";
					d1915[i]["refName"]=d1915[i].title.toLowerCase().replace(/,/g, "");
					///
					var hName = d1915[i].refName;
					//console.log(hName);
					for(var h=0; h<d3597.length; h++){
						var dName = d3597[h].refName;
						var rName = d3597[h].reverseName;
						if(dName.indexOf(hName) > -1 || rName.indexOf(hName) > -1){
							//d3597[h].flesh.push({barcode: d1915[i].barcode,});
							count++;
						}
					}
					///
				}
				console.log("d1915 matched "+count);

				var url = "data/mp16.json";

	    		fs.readFile(url, 'utf-8', function (err, data) {
					if (err) throw err;

					mp16 = JSON.parse(data);
					
					var count=0;
					for(var i=0; i<mp16.length; i++){
						mp16[i]["series"]="mp16";
						mp16[i]["refName"]=mp16[i].title.toLowerCase().replace(/,/g, "");
						
						var hName = mp16[i].refName;
						for(var h=0; h<d3597.length; h++){
							var dName = d3597[h].refName;
							var rName = reverseOrder(d3597[h].refName);
							if(dName.indexOf(hName) > -1 || rName.indexOf(hName) > -1){

								delete mp16[i].refName;
								delete mp16[i].digitisedLink;

								d3597[h].flesh.push(mp16[i]);
								
								count++;
							}
						}
					}
					console.log("mp16 matched "+count);

					var url = "data/a1-matches.json";

	    			fs.readFile(url, 'utf-8', function (err, data) {
						if (err) throw err;

						a1 = JSON.parse(data);

						var count=0;
						for(var i=0; i<a1.length; i++){
							a1[i]["series"]="a1";
							a1[i]["refName"]=a1[i].internName.toLowerCase().replace(/,/g, "");
							
							var hName = a1[i].refName;
							var hCode = a1[i].internBarcode;
							for(var h=0; h<d3597.length; h++){
								var dName = d3597[h].refName;
								var rName = reverseOrder(d3597[h].refName);
								var dCode = d3597[h].barcode;
								
								//if(dName.indexOf(hName) > -1 || rName.indexOf(hName) > -1 || ){
								// ^^^ matching using names (allows duplicates)
								if(hCode==dCode){ // matching using barcodes rather than names
									delete a1[i].refName;
									a1[i]["title"] = a1[i].a1title;
									delete a1[i].a1title;
									a1[i]["barcode"] = a1[i].a1barcode;
									delete a1[i].a1barcode;

									d3597[h].flesh.push(a1[i]);
								
									count++;
								}
							}
						}
						console.log("a1 matched "+count);

						var url = "data/d2375.json";

	    				fs.readFile(url, 'utf-8', function (err, data) {
							if (err) throw err;

							d2375 = JSON.parse(data);

							var count=0;
							for(var i=0; i<d2375.length; i++){
								d2375[i]["series"]="d2375";
								d2375[i]["refName"]=d2375[i].controlSymbol.toLowerCase().replace(/[,.]/g, "");
								
								var hName = d2375[i].refName;
								for(var h=0; h<d3597.length; h++){
									var dName = d3597[h].refName;
									var rName = reverseOrder(d3597[h].refName);
									if(dName.indexOf(hName) > -1 || rName.indexOf(hName) > -1){
										
										delete d2375[i].refName;
										d2375[i]["title"] = d2375[i].controlSymbol;
										delete d2375[i].controlSymbol;

										d3597[h].flesh.push(d2375[i]);
										
										count++;
									}
								}
								
							}
							console.log("d2375 matched "+count);

							for(var i=0; i<d3597.length; i++){
								delete d3597[i].refName;
								delete d3597[i].reverseName;
							}

							writeIt();

						});
					});		
				});
			});
		});
	});
}

runMatch();

function writeIt(){
	var outputFilename = 'namesFleshedShort.json';
	fs.writeFile(outputFilename, JSON.stringify(d3597, null, 4), function(err) {
	    if(err) {
	      console.log(err);
	    } else {
	      console.log("JSON saved to " + outputFilename);
	    }
	});
}


function matchNames(keyName, checkSet, threshold){
	//console.log(checkString);
	matchThis = FuzzySet(keyName);

	for(var s=0; s<checkSet.length; s++){

		var match = matchThis.get(checkSet[s].title); 
		//console.log(match);
		if (match!=null && match[0][0] > threshold){	
			return s; 
		// only returns the first. should be amended to return an array of all matches.
		}
	}
	return null;
}

function compareCN(a,b) {
	a = parseInt(a.controlNumber);
	b = parseInt(b.controlNumber);
	if (a < b)
		return -1;
	if (a > b)
		return 1;
	return 0;
}

function reverseOrder(str){
	if(str!=null){
		return str.split(' ').reverse().join(' ');
	}
}

//nameMatcher(d3597,a1,0.9);

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
							'series':'a1'
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
							'series':'d2375',
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
							'series':'mp16',
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
