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
}

// for lat, make φ1, φ2 = 0
// for long, get φ2 from lat calculation
function getLatLong (d, φ1, φ2) {
	var R = 3959; // radius of earth in miles
	var c = d / R;
	var α = Math.tan(c/2);
	return 2 * Math.asin(Math.sqrt(α) / (Math.cos(φ1)*Math.cos(φ2)));
}

function makeArray (n) {
	var arr = [];
	for (var i=0; i<n; i++) {
    arr.push(Math.random() * 2* Math.PI);
	}
	return arr;
}

function mapfn (ang,d,x) {
	var dx = getLatLong(d/2*Math.cos(ang),0,0);
	var dy = getLatLong(d/2*Math.sin(ang),x,dx);
}

function adjustAngle (ref, a) {
	b = a-ref; return b < 0 ? b + 2*Math.PI : b
}

function getPath (dist, start) {
	var numWayPoints = 23;
	var d = dist/Math.PI;
	
	var getRandomAngle = function () {return Math.random() * 2 * Math.PI};
	
	// assume start is in geo-coords
	var (x,y) = start.address_components //TODO
	var angle = getRandomAngle();
	var dx = getLatLong(d*Math.cos(angle),0,0);
	var dy = getLatLong(d*Math.sin(angle),x,dx);
	var px = x + dx/2;
	var py = y + dy/2;
	var angles = makeArray(numWayPoints);
	angles.sort(function (a,b) {return adjustAngle(a) - adjustAngle(b)});
	var mapfn = function (ang) {
		var dpx = getLatLong(d/2*Math.cos(ang),0,0);
		var dpy = getLatLong(d/2*Math.sin(ang),px,dpx);
		return (dpx,dpy);
	}
	waypts = angles.map(mapfn);
}

