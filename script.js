
function main() {
	var canvas = document.getElementById('myCanvas');
	paper.setup(canvas);

	Path = paper.Path
	Point = paper.Point

	mostRecent = null
	start = null
	vector = null

	stack = []

	$('#myCanvas').mousemove(function(e){
		
		if (mostRecent) {
			mostRecent.remove()
		}

		point = new Point(e.offsetX, e.offsetY)

		if (!start) {
			// add point (circle)
			mostRecent = new paper.Path.Circle(point, 1)
			mostRecent.strokeColor = "black"
			mostRecent.data.type = "point"
			mostRecent.data.center = point
		}
		else if (!vector) {
			// add line
			mostRecent = new Path.Line(start, point)
			mostRecent.strokeColor = "black"
			mostRecent.data.type = "line"
			mostRecent.data.start = start
			mostRecent.data.end = point
		}
		else {
			// add arc
			mostRecent = makeArcPath(start, vector, point)
			mostRecent.data.type = "arc"
		}

		paper.view.draw()

	})

	$('#myCanvas').click(function(e){
		stack.push(mostRecent)
		if (mostRecent.data.type == "point") {
			start = mostRecent.data.center
			mostRecent = null
		}
		else if (mostRecent.data.type == "line") {
			start = mostRecent.data.start
			end = mostRecent.data.end
			vector = {x: end.x - start.x, y: end.y - start.y}
			start = mostRecent.data.end
			mostRecent = null
		}
		else {
			vector = getTangentToArc(mostRecent)
			start = mostRecent.data.end
			mostRecent = null
		}
	})

	$("#myCanvas").mouseout(function(){
		if (mostRecent) {
			mostRecent.remove()
			mostRecent = null
			paper.view.draw()
		}
	})


	$("#nextPointButton").click(function(){
		mostRecent = null
		start = null
		vector = null
		paper.view.draw()
	})

	$("#undoButton").click(function(){
		last = stack.pop()
		if (!last) return;
		last.remove()
		mostRecent = null
		start = null
		vector = null
		if (stack.length >= 1) {
			path = stack[stack.length - 1]
			if (path.data.type == "point") {
				start = path.data.center
			}
			else if (path.data.type == "line") {
				vector = {x: path.data.end.x - path.data.start.x, y: path.data.end.y - path.data.start.y}
				start = path.data.end
			}
			else {
				vector = getTangentToArc(path)
				start = path.data.end
			}
		}

		paper.view.draw()
	})

}



function dot(v1, v2){
	return v1.x * v2.x + v1.y * v2.y
}

function distance(p1, p2) {
	val = Math.pow(p1.x - p2.x, 2)
	val += Math.pow(p1.y - p2.y, 2)
	val = Math.pow(val, 0.5)
	return val
}

// adds an arc to the paper, returns the arc
// vector is a tangent vector at the start point
function makeArcPath(start, vector, end){
	
	m = {}
	m.x = (start.x + end.x) / 2
	m.y = (start.y + end.y) / 2
	diff = {}
	diff.x = end.x - start.x
	diff.y = end.y - start.y
	orth = {}
	orth.x = -diff.y
	orth.y = diff.x
	t = (dot(start, vector) - dot(m, vector)) / dot(orth, vector)
	center = {}
	center.x = orth.x * t + m.x
	center.y = orth.y * t + m.y

	radius = distance(center, start)

	// derive a third point
	factor = radius /distance(center, m)
	m = {x: m.x - center.x,y: m.y - center.y}
	m.x *= factor
	m.y *= factor
	m = {x: center.x + m.x, y: center.y + m.y}


	startPoint = new Point(start.x, start.y)
	midPoint = new Point(m.x, m.y)
	endPoint = new Point(end.x, end.y)
	path = new Path.Arc(startPoint, midPoint, endPoint)
	path.strokeColor = "black"

	path.data.center = new Point(center.x, center.y)
	path.data.end = endPoint

	return path
}

// returns a tangent vector at the endpoint of an arc
function getTangentToArc(arc) {
	angle = Math.atan2(arc.data.end.y - arc.data.center.y, arc.data.end.x - arc.data.center.x)
	return {x:-Math.sin(angle), y:Math.cos(angle)}
}



main();