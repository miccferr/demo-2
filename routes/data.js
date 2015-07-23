var http = require("http");
var express = require('express');
var router = express.Router();
var path = require('path');
var osmtogeojson = require('osmtogeojson');
var jsonlint = require("jsonlint");
var fs = require('fs');
var _ = require('underscore-node');



//hanlde the post request to /postBbox
router.post('/getOSMData', function (req, res) {
	// get the bbox from the client
	var bbox = req.body ;
	console.log(req.body);
	
	// take the response obj properties from the client 
	// and concatenates them into a string
	// so to have a unique bbox coord string
	function createCoords(a){
		// use _ to slice the first values of the response objects AKA the coords
		var cc = _.first(_.values(a),4)
		// store the coord in an empty array
		var arr = []
		for (var key in cc) {
			arr.push( cc[key]);
		}
		// concatenate the coords
		var coords = arr.join(',');
		return coords
	};

	/* query */
	// key-value pairings
	var keyValue = bbox.key+'='+bbox.value ;
	var endpoint = 'http://overpass-api.de/api/interpreter?data=';
	// Your query in compact Overpass QL:
	// http://overpass-api.de/query_form.html
	// converts OVPTurbo queries in compact URL-like format
	// es: '[out:json][timeout:25];(node["amenity"="drinking_water"](50.7,7.1,50.8,7.2););out body;>;out skel qt;'
	var queryOVP = '[out:json][timeout:25];(node['+keyValue+']('+createCoords(bbox)+');way['+keyValue+']('+createCoords(bbox)+');relation['+keyValue+']('+createCoords(bbox)+'););out body;>;out skel qt;'
	// [out:json][timeout:25];(node["amenity"]();way["amenity"]();relation["amenity"](););out body;>;out skel qt;
	// API url to be called
	var queryTotal = endpoint + queryOVP
	
	/*OSM GET REQUEST*/
	// OSM API GET request callback
	callback = function(response) {
		var str = '';
  		//another chunk of data has been recieved, so append it to `str`
  		// Continuously update stream with data
  		response.on('data', function (chunk) {
  			console.log('Receiving something... ');
  			str += chunk;
  		});

  		//the whole response has been recieved
  		response.on('end', function () {
  			// parse response
  			var parsed = JSON.parse(str);
  			// then convert it to geojson
  			var osmData = osmtogeojson(parsed);
  			// ship it back to the client
  			res.send(osmData);
  			console.log('wrote some data for ya, boss! ');
  		});
  	}

  	// launch the request
  	http.request(queryTotal, callback).end();

  	

  });

router.get('/', function(req, res){
	// Retrieve data from Postgres 
	// Get a Postgres client from the connection pool
	pg.connect(connectionString, function(err, client, done) {
		if(err) {
			return console.error('error fetching client from pool', err);
		}
	// SQL Query > Insert Data
	client.query("select * from items;", function(err, result) {
		res.send(result);
    	//call `done()` to release the client back to the pool
    	done();

    	if(err) {
    		return console.error('error running query', err);
    	}
    	console.log(result.rows);
    	console.log('there you go, brother! ');
    	//output: 1
    });

	// close connection
	// client.query.on('end', function() { client.end(); });
});
});

// router.get('/_getOSMData', function(req,res){ 
// 	console.log(req);
// 	console.log(res);
// 	console.log('ahllo hallo');
// });

module.exports = router;