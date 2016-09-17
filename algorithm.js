/*
user input:
	dist : desired path distance
	start : starting location

const numwaypoints = 23?
const d = dist/pi
use geocoord API to convert start to coordinates if not already -> (x,y)
angle = random()*2pi
//diampoint = (x+dcos(angle),y+dsin(angle))
midpoint = (x+dcos(angle)/2,y+dsin(angle)/2) = (mx,my)

create an array angles, filled with numwaypoints random angles [random()*2pi]
calculate angle from 0 to start w.r.t midpoint -> a
sort array with comparison function
fun comp (a1,a2) = 
	a1 -= angle
	a2 -= angle
	if a1 < 0 then a1 += 2pi
	if a2 < 0 then a2 += 2pi
	return a-b
	
create new array coords s.t. coords[i] = (mx+d/2cos(angles[i]),my+d/2sin(angles[i]))
*/
//http://www.movable-type.co.uk/scripts/latlong.html
/*function getDist (lat1,lat2) {
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

// for lat, make φ1, φ2 = 0
// for long, get φ2 from lat calculation
function getLatLong (d, p1, p2) {
    var sign = d / Math.abs(d);
    d = Math.abs(d);
	var R = 3959; // radius of earth in miles
	var c = d / R;
	var a = Math.tan(c/2);
    // console.log("d", d, "p1", p1, "p2", p2, "c", c, "a", a, "asin", Math.asin(Math.sqrt(a)));
	return sign * 2 * Math.asin(Math.sqrt(a) / (Math.cos(p1)*Math.cos(p2)));
}

function makeArray (n) {
	var arr = [];
	for (var i=0; i<n; i++) {
      arr.push((Math.random() + i) * 2.0 / 5.0 * Math.PI);
	}
	return arr;
}

function getPath (dist, start) {
	var numWayPoints = 5;
	var d = dist/Math.PI;
	
	var getRandomAngle = function () {return Math.random() * 2 * Math.PI};
	
	// assume start is in geo-coords
	var x = start.lat();
	var y = start.lng();
	var angle = getRandomAngle();
	var dx = getLatLong(d*Math.cos(angle),0,0);
	var dy = getLatLong(d*Math.sin(angle),x,dx);
    // midpoint/pivot coords
	var px = x + dx/2;
	var py = y + dy/2;
	var angles = makeArray(numWayPoints);
	var mapfun = function (ang) {
		var dpx = getLatLong(d/2*Math.cos(ang),0,0);
		var dpy = getLatLong(d/2*Math.sin(ang),px,px+dpx);
		//return new google.maps.DirectionsWaypoint(new google.maps.LatLng(dpx,dpy));
        return {location: new google.maps.LatLng(px+dpx,py+dpy), stopover: false};
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
    console.log(start.lat(), start.lng());
    //console.log(waypts[0].lat(), waypts[0].lng());
    //console.log(typeof(waypts[0]));
    console.log(waypts.map(function (x) {return [x.location.lat(), x.location.lng()]}));
    directionsService.route(request, function(result, status) {
      if (status == 'OK') {
        directionsDisplay.setDirections(result);
      } else {
        console.log(status);
      }
    });
}

