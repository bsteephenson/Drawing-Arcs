


def findCircle(point, vector, next):
	def dot(one, two):
		return one[0]*two[0] + one[1]*two[1]
	m = ((point[0] + next[0])/2, (point[1] + next[1])/2)
	diff = (point[0] - next[0], point[1] - next[1])
	print "diff", diff
	orth = (-diff[1], diff[0])
	print "orth", orth
	t =  (dot(vector, point) - dot(vector, m)) / dot(vector, orth)
	center = (orth[0] * t + m[0], orth[1] * t + m[1])
	return center


print findCircle((0.0, 1.0), (0.0, 1.0), (1.0, 0.0)) # should be 1,1
print findCircle((0.0, 0.0), (0.0, 1.0), (1.0, 1.0)) # should be 1,0
