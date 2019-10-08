
// Find earthquakes larger than 7 degrees, in the last thousand years, in the North American continent
var url = "https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime=1000-09-24%2000:00:00&endtime=2019-10-01%2023:59:59&maxlatitude=71.658&minlatitude=6.734&maxlongitude=-47.813&minlongitude=-168.047&minmagnitude=7&orderby=time-asc";

// Marker size
function markerSize(magnitude) {
	return magnitude * magnitude * 950;
}

// Marker color
function markerColor(magnitude) {
	if (magnitude >= 9) {
		return "red";
	}
	else if (magnitude >= 8 && magnitude < 9) {
		return "yellow";
	}
	else {
		return "green";
	}
}

// Center map on Winnipeg, Canada, with a zoom far enough to see North America
var centerCity = { latitude: 49.8994, longitude: -97.1391 };
var myMap = L.map("map", {
	center: [centerCity.latitude, centerCity.longitude],
	zoom: 3
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
	attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
	maxZoom: 18,
	id: "mapbox.streets",
	accessToken: API_KEY
}).addTo(myMap);

d3.json(url, function (response) {
	var locations = response["features"];
	for (var i = 0; i < locations.length; i++) {
		var location = locations[i];
		var place = location["properties"]["place"];
		var magnitude = location["properties"]["mag"];
		var coordinates = location["geometry"]["coordinates"];
		var marker = L.circle([coordinates[1], coordinates[0]], {
			draggable: false,
			radius: markerSize(magnitude),
			fillOpacity: 0.75,
			color: markerColor(magnitude),
			fillColor: markerColor(magnitude)
		}).bindPopup(`${place}<br>Mag:${magnitude}`).addTo(myMap);
	}
});