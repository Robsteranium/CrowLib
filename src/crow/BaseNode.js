goog.provide('crow.BaseNode');

/**
 * Basic node object.
 * @param {Array} arr Two-element array containing the x- and y-coordinates (in that order) of this element.
 * @property {Number} x x-coordinate of this node.
 * @property {Number} y y-coordinate of this node.
 * @property {Number} hash hash value of this node (a semi-unique identifier for this node).
 * @constructor
 */
crow.BaseNode = function(arr){
	if(arr){
		this.x = arr[0];
		this.y = arr[1];
	}
	this._initialized = false;
};

crow.BaseNode.prototype._initialize = function(){
	if(!this._initialized){
		this._initialized = true;
		
		var x = this.getX(), y = this.getY();
		if(typeof x !== "number") throw new Error("Node must have a valid x coord");
		if(typeof y !== "number") throw new Error("Node must have a valid y coord");
		x = Math.floor(x);
		y = Math.floor(y);
		
		this.x = x;
		this.y = y;
		this.hash = this.hash();
		
		delete this.getX;
		delete this.getY;
	}
};

// Override these position methods in your base class to provide location
// information.  By default, getX and getY return the 'x' and 'y' properties of this node.

/**
 * Get the x-coordinate of this node.
 * NOTE: once this node is added to a graph, this method is removed.  You should
 * instead rely on the 'x' property.
 * @returns {Number}
 */
crow.BaseNode.prototype.getX = function(){ return this.x; };
/**
 * Get the y-coordinate of this node.
 * NOTE: once this node is added to a graph, this method is removed.  You should
 * instead rely on the 'y' property.
 * @returns {Number}
 */
crow.BaseNode.prototype.getY = function(){ return this.y; };

// Calculating distance between nodes.	You have several options:
// 1) Simply override the distanceAlgorithm method in your derived class with
//	 a) one of the crow.GraphUtil.distance.* methods, or
//	 b) your own method that takes a dx and a dy
//   c) leave it at the default (which is manhattan distance)
// 2) Override the distanceTo method in your derived class to provide completely
//	 custom behavior 
crow.BaseNode.prototype.distanceAlgorithm = crow.GraphUtil.distance.manhattan;
crow.BaseNode.prototype.distanceTo = function(other){
	var dx = this.x - other.x,
		dy = this.y - other.y;
	
	return this.distanceAlgorithm(dx, dy);
};

/**
 * Calculate a unique string representing this node in the graph.
 * NOTE: once this node is added to a graph, this method is replaced
 * with a property of the same name containing the result of calling this method.
 * @returns {String}
 */
crow.BaseNode.prototype.hash = function(){
	return this.x + "_" + this.y;
}

// Find neighbors of this node in the provided graph
// (checks horizontally and vertically, not diagonally)
crow.BaseNode.prototype.getNeighbors = function(graph){
	var neighbors = [];
	var ox = this.x, oy = this.y;
	var n;
	n = graph.getNode(ox - 1, oy);
	if(n) neighbors.push(n);
	n = graph.getNode(ox + 1, oy);
	if(n) neighbors.push(n);
	n = graph.getNode(ox, oy - 1);
	if(n) neighbors.push(n);
	n = graph.getNode(ox, oy + 1);
	if(n) neighbors.push(n);
	return neighbors;
};
