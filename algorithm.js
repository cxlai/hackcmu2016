/*//http://www.movable-type.co.uk/scripts/latlong.html
function getDist (lat1,lat2) {
	var R = 3959; // radius of earth in miles
	var φ1 = lat1.toRadians();
	var φ2 = lat2.toRadians();
	var Δφ = (lat2-lat1).toRadians();
	var Δλ = (lon2-lon1).toRadians();
	
	var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
					Math.cos(φ1) * Math.cos(φ2) *
					Math.sin(Δλ/2) * Math.sin(Δλ/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	return R * c;
}*/

// inverse of the above function, taken from the internet
// d is an x OR y component. If x, p1 and p2 are 0.
function getLatLong (d, p1, p2) {
	var sign = d / Math.abs(d);
	d = Math.abs(d);
	var R = 3959; // radius of earth in miles, source google
	var c = d / R;
	var a = Math.tan(c / 2);
	return sign * 2 * Math.asin(Math.sqrt(a) / (Math.cos(p1) * Math.cos(p2)));
}

// creates an array of random angles from 0 to 2*PI
function makeArray (n) {
	var arr = [];
	for (var i = 0; i < n; i++) {
		arr.push((Math.random() + i) * 2.0 / n * Math.PI);
	}
	return arr;
}

// creates a loop of length dist from start
function getPath (dist, start) {
	var numWayPoints = 5;
	var d = dist/Math.PI;
	
	var x = start.lat();
	var y = start.lng();
	// pick a random direction around which the loop will be centered
	var angle = Math.random() * 2 * Math.PI;
	// convert distance offsets to latitude/longitude locations
	var dx = getLatLong(d * Math.cos(angle), 0, 0);
	var dy = getLatLong(d * Math.sin(angle), x, x + dx);
  // midpoint/pivot
	var px = x + dx / 2.0;
	var py = y + dy / 2.0;
	
	// get waypoints to make the loop, all the same dist from pivot
	var angles = makeArray(numWayPoints);
	// map distance to longitudes/latitudes given an angle
	var mapfun = function (ang) {
		var dpx = getLatLong(d / 2.0 * Math.cos(ang), 0, 0);
		var dpy = getLatLong(d / 2.0 * Math.sin(ang), px, px + dpx);
    return {location: new google.maps.LatLng(px + dpx, py + dpy), 
						stopover: false};
	}
	var waypts = angles.map(mapfun);
	var request = {
		origin: start,
		travelMode: 'WALKING',
		waypoints: waypts,
		destination: start,
		provideRouteAlternatives: false,
		optimizeWaypoints: true
	};
	
	directionsService.route(request, function(result, status) {
		if (status == 'OK') {
			directionsDisplay.setDirections(result);
		} else {
			console.log(status);
		}
	});
}