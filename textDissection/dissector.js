//var request = require('request');
var fs = require('fs');
var outName = "camplife";
var sentences;

fs.readFile("BungardyCampLife.txt", 'utf-8', function (err, fileContents) {
	if (err) throw err;
	//console.log(fileContents); 
	sentences = fileContents.match(/[^\.!\?]+[\.!\?]+/g);
	writeIt();
});

function writeIt(){
	var outputFilename = outName+'.json';
	fs.writeFile(outputFilename, JSON.stringify(sentences, null, 4), function(err) {
	    if(err) {
	      console.log(err);
	    } else {
	      console.log("JSON saved to " + outputFilename);
	    }
	});
}