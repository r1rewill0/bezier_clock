var BezierController5 = function() {
	
	var temp_points, t, i, len;
	var n = 5, tstep = 0.02;
	
	function initTempPoints() {
		temp_points = [];
		for (i = 0; i < n; i++) {
			temp_points.push({x: 0, y: 0});
		}
	}
	
		function changePoints(a) {
		var p2 = {x: 0, y: 0};
		var p3 = {x: 0, y: 0};
		var p4 = {x: 0, y: 0};
		var getFor = function(prop) {
			var a1 = a[0][prop];
			var a2 = a[1][prop];
			var a3 = a[2][prop];
			var a4 = a[3][prop];
			var a5 = a[4][prop];
				
			var c2 = 256*a2 - 81*a1 - a5;
			var c3 = 16*a3 - a1 - a5;
			var c4 = 256*a4 - a1 - 81*a5;
			
			var x2 = (9*c2 -108*c3+3*c4)/576;
			var x3 = (-8*c2 + 240*c3 - 8*c4)/576;
			var x4 = (3*c2-108*c3+9*c4)/576;
			
			p2[prop] = x2;
			p3[prop] = x3;
			p4[prop] = x4;
		}
		getFor('x'); getFor('y');
		var result = [a[0], p2, p3, p4, a[4]];
		return result;
	}
	
	function drawKastandzelo(points) {
		t = 0;
			do {
				t += tstep;
				for (i = 0; i < points.length; i++) {
					var point = points[i]
					var temp_point = temp_points[i];
					temp_point.x = point.x;
					temp_point.y = point.y;
				}
				for (len = temp_points.length; len > 1; len--) {
					for (i = 0; i < len - 1; i++) {
						var point1 = temp_points[i];
						var point2 = temp_points[i + 1];
						point1.x += (point2.x - point1.x) * t;
						point1.y += (point2.y - point1.y) * t;
					}
				}
				str += ' ' + Math.round(point1.x) + ',' + Math.round(point1.y);
			}
			while (t < 1);
	}
	
	function drawBezier(points) {
		if (points.length != n) return null;
		points = changePoints(points);
		var str = points[0].x + ',' + points[0].y;
		var tt, x, y;
		for (t = 0; t <= 1; t += tstep) {
			tt = 1 - t;
			x = points[0].x*tt*tt*tt*tt + 4*points[1].x*t*tt*tt*tt + 6*points[2].x*t*t*tt*tt + 4*points[3].x*t*t*t*tt + points[4].x*t*t*t*t;
			y = points[0].y*tt*tt*tt*tt + 4*points[1].y*t*tt*tt*tt + 6*points[2].y*t*t*tt*tt + 4*points[3].y*t*t*t*tt + points[4].y*t*t*t*t;
			str += ' ' + x + ',' + y;
		}
		str += ' ' + points[4].x + ',' + points[4].y;
		return str;
	}
	
	initTempPoints();
	
	return {draw: drawBezier};
};

var BezierPanel = function(elem) {
	
	var path;
	var start_points = [{x:10,y:10}, {x:50,y:10}, {x:10,y:50}, {x:100,y:30}, {x:150,y:167}];
	var svg_points = [], points=[];
	var bezier = BezierController5();
	var width = 200, height = 300, radius = 10;
	var border = {minX: 0, minY: 0, maxX: width, maxY: height};


	function update() {
		path.plot(bezier.draw(points));
	}
	
	function showPointCoord(index, point) {
		document.getElementById('myx' + (index+1)).innerHTML = point.x;
		document.getElementById('myy' + (index+1)).innerHTML = point.y;
	}

	function addPoint(x, y, i) {
		var svg_point = draw.circle(radius).center(x, y).attr({cursor: 'pointer'});
		var point = {x: x, y: y};
		points.push(point);
		svg_point.point = point;
		svg_points.push(x, y);
		svg_point.draggable(border);
		svg_point.ind = i;
		svg_point.dragmove = function(delta, event) {
			var point = this.point;
			point.x = this.cx();
			point.y = this.cy();
			update();
			showPointCoord(this.ind, point);
		}
		showPointCoord(i, point);
	}

	function draw() {
		draw = SVG(elem).size(width, height);
		draw.rect(width, height).stroke({color: '#f06', width: 3}).fill('white');
		for (var i = 0; i < start_points.length; i++) {
			addPoint(start_points[i].x, start_points[i].y, i);
		}
		path = draw.polyline(bezier.draw(points)).fill('none').stroke({ width: 1 });
	}

	draw();
};

