// http://gis.stackexchange.com/questions/2951/algorithm-for-offsetting-a-latitude-longitude-by-some-amount-of-meters
function getLatLong (d, a, lat, lng) {
	var rad2deg = 180.0 / Math.PI;
	var R = 6371000; //meters
	var dx = lat + rad2deg * d * Math.cos(a) / R;
	var dy = lng + rad2deg * d * Math.sin(a) / (R * Math.cos(lat / rad2deg));
	return [dx, dy];
}

// creates an array of random angles from 0 to 2*PI
function makeArray (ref, n) {
	var arr = [];
	for (var i = 1; i <= n; i++) {
		arr.push(ref + i * 2.0 / (n+1) * Math.PI);
	}
	return arr;
}

// creates a loop of length dist from start
function getPath (dist, start) {
	var numWayPoints = 3;
	var milestometers = 1609.34;
	var d = dist * milestometers / Math.PI;
	
	var x = start.lat();
	var y = start.lng();
	// pick a random direction around which the loop will be centered
	var angle = Math.random() * 2 * Math.PI;
	// convert distance offsets to latitude/longitude locations
	var diameters = getLatLong(d, angle, x, y);
  // midpoint/pivot
	var px = (x + diameters[0]) / 2.0;
	var py = (y + diameters[1]) / 2.0;
	/*var marker = new google.maps.Marker({
    position: new google.maps.LatLng(px, py),
    title:"Hello World!"
	});
	marker.setMap(map);
	var cityCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      center: new google.maps.LatLng(px, py),
      radius: d / 2
  });*/
	
	// get waypoints to make the loop, all the same dist from pivot
	var angles = makeArray(angle+Math.PI, numWayPoints);
	console.log(angles);
	console.log(angles);
  // map distance to longitudes/latitudes given an angle
	var mapfun = function (ang) {
		newpoints = getLatLong(d / 2, ang, px, py);
    return {location: new google.maps.LatLng(newpoints[0], newpoints[1]), 
						stopover: false};
	}
	var waypts = angles.map(mapfun);
	var request = {
		origin: start,
		travelMode: 'WALKING',
		waypoints: waypts,
		destination: start,
		provideRouteAlternatives: false
		//optimizeWaypoints: true
	};
	
	directionsService.route(request, function(result, status) {
		if (status == 'OK') {
			directionsDisplay.setDirections(result);
			var total_dist = 0;
			for (x in result.routes[0].legs) {
				leg = result.routes[0].legs[x];
				total_dist += leg.distance.value;
			}
			console.log(total_dist / milestometers);
			document.getElementById("miles").innerHTML = "Miles on this path: " + Math.round(total_dist / milestometers*100)/100;
		} else {
			console.log(status);
		}
	});
}
