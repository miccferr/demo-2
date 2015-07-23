/*==========  MAP  ==========*/

var map = L.map("map",{
	center: [51.505, -0.09],
	zoom: 13,
	layers: baseLayers
});

// initialize
// var layerStamen = new L.StamenTileLayer("toner");
var layerStamen =  L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
	id: 'examples.map-i86knfo3'
}).addTo(map);

var layerOsm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

var baseLayers = {
	layerStamen,
	layerOsm
};
// define the array I'm going to fill with geojson
var osmFeatureLayer

// group control
L.control.layers(baseLayers).addTo(map);

// geocoder
var osmGeocoder = new L.Control.OSMGeocoder();
map.addControl(osmGeocoder);


/*==========  GET/POST  ==========*/

$('.fetch').on('click', function  () {
	// get the map BBOX
	var bbox = map.getBounds();	
	
	//Make the ajax request
	$.post("/postBbox",{
		SWlat: bbox._southWest.lat,
		SWlng: bbox._southWest.lng,
		NElat: bbox._northEast.lat,
		NElng: bbox._northEast.lng
	}, function(resp){
		console.log(resp)
	});
});

$('.pg2leaf').on('click',function(){
	$.get('/getData',function(res){
		console.log(res);
	});
})

$('.getOSMData').on('click',function() {

	var bbox = map.getBounds();
	$('#SWlat').val(bbox._southWest.lat);
	$('#SWlng').val(bbox._southWest.lng);
	$('#NElat').val(bbox._northEast.lat);
	$('#NElng').val(bbox._northEast.lng);

	var data = $('#query-osm').serializeArray();

	// console.log(data);
	// data.push({
	// 	SWlat: bbox._southWest.lat,
	// 	SWlng: bbox._southWest.lng,
	// 	NElat: bbox._northEast.lat,
	// 	NElng: bbox._northEast.lng
	// });

$.post('/getData/getOSMData',data,function(res){
	// console.log(res);
	// for (var key in p.features) {
	// 	console.log(p.features[key].properties.tags);
	// }
	// 
	// 

	function jsonToTable(jsonObj){
		console.log(jsonObj);
		var table ='';
		$.each(jsonObj, function(k,v){
			var rows = "<tr><td>"+ k + "</td><td>" + v +"</td></tr>" ;
			console.log(rows);
			table += rows ; 
			// table.concat(row);
			
		});
		console.log(table);
		return table
		
	};

	function onEachFeature(feature, layer) {
		if (feature.properties) {
			layer.bindPopup("<table><th><tr></tr><td><b>Key</b></td><td><b>Value</b></td></th>" +jsonToTable(feature.properties.tags)+ "</table>");
		}
	};

	function filterFeature(feature, layer){
		if (feature.properties.tags.amenities === 'biergarten'){
			return  L.marker(latlng, geojsonMarkerOptions);
			}else{
				return L.marker(latlng);
			}

 };

// 	var geojsonMarkerOptions = {
//     radius: 8,
//     fillColor: "#ff7800",
//     color: "#000",
//     weight: 1,
//     opacity: 1,
//     fillOpacity: 0.8
// };

var geojsonMarkerOptions = L.icon({
    iconUrl: 'public/images/beer.svg',    
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});


	var geojsonFeature = res;

	L.geoJson(geojsonFeature, {
		onEachFeature: onEachFeature,
		pointToLayer: function (feature, latlng) {
        return L.marker(latlng, geojsonMarkerOptions);
    },
    // filter : filterFeature
	}).addTo(map);

});

});