function BezierClock(elem) {

	var h = 200, w = 133, xpad = 50, tstep = 0.03, delay = 20;
	var oldh = 300, oldw = 200;

	var curve0 = [{x:78,y:71},{x:163,y:142},{x:136,y:242},{x:30,y:178},{x:101,y:51}];
	var curve1 = [{x:17,y:126}, {x:88,y:38}, {x:100,y:50}, {x:100,y:184}, {x:100, y:271}];
	var curve2 = [{x:30,y:50},{x:110,y:20},{x:156,y:80},{x:40,y:210},{x:175,y:270}];
	var curve3 = [{x:30,y:50},{x:150,y:80},{x:80,y:140},{x:160,y:200},{x:45,y:265}];
	//var curve4 = [{x:30,y:50},{x:70,y:160},{x:150,y:145},{x:160,y:115},{x:160,y:260}];
	var curve4 = [{x:193,y:160},{x:27,y:165},{x:56,y:106},{x:131,y:27},{x:121,y:266}];
	var curve5 = [{x:165,y:55},{x:20,y:90},{x:50,y:150},{x:160,y:205},{x:45,y:265}];
	var curve6 = [{x:105,y:20},{x:52,y:145},{x:132,y:146},{x:108,y:240},{x:36,y:145}];
	var curve7 = [{x:25,y:46},{x:162,y:48},{x:144,y:100},{x:118,y:153},{x:87,y:250}];
	var curve8 = [{x:33,y:87},{x:160,y:84},{x:67,y:247},{x:126,y:247},{x:31,y:91}];
	var curve9 = [{x:171,y:151},{x:74,y:104},{x:165,y:43},{x:163,y:181},{x:55,y:261}];
	
	var curves = [curve0, curve1, curve2, curve3, curve4, curve5, curve6, curve7, curve8, curve9];

	var draw, svg_curves, bezier, new_curve;
	var old_time, next_time, t, state;

	function init() {
		changeSizeOfCurves();
		draw = SVG(elem).size(6*w+2*xpad, h);
		initNewCurve();
		initSvgCurves();
		bezier = BezierController5();
		startTimer();
		setInterval(timer, delay);
	}
	
	function changeSizeOfCurves() {
		for (var i = 0; i < curves.length; i++) {
			var curve = curves[i];
			for (var j = 0; j < 5; j++) {
				curve[j].x = Math.round(curve[j].x * w / oldw);
				curve[j].y = Math.round(curve[j].y * h / oldh);
			}
		}
	}

	function showCurrentTime(time, time2, t) {
		updateCurve(0, time.h1);
		updateCurve(1, time.h2);
		updateCurve(2, time.m1);
		updateCurve(3, time.m2);
		updateCurve(4, time.s1);
		updateCurve(5, time.s2);
	}
	
	function showMiddleTime(time, time2, t) {
		updateCurve(0, time.h1, time2.h1, t);
		updateCurve(1, time.h2, time2.h2, t);
		updateCurve(2, time.m1, time2.m1, t);
		updateCurve(3, time.m2, time2.m2, t);
		updateCurve(4, time.s1, time2.s1, t);
		updateCurve(5, time.s2, time2.s2, t);
	}

	function updateCurve(index, value, value2, t) {
		var svg_curve = svg_curves[index];
		var next_curve = getNextCurve(value, value2, t);
		moveCurve(new_curve, next_curve, svg_curve.positionX);
		svg_curve.plot(bezier.draw(new_curve)).fill('none').stroke({ width: 3 });
	}
	
	function getNextCurve(value, value2, t) {
		var curve = curves[value];
		if (typeof(t) != 'undefined' && typeof(value2) != 'undefined') {
			var curve2 = curves[value2];
			for (var i = 0; i < 5; i++) {
				new_curve[i].x = curve[i].x + (curve2[i].x - curve[i].x) * t;
				new_curve[i].y = curve[i].y + (curve2[i].y - curve[i].y) * t;
			}
			return new_curve;
		}
		else {
			return curve;
		}
	}
	
	function moveCurve(curve1, curve2, x) {
		for (var i = 0; i < 5; i++) {
			curve1[i].x = curve2[i].x + x;
			curve1[i].y = curve2[i].y;
		}
	}
	
	function initNewCurve() {
		new_curve = [];
		for (var i = 0; i < 5; i++)
			new_curve.push({x:0,y:0});
	}
	
	function initSvgCurves() {
		svg_curves = [];
		for (var i = 0; i < 6; i++) {
			var svg_curve = draw.polyline('');
			svg_curve.index = i;
			svg_curve.positionX = i * w + (i >= 4 ? 2*xpad : i >=2 ? xpad : 0);
			svg_curves.push(svg_curve);
		}
	}

	function getTime() {
		var date = new Date();
		var h = date.getHours();
		var m = date.getMinutes();
		var s = date.getSeconds();
		var h1 = Math.floor(h/10);
		var h2 = h%10;
		var m1 = Math.floor(m/10);
		var m2 = m%10;
		var s1 = Math.floor(s/10);
		var s2 = s%10;
		return {date:date,h:h,m:m,s:s,h1:h1,h2:h2,m1:m1,m2:m2,s1:s1,s2:s2};
	}

	function sameTimes(t1, t2) {
		return t1.h == t2.h && t1.m == t2.m && t1.s == t2.s;
	}

	function startTimer() {
		state = false;
		t = 0;
		next_time = getTime();
		showCurrentTime(next_time);
	}
	
	function timer() {
		if (!state) {
			old_time = next_time;
			next_time = getTime();
			if (!sameTimes(old_time, next_time)) {
				state = true;
				t = 0;
			}
		}
		else {
			t += tstep;
			if (t <= 1) {
				showMiddleTime(old_time, next_time, t);
			}
			if (t > 1) {
				showCurrentTime(next_time);
			}
			if (t >= 1) {
				state = false;
				t = 0;
			}
		}
	}

	init();

}